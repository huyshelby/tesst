"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const prisma_1 = require("../utils/prisma");
const cart_service_1 = require("./cart.service");
class OrderService {
    // Generate unique order number
    static generateOrderNumber() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 7).toUpperCase();
        return `ORD-${timestamp}-${random}`;
    }
    // Create order from cart
    static async createOrder(userId, orderData) {
        // Get user's cart
        const cart = await cart_service_1.CartService.getOrCreateCart(userId);
        if (!cart.items || cart.items.length === 0) {
            throw new Error("Cart is empty");
        }
        // Calculate totals
        let subtotal = 0;
        const orderItems = [];
        for (const item of cart.items) {
            const itemSubtotal = item.product.price * item.quantity;
            subtotal += itemSubtotal;
            orderItems.push({
                productId: item.productId,
                productName: item.product.name,
                productImage: item.product.image,
                price: item.product.price,
                quantity: item.quantity,
                selectedColor: item.selectedColor,
                selectedStorage: item.selectedStorage,
                subtotal: itemSubtotal,
            });
            // Check stock availability
            if (item.product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${item.product.name}`);
            }
        }
        const shippingFee = subtotal >= 500000 ? 0 : 30000; // Free shipping over 500k
        const total = subtotal + shippingFee;
        // Create order with items in transaction
        const order = await prisma_1.prisma.$transaction(async (tx) => {
            // Create order
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    orderNumber: this.generateOrderNumber(),
                    customerName: orderData.customerName,
                    customerEmail: orderData.customerEmail,
                    customerPhone: orderData.customerPhone,
                    shippingAddress: orderData.shippingAddress,
                    shippingCity: orderData.shippingCity,
                    shippingDistrict: orderData.shippingDistrict,
                    shippingWard: orderData.shippingWard,
                    paymentMethod: orderData.paymentMethod,
                    cryptoWallet: orderData.cryptoWallet,
                    cryptoNetwork: orderData.cryptoNetwork,
                    cryptoToken: orderData.cryptoToken,
                    notes: orderData.notes,
                    subtotal,
                    shippingFee,
                    total,
                },
            });
            // Create order items
            await tx.orderItem.createMany({
                data: orderItems.map((item) => ({
                    ...item,
                    orderId: newOrder.id,
                })),
            });
            // Decrease product stock
            for (const item of cart.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }
            // Clear cart
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id },
            });
            return newOrder;
        });
        // Return order with items
        return this.getOrderById(order.id);
    }
    // Get order by ID
    static async getOrderById(orderId) {
        return prisma_1.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
        });
    }
    // Get order by order number
    static async getOrderByNumber(orderNumber) {
        return prisma_1.prisma.order.findUnique({
            where: { orderNumber },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }
    // Get user's orders
    static async getUserOrders(userId, filters) {
        const { status, page = 1, limit = 10 } = filters;
        const where = { userId };
        if (status)
            where.status = status;
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            prisma_1.prisma.order.findMany({
                where,
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma_1.prisma.order.count({ where }),
        ]);
        return {
            orders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    // Get all orders (admin)
    static async getAllOrders(filters) {
        const { status, page = 1, limit = 10 } = filters;
        const where = {};
        if (status)
            where.status = status;
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            prisma_1.prisma.order.findMany({
                where,
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma_1.prisma.order.count({ where }),
        ]);
        return {
            orders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    // Update order status
    static async updateOrderStatus(orderId, status) {
        return prisma_1.prisma.order.update({
            where: { id: orderId },
            data: { status: status },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }
    // Update payment status
    static async updatePaymentStatus(orderId, paymentStatus, cryptoTxHash) {
        return prisma_1.prisma.order.update({
            where: { id: orderId },
            data: {
                paymentStatus: paymentStatus,
                cryptoTxHash,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }
    // Cancel order
    static async cancelOrder(orderId) {
        const order = await this.getOrderById(orderId);
        if (!order) {
            throw new Error("Order not found");
        }
        if (order.status !== "PENDING" &&
            order.status !== "CONFIRMED") {
            throw new Error("Cannot cancel order at this stage");
        }
        // Restore product stock in transaction
        await prisma_1.prisma.$transaction(async (tx) => {
            for (const item of order.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { increment: item.quantity } },
                });
            }
            await tx.order.update({
                where: { id: orderId },
                data: { status: "CANCELLED" },
            });
        });
        return this.getOrderById(orderId);
    }
}
exports.OrderService = OrderService;
