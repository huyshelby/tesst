"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.refresh = refresh;
exports.logout = logout;
const user_service_1 = require("../services/user.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const env_1 = require("../utils/env");
const jwt_1 = require("../utils/jwt");
const session_service_1 = require("../services/session.service");
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const prisma_1 = require("../utils/prisma");
// Helper: set cookie refresh
function setRefreshCookie(res, token) {
    const isProd = env_1.ENV.NODE_ENV === "production";
    res.cookie(env_1.ENV.COOKIE_NAME, token, {
        httpOnly: true,
        secure: isProd, // localhost dev => false; prod => true (HTTPS)
        sameSite: isProd ? "strict" : "lax",
        maxAge: env_1.ENV.REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000, // ms
        path: "/", // tuỳ chọn: chỉ cho /api/auth
    });
}
async function register(req, res) {
    const { email, password, name } = res.locals.validated.body;
    const existing = await (0, user_service_1.findUserByEmail)(email);
    if (existing)
        return res.status(409).json({ message: "Email already registered" });
    const user = await (0, user_service_1.createUser)(email, password, name);
    res.status(201).json({ id: user.id, email: user.email, name: user.name });
}
async function login(req, res) {
    const { email, password } = res.locals.validated.body;
    const user = await (0, user_service_1.findUserByEmail)(email);
    if (!user)
        return res.status(401).json({ message: "Invalid credentials" });
    // so sánh password
    const ok = await bcrypt_1.default.compare(password, user.password);
    if (!ok)
        return res.status(401).json({ message: "Invalid credentials" });
    // Tạo session refresh (DB) + refresh JWT
    const session = await (0, session_service_1.createSession)(user.id, env_1.ENV.REFRESH_TOKEN_DAYS);
    const refreshToken = (0, jwt_1.signRefreshToken)(user.id, session.id);
    // Set cookie HttpOnly
    setRefreshCookie(res, refreshToken);
    // Trả access token ngắn hạn
    const accessToken = (0, jwt_1.signAccessToken)(user.id, user.role);
    res.json({ token: accessToken });
}
async function refresh(req, res) {
    const cookieName = env_1.ENV.COOKIE_NAME;
    const token = req.cookies?.[cookieName];
    if (!token)
        return res.status(401).json({ message: "Missing refresh token" });
    try {
        // Verify refresh JWT
        const payload = jsonwebtoken_1.default.verify(token, env_1.ENV.JWT_REFRESH_SECRET);
        if (payload.type !== "refresh")
            return res.status(401).json({ message: "Invalid token" });
        // Kiểm tra session trong DB
        const session = await (0, session_service_1.getSession)(payload.jti);
        if (!session || session.revokedAt) {
            return res.status(401).json({ message: "Refresh revoked" });
        }
        if (session.expiresAt < new Date()) {
            return res.status(401).json({ message: "Refresh expired" });
        }
        // Lấy thông tin user để có role
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: payload.userId },
        });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        // Rotation: thu hồi session cũ, phát session mới
        await (0, session_service_1.revokeSession)(session.id);
        const newSession = await (0, session_service_1.createSession)(payload.userId, env_1.ENV.REFRESH_TOKEN_DAYS);
        const newRefresh = (0, jwt_1.signRefreshToken)(payload.userId, newSession.id);
        setRefreshCookie(res, newRefresh);
        // Trả access token mới với role
        const newAccess = (0, jwt_1.signAccessToken)(payload.userId, user.role);
        res.json({ token: newAccess });
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.TokenExpiredError) {
            return res.status(401).json({ message: "Refresh JWT expired" });
        }
        if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }
        throw err;
    }
}
async function logout(req, res) {
    const cookieName = env_1.ENV.COOKIE_NAME;
    const token = req.cookies?.[cookieName];
    if (token) {
        try {
            const payload = jsonwebtoken_1.default.verify(token, env_1.ENV.JWT_REFRESH_SECRET);
            await (0, session_service_1.revokeSession)(payload.jti);
        }
        catch {
            // ignore verify errors — vẫn xoá cookie
        }
    }
    // Xoá cookie
    res.clearCookie(cookieName, {
        httpOnly: true,
        secure: env_1.ENV.NODE_ENV === "production",
        sameSite: env_1.ENV.NODE_ENV === "production" ? "strict" : "lax",
        path: "/",
    });
    res.json({ ok: true });
}
