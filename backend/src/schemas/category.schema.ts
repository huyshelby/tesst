import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().optional(),
    image: z.string().url().optional(),
    icon: z.string().optional(),
    parentId: z.string().uuid().optional(),
    displayOrder: z.number().int().nonnegative().default(0),
    isActive: z.boolean().default(true),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    description: z.string().optional(),
    image: z.string().url().optional(),
    icon: z.string().optional(),
    parentId: z.string().uuid().optional().nullable(),
    displayOrder: z.number().int().nonnegative().optional(),
    isActive: z.boolean().optional(),
  }),
});
