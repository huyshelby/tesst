import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    customerName: z.string().min(1, "Customer name is required"),
    customerEmail: z.string().email("Invalid email"),
    customerPhone: z.string().min(10, "Invalid phone number"),
    shippingAddress: z.string().min(1, "Shipping address is required"),
    shippingCity: z.string().min(1, "City is required"),
    shippingDistrict: z.string().optional(),
    shippingWard: z.string().optional(),
    paymentMethod: z.enum([
      "CARD",
      "MOMO",
      "VNPAY",
      "BANK_TRANSFER",
      "INSTALLMENT",
      "CRYPTO",
    ]),
    cryptoWallet: z.string().optional(),
    cryptoNetwork: z.string().optional(),
    cryptoToken: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    orderId: z.string().uuid("Invalid order ID"),
  }),
  body: z.object({
    status: z.enum([
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPING",
      "DELIVERED",
      "CANCELLED",
    ]),
  }),
});

export const updatePaymentStatusSchema = z.object({
  params: z.object({
    orderId: z.string().uuid("Invalid order ID"),
  }),
  body: z.object({
    paymentStatus: z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"]),
    cryptoTxHash: z.string().optional(),
  }),
});

export const getOrdersQuerySchema = z.object({
  query: z.object({
    status: z.string().optional(),
    page: z.string().optional().default("1"),
    limit: z.string().optional().default("10"),
  }),
});
