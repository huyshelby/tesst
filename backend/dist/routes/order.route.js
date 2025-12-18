"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../middlewares/validate");
const order_schema_1 = require("../schemas/order.schema");
const router = (0, express_1.Router)();
// User routes
router.post("/", auth_1.requireAuth, (0, validate_1.validate)(order_schema_1.createOrderSchema), order_controller_1.OrderController.createOrder);
router.get("/", auth_1.requireAuth, (0, validate_1.validate)(order_schema_1.getOrdersQuerySchema), order_controller_1.OrderController.getUserOrders);
router.get("/:orderId", auth_1.requireAuth, order_controller_1.OrderController.getOrderById);
router.get("/number/:orderNumber", auth_1.requireAuth, order_controller_1.OrderController.getOrderByNumber);
router.post("/:orderId/cancel", auth_1.requireAuth, order_controller_1.OrderController.cancelOrder);
// Admin routes
router.get("/admin/all", auth_1.requireAuth, (0, auth_1.requireRole)("ADMIN"), (0, validate_1.validate)(order_schema_1.getOrdersQuerySchema), order_controller_1.OrderController.getAllOrders);
router.put("/admin/:orderId/status", auth_1.requireAuth, (0, auth_1.requireRole)("ADMIN"), (0, validate_1.validate)(order_schema_1.updateOrderStatusSchema), order_controller_1.OrderController.updateOrderStatus);
router.put("/admin/:orderId/payment", auth_1.requireAuth, (0, auth_1.requireRole)("ADMIN"), (0, validate_1.validate)(order_schema_1.updatePaymentStatusSchema), order_controller_1.OrderController.updatePaymentStatus);
exports.default = router;
