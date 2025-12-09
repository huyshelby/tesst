import { Response } from "express";

const isProd = process.env.NODE_ENV === "production";

export function setRefreshCookie(res: Response, token: string, days: number) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: isProd, // true khi HTTPS
    sameSite: isProd ? "none" : "lax", // "none" nếu cross-site + HTTPS
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: "/",
    maxAge: days * 24 * 60 * 60 * 1000,
  });
}

export function clearRefreshCookie(res: Response) {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: "/",
  });
}
