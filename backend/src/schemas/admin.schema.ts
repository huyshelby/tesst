import { z } from "zod";
import { Role } from "@prisma/client";

export const updateUserRoleSchema = z.object({
  body: z.object({
    role: z.nativeEnum(Role, {
      message: "Role must be USER or ADMIN",
    }),
  }),
  params: z.object({
    userId: z.string().uuid("Invalid user ID format"),
  }),
});

export const getUsersQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

export const userParamsSchema = z.object({
  params: z.object({
    userId: z.string().uuid("Invalid user ID format"),
  }),
});
