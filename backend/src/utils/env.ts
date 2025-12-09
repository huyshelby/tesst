import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(16, "JWT_SECRET nên >= 16 ký tự"),

  // ↓↓↓ thêm mới ↓↓↓
  JWT_REFRESH_SECRET: z.string().min(16, "JWT_REFRESH_SECRET nên >= 16 ký tự"),
  REFRESH_TOKEN_DAYS: z.coerce.number().int().positive().default(30),
  COOKIE_NAME: z.string().min(1).default("refresh_token"),
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    parsed.error.flatten().fieldErrors
  );
  process.exit(1);
}
export const ENV = parsed.data;
