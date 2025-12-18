"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireUser = exports.requireAdmin = void 0;
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
exports.optionalAuth = optionalAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../utils/env");
const client_1 = require("@prisma/client");
function requireAuth(req, res, next) {
    const token = (req.headers.authorization || "").replace("Bearer ", "");
    if (!token)
        return res.status(401).json({ message: "Unauthorized" });
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.ENV.JWT_SECRET); // xác minh token
        req.user = payload;
        next();
    }
    catch {
        return res.status(401).json({ message: "Invalid token" });
    }
}
// Middleware phân quyền theo role
function requireRole(...allowedRoles) {
    return (req, res, next) => {
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
exports.requireAdmin = requireRole(client_1.Role.ADMIN);
// Optional auth - doesn't fail if no token provided
function optionalAuth(req, res, next) {
    const token = (req.headers.authorization || "").replace("Bearer ", "");
    if (!token) {
        return next();
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.ENV.JWT_SECRET);
        req.user = payload;
    }
    catch {
        // Invalid token, but continue without user
    }
    next();
}
exports.requireUser = requireRole(client_1.Role.USER, client_1.Role.ADMIN); // Admin có thể truy cập user endpoints
