"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("../controllers/cart.controller");
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../middlewares/validate");
const cart_schema_1 = require("../schemas/cart.schema");
const router = (0, express_1.Router)();
// All cart routes support both authenticated and anonymous users
router.get("/", auth_1.optionalAuth, cart_controller_1.CartController.getCart);
router.post("/items", auth_1.optionalAuth, (0, validate_1.validate)(cart_schema_1.addToCartSchema), cart_controller_1.CartController.addItem);
router.put("/items/:itemId", auth_1.optionalAuth, (0, validate_1.validate)(cart_schema_1.updateCartItemSchema), cart_controller_1.CartController.updateItem);
router.delete("/items/:itemId", auth_1.optionalAuth, (0, validate_1.validate)(cart_schema_1.removeCartItemSchema), cart_controller_1.CartController.removeItem);
router.delete("/", auth_1.optionalAuth, cart_controller_1.CartController.clearCart);
exports.default = router;
