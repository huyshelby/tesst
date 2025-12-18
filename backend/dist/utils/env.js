"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const EnvSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(["development", "test", "production"])
        .default("development"),
    PORT: zod_1.z.coerce.number().int().positive().default(4000),
    DATABASE_URL: zod_1.z.string().url(),
    JWT_SECRET: zod_1.z.string().min(16, "JWT_SECRET nên >= 16 ký tự"),
    // ↓↓↓ thêm mới ↓↓↓
    JWT_REFRESH_SECRET: zod_1.z.string().min(16, "JWT_REFRESH_SECRET nên >= 16 ký tự"),
    REFRESH_TOKEN_DAYS: zod_1.z.coerce.number().int().positive().default(30),
    COOKIE_NAME: zod_1.z.string().min(1).default("refresh_token"),
});
const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
    process.exit(1);
}
exports.ENV = parsed.data;
