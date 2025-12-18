import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { Role } from "@prisma/client";

// Lấy danh sách tất cả users (chỉ admin)
export async function getAllUsers(req: Request, res: Response) {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: Number(limit),
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count(),
  ]);

  res.json({
    data: users,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
}

// Cập nhật role của user (chỉ admin)
export async function updateUserRole(req: Request, res: Response) {
  const { userId } = req.params;
  const { role } = res.locals.validated.body;

  // Không cho phép admin tự hạ cấp chính mình
  if (userId === req.user!.id && role !== Role.ADMIN) {
    return res.status(400).json({
      message: "Cannot demote yourself from admin role",
    });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      updatedAt: true,
    },
  });

  res.json(user);
}

// Xóa user (chỉ admin)
export async function deleteUser(req: Request, res: Response) {
  const { userId } = req.params;

  // Không cho phép admin xóa chính mình
  if (userId === req.user!.id) {
    return res.status(400).json({
      message: "Cannot delete your own account",
    });
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  res.json({ message: "User deleted successfully" });
}

// Thống kê hệ thống (chỉ admin)
export async function getSystemStats(req: Request, res: Response) {
  const [totalUsers, totalAdmins, activeSessions, recentUsers] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: Role.ADMIN } }),
      prisma.refreshSession.count({
        where: {
          revokedAt: null,
          expiresAt: { gt: new Date() },
        },
      }),
      prisma.user.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // 7 ngày
        },
      }),
    ]);

  res.json({
    totalUsers,
    totalAdmins,
    activeSessions,
    recentUsers,
    usersByRole: {
      admin: totalAdmins,
      user: totalUsers - totalAdmins,
    },
  });
}

// Revoke tất cả sessions của một user (chỉ admin)
export async function revokeUserSessions(req: Request, res: Response) {
  const { userId } = req.params;

  const result = await prisma.refreshSession.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });

  res.json({
    message: "All user sessions revoked",
    revokedCount: result.count,
  });
}
