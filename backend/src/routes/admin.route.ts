import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getSystemStats,
  revokeUserSessions,
} from '../controllers/admin.controller';
import {
  updateUserRoleSchema,
  getUsersQuerySchema,
  userParamsSchema,
} from '../schemas/admin.schema';

const router = Router();

// Tất cả routes admin đều cần authentication + admin role
router.use(requireAuth, requireAdmin);

// Quản lý users
router.get('/users', validate(getUsersQuerySchema), getAllUsers);
router.put('/users/:userId/role', validate(updateUserRoleSchema), updateUserRole);
router.delete('/users/:userId', validate(userParamsSchema), deleteUser);
router.post('/users/:userId/revoke-sessions', validate(userParamsSchema), revokeUserSessions);

// Thống kê hệ thống
router.get('/stats', getSystemStats);

export default router;
