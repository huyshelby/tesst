import { z } from "zod";

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Email không hợp lệ"),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Token không được để trống"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  }),
});

