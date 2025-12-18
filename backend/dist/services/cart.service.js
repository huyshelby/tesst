"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const prisma_1 = require("../utils/prisma");
class CartService {
    // Get or create cart for user
    static async getOrCreateCart(userId, sessionId) {
        if (!userId && !sessionId) {
            throw new Error("Either userId or sessionId is required");
        }
        const where = userId ? { userId } : { sessionId };
        let cart = await prisma_1.prisma.cart.findUnique({
            where,
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!cart) {
            cart = await prisma_1.prisma.cart.create({
                data: userId ? { userId } : { sessionId },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
        }
        return cart;
    }
    // Add item to cart
    static async addItem(cartId, productId, quantity, selectedColor, selectedStorage) {
        // Check if product exists and has stock
        const product = await prisma_1.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new Error("Product not found");
        }
        if (product.stock < quantity) {
            throw new Error("Insufficient stock");
        }
        // Check if item already exists in cart
        const existingItem = await prisma_1.prisma.cartItem.findFirst({
            where: {
                cartId,
                productId,
                selectedColor,
                selectedStorage,
            },
        });
        if (existingItem) {
            // Update quantity
            return prisma_1.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
                include: { product: true },
            });
        }
        // Create new item
        return prisma_1.prisma.cartItem.create({
            data: {
                cartId,
                productId,
                quantity,
                selectedColor,
                selectedStorage,
            },
            include: { product: true },
        });
    }
    // Update cart item quantity
    static async updateItemQuantity(itemId, quantity) {
        const item = await prisma_1.prisma.cartItem.findUnique({
            where: { id: itemId },
            include: { product: true },
        });
        if (!item) {
            throw new Error("Cart item not found");
        }
        if (item.product.stock < quantity) {
            throw new Error("Insufficient stock");
        }
        return prisma_1.prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity },
            include: { product: true },
        });
    }
    // Remove item from cart
    static async removeItem(itemId) {
        return prisma_1.prisma.cartItem.delete({
            where: { id: itemId },
        });
    }
    // Clear cart
    static async clearCart(cartId) {
        return prisma_1.prisma.cartItem.deleteMany({
            where: { cartId },
        });
    }
    // Get cart with items
    static async getCart(cartId) {
        return prisma_1.prisma.cart.findUnique({
            where: { id: cartId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }
}
exports.CartService = CartService;
