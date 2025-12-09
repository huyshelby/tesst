import { z } from "zod";

const email = z
  .string()
  .email()
  .transform((v) => v.toLowerCase().trim());
const password = z
  .string()
  .min(8, "Mật khẩu tối thiểu 8 ký tự")
  .max(72, "Mật khẩu quá dài")
  .regex(/[A-Z]/, "Phải có chữ hoa")
  .regex(/[a-z]/, "Phải có chữ thường")
  .regex(/[0-9]/, "Phải có số");

export const registerSchema = z.object({
  body: z.object({
    email,
    password,
    name: z.string().min(1, "Tên không được rỗng").trim(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email,
    password: z.string().min(1, "Thiếu mật khẩu"),
  }),
});
