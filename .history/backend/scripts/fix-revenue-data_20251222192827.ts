/**
 * Quick fix: Update recent paid orders to DELIVERED status
 * This will make revenue data appear in dashboard
 * 
 * Run: npx tsx scripts/fix-revenue-data.ts
 */

import { prisma } from "../src/utils/prisma";

async function fixRevenueData() {
  console.log("🔧 Fixing Revenue Data...\n");

  // Find recent orders that are paid but not delivered
  const ordersToUpdate = await prisma.order.findMany({
    where: {
      paymentStatus: "COMPLETED",
      status: {
        in: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPING"],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20, // Update last 20 paid orders
    select: {
      id: true,
      orderNumber: true,
      status: true,
      total: true,
      createdAt: true,
    },
  });

  if (ordersToUpdate.length === 0) {
    console.log("✅ No orders to update. All paid orders are already DELIVERED.");
    
    // Check if there are any DELIVERED orders at all
    const deliveredCount = await prisma.order.count({
      where: { status: "DELIVERED" },
    });

    if (deliveredCount === 0) {
      console.log("\n⚠️  NO DELIVERED ORDERS in database!");
      console.log("   You need to create orders first:");
      console.log("   1. Run: npm run seed");
      console.log("   2. Or create orders via phone-app");
      console.log("   3. Then run this script again");
    } else {
      console.log(`\n✅ Found ${deliveredCount} DELIVERED orders in database`);
      console.log("   Revenue should display in dashboard now.");
    }

    await prisma.$disconnect();
    return;
  }

  console.log(`📦 Found ${ordersToUpdate.length} paid orders to mark as DELIVERED:\n`);

  ordersToUpdate.forEach((order, idx) => {
    console.log(
      `${idx + 1}. ${order.orderNumber} - ${order.status} → DELIVERED (${order.total.toLocaleString("vi-VN")}đ)`
    );
  });

  console.log("\n🚀 Updating orders...");

  // Update all orders to DELIVERED
  const result = await prisma.order.updateMany({
    where: {
      id: {
        in: ordersToUpdate.map((o) => o.id),
      },
    },
    data: {
      status: "DELIVERED",
    },
  });

  console.log(`\n✅ Updated ${result.count} orders to DELIVERED status`);

  // Calculate total revenue
  const totalRevenue = ordersToUpdate.reduce((sum, order) => sum + order.total, 0);

  console.log(
    `💰 Total Revenue from updated orders: ${totalRevenue.toLocaleString("vi-VN")}đ`
  );

  // Verify by checking current stats
  const deliveredOrders = await prisma.order.count({
    where: { status: "DELIVERED" },
  });

  console.log(`\n📊 Current Stats:`);
  console.log(`  - Total DELIVERED orders: ${deliveredOrders}`);
  console.log(`  - Revenue should now display in dashboard!`);

  console.log("\n🎉 Done! Refresh admin dashboard to see revenue data.");

  await prisma.$disconnect();
}

fixRevenueData().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
