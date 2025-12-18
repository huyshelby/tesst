"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsQuerySchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required"),
        slug: zod_1.z.string().min(1, "Slug is required"),
        description: zod_1.z.string().optional(),
        price: zod_1.z.number().positive("Price must be positive"),
        listPrice: zod_1.z.number().positive().optional(),
        image: zod_1.z.string().url("Invalid image URL"),
        images: zod_1.z.array(zod_1.z.string().url()).optional().default([]),
        category: zod_1.z.enum([
            "PHONE",
            "LAPTOP",
            "MONITOR",
            "TABLET",
            "AUDIO",
            "WATCH",
            "HOME",
            "TV",
            "ACCESSORY",
        ]),
        brand: zod_1.z.string().min(1, "Brand is required"),
        stock: zod_1.z.number().int().nonnegative().default(0),
        rating: zod_1.z.number().min(0).max(5).optional(),
        reviews: zod_1.z.number().int().nonnegative().default(0),
        badges: zod_1.z.array(zod_1.z.string()).optional().default([]),
        installment: zod_1.z.boolean().default(false),
        specs: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
    }),
});
exports.updateProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).optional(),
        slug: zod_1.z.string().min(1).optional(),
        description: zod_1.z.string().optional(),
        price: zod_1.z.number().positive().optional(),
        listPrice: zod_1.z.number().positive().optional(),
        image: zod_1.z.string().url().optional(),
        images: zod_1.z.array(zod_1.z.string().url()).optional(),
        category: zod_1.z
            .enum([
            "PHONE",
            "LAPTOP",
            "MONITOR",
            "TABLET",
            "AUDIO",
            "WATCH",
            "HOME",
            "TV",
            "ACCESSORY",
        ])
            .optional(),
        brand: zod_1.z.string().min(1).optional(),
        stock: zod_1.z.number().int().nonnegative().optional(),
        rating: zod_1.z.number().min(0).max(5).optional(),
        reviews: zod_1.z.number().int().nonnegative().optional(),
        badges: zod_1.z.array(zod_1.z.string()).optional(),
        installment: zod_1.z.boolean().optional(),
        specs: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
    }),
});
exports.getProductsQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        category: zod_1.z.string().optional(),
        brand: zod_1.z.string().optional(),
        minPrice: zod_1.z.string().optional(),
        maxPrice: zod_1.z.string().optional(),
        search: zod_1.z.string().optional(),
        sortBy: zod_1.z.enum(["price", "rating", "createdAt"]).optional(),
        order: zod_1.z.enum(["asc", "desc"]).optional().default("desc"),
        page: zod_1.z.string().optional().default("1"),
        limit: zod_1.z.string().optional().default("20"),
    }),
});
