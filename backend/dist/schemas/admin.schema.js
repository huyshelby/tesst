"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userParamsSchema = exports.getUsersQuerySchema = exports.updateUserRoleSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.updateUserRoleSchema = zod_1.z.object({
    body: zod_1.z.object({
        role: zod_1.z.nativeEnum(client_1.Role, {
            message: "Role must be USER or ADMIN",
        }),
    }),
    params: zod_1.z.object({
        userId: zod_1.z.string().uuid("Invalid user ID format"),
    }),
});
exports.getUsersQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().int().min(1).default(1),
        limit: zod_1.z.coerce.number().int().min(1).max(100).default(10),
    }),
});
exports.userParamsSchema = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().uuid("Invalid user ID format"),
    }),
});
