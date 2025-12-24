import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { requireAuth, requireRole } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import {
  createOrderSchema,
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
  getOrdersQuerySchema,
  blockchainPaymentSchema,
} from "../schemas/order.schema";

const router = Router();

// User routes
router.post(
  "/",
  requireAuth,
  validate(createOrderSchema),
  OrderController.createOrder
);

router.get(
  "/",
  requireAuth,
  validate(getOrdersQuerySchema),
  OrderController.getUserOrders
);

router.get("/:orderId", requireAuth, OrderController.getOrderById);

router.get(
  "/number/:orderNumber",
  requireAuth,
  OrderController.getOrderByNumber
);

router.post("/:orderId/cancel", requireAuth, OrderController.cancelOrder);

router.post(
  "/:orderId/blockchain-payment",
  validate(blockchainPaymentSchema),
  OrderController.handleBlockchainPayment
);

// NFT Receipt routes
router.post(
  "/:orderId/nft-receipt",
  requireAuth,
  OrderController.mintOrderReceipt
);

router.get(
  "/:orderId/nft-receipt",
  requireAuth,
  OrderController.getOrderReceipt
);


// Admin routes
router.get(
  "/admin/all",
  requireAuth,
  requireRole("ADMIN"),
  validate(getOrdersQuerySchema),
  OrderController.getAllOrders
);

router.put(
  "/admin/:orderId/status",
  requireAuth,
  requireRole("ADMIN"),
  validate(updateOrderStatusSchema),
  OrderController.updateOrderStatus
);

router.put(
  "/admin/:orderId/payment",
  requireAuth,
  requireRole("ADMIN"),
  validate(updatePaymentStatusSchema),
  OrderController.updatePaymentStatus
);

router.delete(
  "/admin/:orderId",
  requireAuth,
  requireRole("ADMIN"),
  OrderController.deleteOrder
);

export default router;
