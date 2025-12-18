"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrdersQuerySchema = exports.updatePaymentStatusSchema = exports.updateOrderStatusSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
exports.createOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        customerName: zod_1.z.string().min(1, "Customer name is required"),
        customerEmail: zod_1.z.string().email("Invalid email"),
        customerPhone: zod_1.z.string().min(10, "Invalid phone number"),
        shippingAddress: zod_1.z.string().min(1, "Shipping address is required"),
        shippingCity: zod_1.z.string().min(1, "City is required"),
        shippingDistrict: zod_1.z.string().optional(),
        shippingWard: zod_1.z.string().optional(),
        paymentMethod: zod_1.z.enum([
            "CARD",
            "MOMO",
            "VNPAY",
            "BANK_TRANSFER",
            "INSTALLMENT",
            "CRYPTO",
        ]),
        cryptoWallet: zod_1.z.string().optional(),
        cryptoNetwork: zod_1.z.string().optional(),
        cryptoToken: zod_1.z.string().optional(),
        notes: zod_1.z.string().optional(),
    }),
});
exports.updateOrderStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        orderId: zod_1.z.string().uuid("Invalid order ID"),
    }),
    body: zod_1.z.object({
        status: zod_1.z.enum([
            "PENDING",
            "CONFIRMED",
            "PROCESSING",
            "SHIPPING",
            "DELIVERED",
            "CANCELLED",
        ]),
    }),
});
exports.updatePaymentStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        orderId: zod_1.z.string().uuid("Invalid order ID"),
    }),
    body: zod_1.z.object({
        paymentStatus: zod_1.z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"]),
        cryptoTxHash: zod_1.z.string().optional(),
    }),
});
exports.getOrdersQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        status: zod_1.z.string().optional(),
        page: zod_1.z.string().optional().default("1"),
        limit: zod_1.z.string().optional().default("10"),
    }),
});
