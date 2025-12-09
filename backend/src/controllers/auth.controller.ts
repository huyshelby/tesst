import { Request, Response } from "express";
import { createUser, findUserByEmail } from "../services/user.service";
import bcrypt from "bcrypt";
import { ENV } from "../utils/env";
import { signAccessToken, signRefreshToken } from "../utils/jwt";
import {
  createSession,
  getSession,
  revokeSession,
} from "../services/session.service";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { prisma } from "../utils/prisma";

// Helper: set cookie refresh
function setRefreshCookie(res: Response, token: string) {
  const isProd = ENV.NODE_ENV === "production";
  res.cookie(ENV.COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd, // localhost dev => false; prod => true (HTTPS)
    sameSite: isProd ? "strict" : "lax",
    maxAge: ENV.REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000, // ms
    path: "/", // tuỳ chọn: chỉ cho /api/auth
  });
}

export async function register(req: Request, res: Response) {
  const { email, password, name } = res.locals.validated.body;
  const existing = await findUserByEmail(email);
  if (existing)
    return res.status(409).json({ message: "Email already registered" });

  const user = await createUser(email, password, name);
  res.status(201).json({ id: user.id, email: user.email, name: user.name });
}

export async function login(req: Request, res: Response) {
  const { email, password } = res.locals.validated.body;
  const user = await findUserByEmail(email);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  // so sánh password
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  // Tạo session refresh (DB) + refresh JWT
  const session = await createSession(user.id, ENV.REFRESH_TOKEN_DAYS);
  const refreshToken = signRefreshToken(user.id, session.id);

  // Set cookie HttpOnly
  setRefreshCookie(res, refreshToken);

  // Trả access token ngắn hạn
  const accessToken = signAccessToken(user.id, user.role);
  res.json({ token: accessToken });
}

export async function refresh(req: Request, res: Response) {
  const cookieName = ENV.COOKIE_NAME;
  const token = req.cookies?.[cookieName];

  if (!token) return res.status(401).json({ message: "Missing refresh token" });

  try {
    // Verify refresh JWT
    const payload = jwt.verify(token, ENV.JWT_REFRESH_SECRET) as {
      userId: string;
      jti: string;
      type: string;
    };
    if (payload.type !== "refresh")
      return res.status(401).json({ message: "Invalid token" });

    // Kiểm tra session trong DB
    const session = await getSession(payload.jti);
    if (!session || session.revokedAt) {
      return res.status(401).json({ message: "Refresh revoked" });
    }
    if (session.expiresAt < new Date()) {
      return res.status(401).json({ message: "Refresh expired" });
    }

    // Lấy thông tin user để có role
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Rotation: thu hồi session cũ, phát session mới
    await revokeSession(session.id);
    const newSession = await createSession(
      payload.userId,
      ENV.REFRESH_TOKEN_DAYS
    );
    const newRefresh = signRefreshToken(payload.userId, newSession.id);
    setRefreshCookie(res, newRefresh);

    // Trả access token mới với role
    const newAccess = signAccessToken(payload.userId, user.role);
    res.json({ token: newAccess });
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return res.status(401).json({ message: "Refresh JWT expired" });
    }
    if (err instanceof JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    throw err;
  }
}

export async function logout(req: Request, res: Response) {
  const cookieName = ENV.COOKIE_NAME;
  const token = req.cookies?.[cookieName];

  if (token) {
    try {
      const payload = jwt.verify(token, ENV.JWT_REFRESH_SECRET) as {
        jti: string;
      };
      await revokeSession(payload.jti);
    } catch {
      // ignore verify errors — vẫn xoá cookie
    }
  }
  // Xoá cookie
  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: ENV.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
  });
  res.json({ ok: true });
}
