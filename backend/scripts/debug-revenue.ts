/**
 * Debug script to check revenue data in database
 * Run: npx tsx scripts/debug-revenue.ts
 */

import { prisma } from "../src/utils/prisma";
import { subDays } from "date-fns";

async function debugRevenue() {
  console.log("🔍 Debugging Revenue Data...\n");

  const now = new Date();
  const thirtyDaysAgo = subDays(now, 30);

  // 1. Check total orders
  const totalOrders = await prisma.order.count();
  console.log(`📦 Total Orders in DB: ${totalOrders}`);

  // 2. Check orders by status
  const ordersByStatus = await prisma.order.groupBy({
    by: ["status"],
    _count: true,
  });

  console.log("\n📊 Orders by Status:");
  ordersByStatus.forEach((item) => {
    console.log(`  - ${item.status}: ${item._count}`);
  });

  // 3. Check DELIVERED orders in last 30 days
  const deliveredOrders = await prisma.order.findMany({
    where: {
      createdAt: { gte: thirtyDaysAgo },
      status: "DELIVERED",
    },
    select: {
      id: true,
      orderNumber: true,
      total: true,
      status: true,
      createdAt: true,
    },
  });

  console.log(
    `\n✅ DELIVERED Orders (last 30 days): ${deliveredOrders.length}`
  );

  if (deliveredOrders.length === 0) {
    console.log("⚠️  NO DELIVERED ORDERS IN LAST 30 DAYS!");
    console.log("   This is why revenue = 0");
    console.log("   Solution: Create test orders or change order status to DELIVERED");
  } else {
    console.log("\nFirst 5 delivered orders:");
    deliveredOrders.slice(0, 5).forEach((order) => {
      console.log(`  - ${order.orderNumber}: ${order.total}đ (${order.createdAt.toLocaleDateString()})`);
    });

    const totalRevenue = deliveredOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );
    console.log(`\n💰 Total Revenue (30 days): ${totalRevenue.toLocaleString("vi-VN")}đ`);
  }

  // 4. Check all orders (regardless of status) in last 30 days
  const recentOrders = await prisma.order.count({
    where: {
      createdAt: { gte: thirtyDaysAgo },
    },
  });

  console.log(`\n📅 Total Orders (last 30 days, any status): ${recentOrders}`);

  // 5. Check oldest and newest order
  const oldestOrder = await prisma.order.findFirst({
    orderBy: { createdAt: "asc" },
    select: { createdAt: true, status: true },
  });

  const newestOrder = await prisma.order.findFirst({
    orderBy: { createdAt: "desc" },
    select: { createdAt: true, status: true },
  });

  if (oldestOrder && newestOrder) {
    console.log(`\n📆 Date Range:`);
    console.log(`  - Oldest: ${oldestOrder.createdAt.toLocaleDateString()} (${oldestOrder.status})`);
    console.log(`  - Newest: ${newestOrder.createdAt.toLocaleDateString()} (${newestOrder.status})`);
  }

  // 6. Suggest fix
  console.log("\n🔧 Suggested Fixes:");

  if (deliveredOrders.length === 0) {
    console.log("  1. Update existing orders to DELIVERED status:");
    console.log('     npx prisma studio (manually change status)');
    console.log("  2. Or run seed to create test data:");
    console.log("     npx prisma db seed");
    console.log("  3. Or create new orders via phone-app and complete them");
  } else {
    console.log("  ✅ Data looks good! Check frontend:");
    console.log("  1. Verify admin is logged in");
    console.log("  2. Check browser console for errors");
    console.log("  3. Check Network tab for API calls");
    console.log("  4. Verify API_URL in admin-dashboard/.env.local");
  }

  await prisma.$disconnect();
}

debugRevenue().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
