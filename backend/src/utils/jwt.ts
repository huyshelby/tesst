import jwt from "jsonwebtoken";
import { ENV } from "./env";
import { Role } from "@prisma/client";

export function signAccessToken(userId: string, role: Role) {
  // Access token ngắn hạn (vd: 15 phút)
  return jwt.sign({ userId, role, type: "access" }, ENV.JWT_SECRET, {
    expiresIn: "15m",
  });
}

export function signRefreshToken(userId: string, jti: string) {
  // Refresh token dài hạn (vd: 30 ngày)
  return jwt.sign({ userId, jti, type: "refresh" }, ENV.JWT_REFRESH_SECRET, {
    expiresIn: `${ENV.REFRESH_TOKEN_DAYS}d`,
  });
}
