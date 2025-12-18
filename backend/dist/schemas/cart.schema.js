"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCartItemSchema = exports.updateCartItemSchema = exports.addToCartSchema = void 0;
const zod_1 = require("zod");
exports.addToCartSchema = zod_1.z.object({
    body: zod_1.z.object({
        productId: zod_1.z.string().uuid("Invalid product ID"),
        quantity: zod_1.z.number().int().positive("Quantity must be positive").default(1),
        selectedColor: zod_1.z.string().optional(),
        selectedStorage: zod_1.z.string().optional(),
    }),
});
exports.updateCartItemSchema = zod_1.z.object({
    params: zod_1.z.object({
        itemId: zod_1.z.string().uuid("Invalid item ID"),
    }),
    body: zod_1.z.object({
        quantity: zod_1.z.number().int().positive("Quantity must be positive"),
    }),
});
exports.removeCartItemSchema = zod_1.z.object({
    params: zod_1.z.object({
        itemId: zod_1.z.string().uuid("Invalid item ID"),
    }),
});
