import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { subDays, subMonths, startOfDay, endOfDay, format } from "date-fns";

export class DashboardController {
  // Get dashboard statistics
  static async getStats(req: Request, res: Response) {
    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);
    const sixtyDaysAgo = subDays(now, 60);

    // Revenue stats - Aggregate all financial data
    // Only count DELIVERED orders (payment status không quan trọng vì đã giao hàng)
    const [currentRevenue, previousRevenue] = await Promise.all([
      prisma.order.aggregate({
        where: {
          createdAt: { gte: thirtyDaysAgo },
          status: "DELIVERED",
        },
        _sum: {
          total: true,
          subtotal: true,
          shippingFee: true,
          discount: true,
        },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
          status: "DELIVERED",
        },
        _sum: {
          total: true,
          subtotal: true,
          shippingFee: true,
          discount: true,
        },
      }),
    ]);

    // Calculate revenue (total = subtotal + shippingFee - discount)
    const currentRevenueTotal = currentRevenue._sum.total || 0;
    const previousRevenueTotal = previousRevenue._sum.total || 0;
    const revenueChange =
      previousRevenueTotal > 0
        ? ((currentRevenueTotal - previousRevenueTotal) /
            previousRevenueTotal) *
          100
        : 0;

    // Orders stats
    const [currentOrders, previousOrders, ordersByStatus] = await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.order.count({
        where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
      }),
      prisma.order.groupBy({
        by: ["status"],
        _count: true,
      }),
    ]);

    const ordersChange =
      previousOrders > 0
        ? ((currentOrders - previousOrders) / previousOrders) * 100
        : 0;

    const orderStatusCounts = {
      pending: 0,
      processing: 0,
      delivered: 0,
      cancelled: 0,
    };

    ordersByStatus.forEach((item) => {
      const status = item.status.toLowerCase();
      if (status in orderStatusCounts) {
        orderStatusCounts[status as keyof typeof orderStatusCounts] =
          item._count;
      }
    });

    // Customers stats
    const [
      currentCustomers,
      previousCustomers,
      totalCustomers,
      activeCustomers,
    ] = await Promise.all([
      prisma.user.count({
        where: {
          role: "USER",
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      prisma.user.count({
        where: {
          role: "USER",
          createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
        },
      }),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.user.count({
        where: {
          role: "USER",
          orders: { some: { createdAt: { gte: thirtyDaysAgo } } },
        },
      }),
    ]);

    const customersChange =
      previousCustomers > 0
        ? ((currentCustomers - previousCustomers) / previousCustomers) * 100
        : 0;

    // Products stats
    const [totalProducts, outOfStockProducts, lowStockProducts] =
      await Promise.all([
        prisma.product.count(),
        prisma.product.count({ where: { stock: 0 } }),
        prisma.product.count({
          where: { stock: { gt: 0, lte: 10 } },
        }),
      ]);

    const activeProducts = totalProducts - outOfStockProducts;

    res.json({
      revenue: {
        total: currentRevenueTotal,
        subtotal: currentRevenue._sum.subtotal || 0,
        shippingFee: currentRevenue._sum.shippingFee || 0,
        discount: currentRevenue._sum.discount || 0,
        change: Math.round(revenueChange * 10) / 10,
        trend:
          revenueChange > 5 ? "up" : revenueChange < -5 ? "down" : "neutral",
      },
      orders: {
        total: currentOrders,
        ...orderStatusCounts,
        change: Math.round(ordersChange * 10) / 10,
      },
      customers: {
        total: totalCustomers,
        active: activeCustomers,
        new: currentCustomers,
        change: Math.round(customersChange * 10) / 10,
      },
      products: {
        total: totalProducts,
        active: activeProducts,
        outOfStock: outOfStockProducts,
        lowStock: lowStockProducts,
      },
    });
  }

  // Get revenue chart data
  static async getRevenueChart(req: Request, res: Response) {
    const { period = "7days" } = req.query;
    const now = new Date();
    let startDate: Date;
    let groupBy: "day" | "month";

    switch (period) {
      case "12months":
        startDate = subMonths(now, 12);
        groupBy = "month";
        break;
      case "30days":
        startDate = subDays(now, 30);
        groupBy = "day";
        break;
      case "7days":
      default:
        startDate = subDays(now, 7);
        groupBy = "day";
    }

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        status: "DELIVERED",
      },
      select: {
        createdAt: true,
        total: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // Group by date
    const chartData: { [key: string]: { revenue: number; orders: number } } =
      {};

    orders.forEach((order) => {
      const dateKey =
        groupBy === "month"
          ? format(order.createdAt, "yyyy-MM")
          : format(order.createdAt, "yyyy-MM-dd");

      if (!chartData[dateKey]) {
        chartData[dateKey] = { revenue: 0, orders: 0 };
      }

      chartData[dateKey].revenue += order.total;
      chartData[dateKey].orders += 1;
    });

    // Convert to array and fill missing dates
    const result = Object.entries(chartData).map(([date, data]) => ({
      date,
      revenue: data.revenue,
      orders: data.orders,
    }));

    res.json(result);
  }

  // Get order status distribution
  static async getOrderStatusDistribution(req: Request, res: Response) {
    const statusColors: { [key: string]: string } = {
      PENDING: "#F59E0B",
      CONFIRMED: "#3B82F6",
      PROCESSING: "#8B5CF6",
      SHIPPING: "#06B6D4",
      DELIVERED: "#10B981",
      CANCELLED: "#EF4444",
    };

    const orders = await prisma.order.groupBy({
      by: ["status"],
      _count: true,
    });

    const total = orders.reduce((sum, item) => sum + item._count, 0);

    const result = orders.map((item) => ({
      status: item.status,
      count: item._count,
      percentage: Math.round((item._count / total) * 100 * 10) / 10,
      color: statusColors[item.status] || "#6B7280",
    }));

    res.json(result);
  }

  // Get recent orders
  static async getRecentOrders(req: Request, res: Response) {
    const { limit = 10 } = req.query;

    const orders = await prisma.order.findMany({
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    const result = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName || order.user.name || "Khách hàng",
      customerEmail: order.customerEmail || order.user.email,
      total: order.total,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt.toISOString(),
    }));

    res.json(result);
  }

  // Get best selling products
  static async getBestSellingProducts(req: Request, res: Response) {
    const { limit = 5 } = req.query;

    const products = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true, price: true },
      orderBy: {
        _sum: { quantity: "desc" },
      },
      take: Number(limit),
    });

    const productIds = products.map((p) => p.productId);
    const productDetails = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        category: { select: { name: true } },
      },
    });

    const result = products.map((item) => {
      const product = productDetails.find((p) => p.id === item.productId);
      const totalRevenue = (item._sum.quantity || 0) * (item._sum.price || 0);

      return {
        id: item.productId,
        name: product?.name || "Unknown",
        slug: product?.slug || "",
        image: product?.image || null,
        totalSold: item._sum.quantity || 0,
        revenue: totalRevenue,
        category: product?.category?.name || "Uncategorized",
      };
    });

    res.json(result);
  }
}
