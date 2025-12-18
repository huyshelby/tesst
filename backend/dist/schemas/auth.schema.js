"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const email = zod_1.z
    .string()
    .email()
    .transform((v) => v.toLowerCase().trim());
const password = zod_1.z
    .string()
    .min(8, "Mật khẩu tối thiểu 8 ký tự")
    .max(72, "Mật khẩu quá dài")
    .regex(/[A-Z]/, "Phải có chữ hoa")
    .regex(/[a-z]/, "Phải có chữ thường")
    .regex(/[0-9]/, "Phải có số");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        email,
        password,
        name: zod_1.z.string().min(1, "Tên không được rỗng").trim(),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email,
        password: zod_1.z.string().min(1, "Thiếu mật khẩu"),
    }),
});
