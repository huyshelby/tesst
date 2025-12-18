"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("./env");
function signAccessToken(userId, role) {
    // Access token ngắn hạn (vd: 15 phút)
    return jsonwebtoken_1.default.sign({ userId, role, type: "access" }, env_1.ENV.JWT_SECRET, {
        expiresIn: "15m",
    });
}
function signRefreshToken(userId, jti) {
    // Refresh token dài hạn (vd: 30 ngày)
    return jsonwebtoken_1.default.sign({ userId, jti, type: "refresh" }, env_1.ENV.JWT_REFRESH_SECRET, {
        expiresIn: `${env_1.ENV.REFRESH_TOKEN_DAYS}d`,
    });
}
