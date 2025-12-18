"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../middlewares/validate");
const admin_controller_1 = require("../controllers/admin.controller");
const admin_schema_1 = require("../schemas/admin.schema");
const router = (0, express_1.Router)();
// Tất cả routes admin đều cần authentication + admin role
router.use(auth_1.requireAuth, auth_1.requireAdmin);
// Quản lý users
router.get('/users', (0, validate_1.validate)(admin_schema_1.getUsersQuerySchema), admin_controller_1.getAllUsers);
router.put('/users/:userId/role', (0, validate_1.validate)(admin_schema_1.updateUserRoleSchema), admin_controller_1.updateUserRole);
router.delete('/users/:userId', (0, validate_1.validate)(admin_schema_1.userParamsSchema), admin_controller_1.deleteUser);
router.post('/users/:userId/revoke-sessions', (0, validate_1.validate)(admin_schema_1.userParamsSchema), admin_controller_1.revokeUserSessions);
// Thống kê hệ thống
router.get('/stats', admin_controller_1.getSystemStats);
exports.default = router;
