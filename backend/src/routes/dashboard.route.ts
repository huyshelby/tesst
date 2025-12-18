import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

// All dashboard routes require admin authentication
router.use(requireAuth, requireRole("ADMIN"));

// Dashboard statistics
router.get("/stats", DashboardController.getStats);
router.get("/revenue", DashboardController.getRevenueChart);
router.get("/order-status", DashboardController.getOrderStatusDistribution);
router.get("/recent-orders", DashboardController.getRecentOrders);
router.get("/best-selling", DashboardController.getBestSellingProducts);

export default router;
