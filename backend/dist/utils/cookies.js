"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRefreshCookie = setRefreshCookie;
exports.clearRefreshCookie = clearRefreshCookie;
const isProd = process.env.NODE_ENV === "production";
function setRefreshCookie(res, token, days) {
    res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: isProd, // true khi HTTPS
        sameSite: isProd ? "none" : "lax", // "none" nếu cross-site + HTTPS
        domain: process.env.COOKIE_DOMAIN || undefined,
        path: "/",
        maxAge: days * 24 * 60 * 60 * 1000,
    });
}
function clearRefreshCookie(res) {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        domain: process.env.COOKIE_DOMAIN || undefined,
        path: "/",
    });
}
