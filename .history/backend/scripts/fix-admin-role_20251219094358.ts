import { prisma } from "../src/utils/prisma";
import { Role } from "@prisma/client";

async function fixAdminRole() {
  try {
    const adminEmail = "admin@example.com";

    // Tìm user
    const user = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!user) {
      console.log("❌ User not found:", adminEmail);
      return;
    }

    console.log("📋 Current user info:");
    console.log("   Email:", user.email);
    console.log("   Role:", user.role);
    console.log("   Name:", user.name);

    // Nếu chưa phải ADMIN, cập nhật
    if (user.role !== Role.ADMIN) {
      const updated = await prisma.user.update({
        where: { email: adminEmail },
        data: { role: Role.ADMIN },
      });

      console.log("\n✅ Updated user to ADMIN role");
      console.log("   New role:", updated.role);
    } else {
      console.log("\n✅ User already has ADMIN role");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAdminRole();
