import { prisma } from "../utils/prisma";
import crypto from "crypto";
import bcrypt from "bcrypt";

/**
 * Tạo token reset password và lưu vào DB
 * Token có hiệu lực 1 giờ
 */
export async function createPasswordResetToken(userId: string) {
  // Tạo token ngẫu nhiên
  const token = crypto.randomBytes(32).toString("hex");
  
  // Token hết hạn sau 1 giờ
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  // Lưu vào DB
  await prisma.passwordReset.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  return token;
}

/**
 * Verify token reset password
 * Trả về userId nếu token hợp lệ, null nếu không
 */
export async function verifyPasswordResetToken(
  token: string
): Promise<string | null> {
  const record = await prisma.passwordReset.findUnique({
    where: { token },
  });

  if (!record) return null;
  if (record.usedAt) return null; // đã dùng rồi
  if (record.expiresAt < new Date()) return null; // hết hạn

  return record.userId;
}

/**
 * Đánh dấu token đã được sử dụng
 */
export async function markTokenAsUsed(token: string) {
  await prisma.passwordReset.update({
    where: { token },
    data: { usedAt: new Date() },
  });
}

/**
 * Cập nhật mật khẩu mới cho user
 */
export async function updateUserPassword(userId: string, newPassword: string) {
  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hash },
  });
}

