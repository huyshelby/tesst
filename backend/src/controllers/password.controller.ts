import { Request, Response } from "express";
import { findUserByEmail } from "../services/user.service";
import {
  createPasswordResetToken,
  verifyPasswordResetToken,
  markTokenAsUsed,
  updateUserPassword,
} from "../services/password.service";

/**
 * POST /password/forgot
 * Gửi yêu cầu reset password
 */
export async function forgotPassword(req: Request, res: Response) {
  const { email } = res.locals.validated.body;

  // Tìm user theo email
  const user = await findUserByEmail(email);
  
  // Luôn trả về success để tránh leak thông tin user tồn tại hay không
  if (!user) {
    return res.json({
      message: "Nếu email tồn tại, link reset password đã được gửi",
    });
  }

  // Tạo token reset
  const token = await createPasswordResetToken(user.id);

  // TODO: Trong production, gửi email với link reset
  // Ví dụ: https://yourdomain.com/reset-password?token=abc123
  // Hiện tại chỉ log ra console để test
  console.log(`[Password Reset] Token for ${email}: ${token}`);
  console.log(`[Password Reset] Link: http://localhost:3000/reset-password?token=${token}`);

  res.json({
    message: "Nếu email tồn tại, link reset password đã được gửi",
    // Chỉ để test - KHÔNG trả token trong production
    ...(process.env.NODE_ENV !== "production" && { token }),
  });
}

/**
 * POST /password/reset
 * Reset password với token
 */
export async function resetPassword(req: Request, res: Response) {
  const { token, password } = res.locals.validated.body;

  // Verify token
  const userId = await verifyPasswordResetToken(token);
  
  if (!userId) {
    return res.status(400).json({
      message: "Token không hợp lệ hoặc đã hết hạn",
    });
  }

  // Cập nhật password mới
  await updateUserPassword(userId, password);

  // Đánh dấu token đã dùng
  await markTokenAsUsed(token);

  res.json({
    message: "Đặt lại mật khẩu thành công",
  });
}

