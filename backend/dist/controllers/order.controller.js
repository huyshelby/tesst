"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_service_1 = require("../services/order.service");
class OrderController {
    // Create order from cart
    static async createOrder(req, res) {
        const userId = req.user.id; // User must be authenticated
        const order = await order_service_1.OrderService.createOrder(userId, req.body);
        res.status(201).json(order);
    }
    // Get user's orders
    static async getUserOrders(req, res) {
        const userId = req.user.id;
        const { status, page, limit } = req.query;
        const result = await order_service_1.OrderService.getUserOrders(userId, {
            status: status,
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 10,
        });
        res.json(result);
    }
    // Get order by ID
    static async getOrderById(req, res) {
        const { orderId } = req.params;
        const userId = req.user.id;
        const order = await order_service_1.OrderService.getOrderById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        // Check if user owns the order or is admin
        if (order.userId !== userId && req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden" });
        }
        res.json(order);
    }
    // Get order by order number
    static async getOrderByNumber(req, res) {
        const { orderNumber } = req.params;
        const userId = req.user.id;
        const order = await order_service_1.OrderService.getOrderByNumber(orderNumber);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        // Check if user owns the order or is admin
        if (order.userId !== userId && req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden" });
        }
        res.json(order);
    }
    // Cancel order
    static async cancelOrder(req, res) {
        const { orderId } = req.params;
        const userId = req.user.id;
        const order = await order_service_1.OrderService.getOrderById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        // Check if user owns the order
        if (order.userId !== userId && req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const cancelledOrder = await order_service_1.OrderService.cancelOrder(orderId);
        res.json(cancelledOrder);
    }
    // Admin: Get all orders
    static async getAllOrders(req, res) {
        const { status, page, limit } = req.query;
        const result = await order_service_1.OrderService.getAllOrders({
            status: status,
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 10,
        });
        res.json(result);
    }
    // Admin: Update order status
    static async updateOrderStatus(req, res) {
        const { orderId } = req.params;
        const { status } = req.body;
        const order = await order_service_1.OrderService.updateOrderStatus(orderId, status);
        res.json(order);
    }
    // Admin: Update payment status
    static async updatePaymentStatus(req, res) {
        const { orderId } = req.params;
        const { paymentStatus, cryptoTxHash } = req.body;
        const order = await order_service_1.OrderService.updatePaymentStatus(orderId, paymentStatus, cryptoTxHash);
        res.json(order);
    }
}
exports.OrderController = OrderController;
