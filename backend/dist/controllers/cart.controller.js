"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const cart_service_1 = require("../services/cart.service");
class CartController {
    // Get cart
    static async getCart(req, res) {
        const userId = req.user?.id;
        const sessionId = req.cookies.sessionId || req.headers["x-session-id"];
        const cart = await cart_service_1.CartService.getOrCreateCart(userId, sessionId);
        // Calculate totals
        const items = cart.items.map((item) => ({
            ...item,
            subtotal: item.product.price * item.quantity,
        }));
        const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
        res.json({
            cart: {
                ...cart,
                items,
            },
            summary: {
                itemsCount: items.reduce((sum, item) => sum + item.quantity, 0),
                subtotal,
            },
        });
    }
    // Add item to cart
    static async addItem(req, res) {
        const userId = req.user?.id;
        const sessionId = req.cookies.sessionId || req.headers["x-session-id"];
        const cart = await cart_service_1.CartService.getOrCreateCart(userId, sessionId);
        const { productId, quantity, selectedColor, selectedStorage } = req.body;
        const item = await cart_service_1.CartService.addItem(cart.id, productId, quantity, selectedColor, selectedStorage);
        res.status(201).json(item);
    }
    // Update cart item quantity
    static async updateItem(req, res) {
        const { itemId } = req.params;
        const { quantity } = req.body;
        const item = await cart_service_1.CartService.updateItemQuantity(itemId, quantity);
        res.json(item);
    }
    // Remove item from cart
    static async removeItem(req, res) {
        const { itemId } = req.params;
        await cart_service_1.CartService.removeItem(itemId);
        res.json({ message: "Item removed from cart" });
    }
    // Clear cart
    static async clearCart(req, res) {
        const userId = req.user?.id;
        const sessionId = req.cookies.sessionId || req.headers["x-session-id"];
        const cart = await cart_service_1.CartService.getOrCreateCart(userId, sessionId);
        await cart_service_1.CartService.clearCart(cart.id);
        res.json({ message: "Cart cleared" });
    }
}
exports.CartController = CartController;
