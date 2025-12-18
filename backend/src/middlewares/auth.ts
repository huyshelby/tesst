import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../utils/env";
import { Role } from "@prisma/client";

export interface JwtPayload {
  id: string;
  userId: string;
  role: Role;
}
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const payload = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload; // xác minh token
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Middleware phân quyền theo role
export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Insufficient permissions",
        required: allowedRoles,
        current: req.user.role,
      });
    }

    next();
  };
}

// Shorthand middlewares
export const requireAdmin = requireRole(Role.ADMIN);

// Optional auth - doesn't fail if no token provided
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");

  if (!token) {
    return next();
  }

  try {
    const payload = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
    req.user = payload;
  } catch {
    // Invalid token, but continue without user
  }

  next();
}
export const requireUser = requireRole(Role.USER, Role.ADMIN); // Admin có thể truy cập user endpoints
