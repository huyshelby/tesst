import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().optional(),
    price: z.number().positive("Price must be positive"),
    listPrice: z.number().positive().optional(),
    image: z.string().min(1, "Image URL is required"),
    images: z.array(z.string()).optional().default([]),
    categoryId: z.string().uuid("Invalid category ID"),
    brand: z.string().min(1, "Brand is required"),
    stock: z.number().int().nonnegative().default(0),
    rating: z.number().min(0).max(5).optional(),
    reviews: z.number().int().nonnegative().default(0),
    badges: z.array(z.string()).optional().default([]),
    installment: z.boolean().default(false),
    isActive: z.boolean().default(true),
    specs: z.record(z.string(), z.any()).optional(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    listPrice: z.number().positive().optional(),
    image: z.string().min(1).optional(),
    images: z.array(z.string()).optional(),
    categoryId: z.string().uuid().optional(),
    brand: z.string().min(1).optional(),
    stock: z.number().int().nonnegative().optional(),
    rating: z.number().min(0).max(5).optional(),
    reviews: z.number().int().nonnegative().optional(),
    badges: z.array(z.string()).optional(),
    installment: z.boolean().optional(),
    isActive: z.boolean().optional(),
    specs: z.record(z.string(), z.any()).optional(),
  }),
});

export const getProductsQuerySchema = z.object({
  query: z.object({
    categoryId: z.string().optional(),
    categorySlug: z.string().optional(),
    brand: z.union([z.string(), z.array(z.string())]).optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    search: z.string().optional(),
    // hỗ trợ nhiều giá trị: ram=8&ram=16 hoặc ram=8,16
    ram: z.union([z.string(), z.array(z.string())]).optional(),
    storage: z.union([z.string(), z.array(z.string())]).optional(),
    sortBy: z.enum(["price", "rating", "createdAt"]).optional(),
    order: z.enum(["asc", "desc"]).optional().default("desc"),
    page: z.string().optional().default("1"),
    limit: z.string().optional().default("20"),
  }),
});
