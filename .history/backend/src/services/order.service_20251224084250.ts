import { prisma } from "../utils/prisma";
import type { Prisma } from "@prisma/client";
import { CartService } from "./cart.service";
import { getNFTReceiptService } from "./nft-receipt.service";

export class OrderService {
  // Generate unique order number
  static generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }

  // Create order from cart
  static async createOrder(
    userId: string,
    orderData: {
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      shippingAddress: string;
      shippingCity: string;
      shippingDistrict?: string;
      shippingWard?: string;
      paymentMethod: string;
      cryptoWallet?: string;
      cryptoNetwork?: string;
      cryptoToken?: string;
      notes?: string;
    }
  ) {
    // Get user's cart
    const cart = await CartService.getOrCreateCart(userId);

    if (!cart.items || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems: Prisma.OrderItemCreateManyOrderInput[] = [];

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
    const order = await prisma.$transaction(async (tx) => {
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
          paymentMethod: orderData.paymentMethod as any,
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
        data: orderItems.map((item, index) => ({
          ...item,
          productId: cart.items[index].productId, // Ensure productId is correctly passed
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
  static async getOrderById(orderId: string) {
    return prisma.order.findUnique({
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

  /**
   * Mint NFT receipt for an order
   * @param orderId Order ID
   * @param userId User ID for authorization
   * @returns NFT minting transaction details
   */


  /**
   * Get NFT receipt info for an order
   * @param orderId Order ID
   * @param userId User ID for authorization
   * @returns NFT receipt information
   */
 

  // Get order by order number
  static async getOrderByNumber(orderNumber: string) {
    return prisma.order.findUnique({
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
  static async getUserOrders(
    userId: string,
    filters: {
      status?: string;
      page?: number;
      limit?: number;
    }
  ) {
    const { status, page = 1, limit = 10 } = filters;

    const where: Prisma.OrderWhereInput = { userId };
    if (status) where.status = status as any;

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
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
      prisma.order.count({ where }),
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
  static async getAllOrders(filters: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const { status, page = 1, limit = 10 } = filters;

    const where: Prisma.OrderWhereInput = {};
    if (status) where.status = status as any;

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
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
      prisma.order.count({ where }),
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
  static async updateOrderStatus(orderId: string, status: string) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
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
  static async updatePaymentStatus(
    orderId: string,
    paymentStatus: string,
    cryptoTxHash?: string
  ) {
    return prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: paymentStatus as any,
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
  static async cancelOrder(orderId: string) {
    const order = await this.getOrderById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== "PENDING" && order.status !== "CONFIRMED") {
      throw new Error("Cannot cancel order at this stage");
    }

    // Restore product stock in transaction
    await prisma.$transaction(async (tx) => {
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

  // Delete order (Admin only)
  static async deleteOrder(orderId: string) {
    // Delete order and all related items (cascade delete)
    await prisma.order.delete({
      where: { id: orderId },
    });

    return { success: true };
  }

  // Mint NFT receipt for an order
  static async mintOrderReceipt(orderId: string, userId: string) {
    const order = await this.getOrderById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    // Check if user owns the order
    if (order.userId !== userId) {
      throw new Error("Unauthorized to mint receipt for this order");
    }

    // Check if order is paid
    if (order.paymentStatus !== "COMPLETED") {
      throw new Error("Cannot mint receipt for unpaid order");
    }

    // Get NFT receipt service
    const nftService = getNFTReceiptService();

    // Mint NFT receipt
    const result = await nftService.mintReceipt(orderId);

    return {
      tokenId: result.tokenId,
      txHash: result.txHash,
      alreadyMinted: !!order.nftTokenId
    };
  }

  // Get NFT receipt info for an order
  static async getOrderReceipt(orderId: string, userId: string) {
    const order = await this.getOrderById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    // Check if user owns the order
    if (order.userId !== userId) {
      throw new Error("Unauthorized to view receipt for this order");
    }

    // Check if NFT receipt exists
    if (!order.nftTokenId) {
      return {
        exists: false
      };
    }

    // Get NFT receipt service
    const nftService = getNFTReceiptService();

    // Get receipt info
    const receiptInfo = await nftService.getReceiptInfo(orderId);

    return {
      exists: true,
      tokenId: order.nftTokenId,
      txHash: order.nftMintTxHash,
      status: order.status,
      metadata: receiptInfo?.metadata
    };
  }
}
