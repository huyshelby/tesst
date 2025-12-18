"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
exports.updateUserRole = updateUserRole;
exports.deleteUser = deleteUser;
exports.getSystemStats = getSystemStats;
exports.revokeUserSessions = revokeUserSessions;
const prisma_1 = require("../utils/prisma");
const client_1 = require("@prisma/client");
// Lấy danh sách tất cả users (chỉ admin)
async function getAllUsers(req, res) {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
        prisma_1.prisma.user.findMany({
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
            orderBy: { createdAt: 'desc' },
        }),
        prisma_1.prisma.user.count(),
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
async function updateUserRole(req, res) {
    const { userId } = req.params;
    const { role } = res.locals.validated.body;
    // Không cho phép admin tự hạ cấp chính mình
    if (userId === req.user.userId && role !== client_1.Role.ADMIN) {
        return res.status(400).json({
            message: 'Cannot demote yourself from admin role'
        });
    }
    const user = await prisma_1.prisma.user.update({
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
async function deleteUser(req, res) {
    const { userId } = req.params;
    // Không cho phép admin xóa chính mình
    if (userId === req.user.userId) {
        return res.status(400).json({
            message: 'Cannot delete your own account'
        });
    }
    await prisma_1.prisma.user.delete({
        where: { id: userId },
    });
    res.json({ message: 'User deleted successfully' });
}
// Thống kê hệ thống (chỉ admin)
async function getSystemStats(req, res) {
    const [totalUsers, totalAdmins, activeSessions, recentUsers,] = await Promise.all([
        prisma_1.prisma.user.count(),
        prisma_1.prisma.user.count({ where: { role: client_1.Role.ADMIN } }),
        prisma_1.prisma.refreshSession.count({
            where: {
                revokedAt: null,
                expiresAt: { gt: new Date() },
            },
        }),
        prisma_1.prisma.user.count({
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
async function revokeUserSessions(req, res) {
    const { userId } = req.params;
    const result = await prisma_1.prisma.refreshSession.updateMany({
        where: {
            userId,
            revokedAt: null,
        },
        data: {
            revokedAt: new Date(),
        },
    });
    res.json({
        message: 'All user sessions revoked',
        revokedCount: result.count,
    });
}
