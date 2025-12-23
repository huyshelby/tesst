import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { getBlockchainService } from "../services/blockchain";

export class OrderController {
  // Create order from cart
  static async createOrder(req: Request, res: Response) {
    const userId = req.user!.id; // User must be authenticated

    const order = await OrderService.createOrder(userId, req.body);

    res.status(201).json(order);
  }

  // Get user's orders
  static async getUserOrders(req: Request, res: Response) {
    const userId = req.user!.id;
    const { status, page, limit } = req.query;

    const result = await OrderService.getUserOrders(userId, {
      status: status as string,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 10,
    });

    res.json(result);
  }

  // Get order by ID
  static async getOrderById(req: Request, res: Response) {
    const { orderId } = req.params;
    const userId = req.user!.id;

    const order = await OrderService.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user owns the order or is admin
    if (order.userId !== userId && req.user!.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(order);
  }

  // Get order by order number
  static async getOrderByNumber(req: Request, res: Response) {
    const { orderNumber } = req.params;
    const userId = req.user!.id;

    const order = await OrderService.getOrderByNumber(orderNumber);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user owns the order or is admin
    if (order.userId !== userId && req.user!.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(order);
  }

  // Cancel order
  static async cancelOrder(req: Request, res: Response) {
    const { orderId } = req.params;
    const userId = req.user!.id;

    const order = await OrderService.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user owns the order
    if (order.userId !== userId && req.user!.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const cancelledOrder = await OrderService.cancelOrder(orderId);

    res.json(cancelledOrder);
  }

  // Admin: Get all orders
  static async getAllOrders(req: Request, res: Response) {
    const { status, page, limit } = req.query;

    const result = await OrderService.getAllOrders({
      status: status as string,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 10,
    });

    res.json(result);
  }

  // Admin: Update order status
  static async updateOrderStatus(req: Request, res: Response) {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await OrderService.updateOrderStatus(orderId, status);

    res.json(order);
  }

  // Admin: Update payment status
  static async updatePaymentStatus(req: Request, res: Response) {
    const { orderId } = req.params;
    const { paymentStatus, cryptoTxHash } = req.body;

    const order = await OrderService.updatePaymentStatus(
      orderId,
      paymentStatus,
      cryptoTxHash
    );

    res.json(order);
  }

  // Handle blockchain payment notification
  static async handleBlockchainPayment(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const { txHash } = req.body;

      console.log(`[API] Received blockchain payment notification for order ${orderId}`);

      // Validate input
      if (!txHash || typeof txHash !== 'string' || !txHash.startsWith('0x')) {
        console.error(`[API] Invalid txHash provided: ${txHash}`);
        return res.status(400).json({
          error: "Invalid transaction hash",
          message: "Transaction hash must be a valid hex string starting with 0x"
        });
      }

      if (!orderId) {
        console.error(`[API] Missing orderId`);
        return res.status(400).json({
          error: "Missing order ID",
          message: "Order ID is required"
        });
      }

      console.log(`[API] Processing payment for order ${orderId} with txHash ${txHash}`);

      const blockchainService = getBlockchainService();
      const order = await blockchainService.processPayment(orderId, txHash);

      console.log(`[API] ✅ Payment processed successfully for order ${orderId}`);
      res.status(200).json(order);

    } catch (error: any) {
      console.error(`[API] ❌ Error processing blockchain payment:`, error);

      // Return meaningful error to client
      res.status(500).json({
        error: "Payment processing failed",
        message: error.message || "An unexpected error occurred while processing the payment",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  // Delete order (Admin only)
  static async deleteOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const adminId = req.user!.id;

      console.log(`[Admin] User ${adminId} attempting to delete order ${orderId}`);

      const order = await OrderService.getOrderById(orderId);

      if (!order) {
        return res.status(404).json({
          error: "Order not found",
          message: "Không tìm thấy đơn hàng"
        });
      }

      // Optional: Prevent deletion of paid/delivered orders
      // Uncomment if you want this restriction
      // if (order.paymentStatus === "COMPLETED") {
      //   return res.status(400).json({
      //     error: "Cannot delete paid order",
      //     message: "Không thể xóa đơn hàng đã thanh toán"
      //   });
      // }

      // Delete the order
      await OrderService.deleteOrder(orderId);

      // Log the deletion for audit
      console.log(`[Admin] Order ${orderId} (${order.orderNumber}) deleted by admin ${adminId}`);

      res.json({
        success: true,
        message: "Đơn hàng đã được xóa thành công",
        deletedOrder: {
          id: order.id,
          orderNumber: order.orderNumber
        }
      });

    } catch (error: any) {
      console.error(`[Admin] Error deleting order:`, error);

      res.status(500).json({
        error: "Failed to delete order",
        message: error.message || "Có lỗi xảy ra khi xóa đơn hàng",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
}
