"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../middlewares/validate");
const product_schema_1 = require("../schemas/product.schema");
const router = (0, express_1.Router)();
// Public routes
router.get("/", (0, validate_1.validate)(product_schema_1.getProductsQuerySchema), product_controller_1.ProductController.getProducts);
router.get("/:id", product_controller_1.ProductController.getProductById);
router.get("/slug/:slug", product_controller_1.ProductController.getProductBySlug);
// Admin routes
router.post("/", auth_1.requireAuth, (0, auth_1.requireRole)("ADMIN"), (0, validate_1.validate)(product_schema_1.createProductSchema), product_controller_1.ProductController.createProduct);
router.put("/:id", auth_1.requireAuth, (0, auth_1.requireRole)("ADMIN"), (0, validate_1.validate)(product_schema_1.updateProductSchema), product_controller_1.ProductController.updateProduct);
router.delete("/:id", auth_1.requireAuth, (0, auth_1.requireRole)("ADMIN"), product_controller_1.ProductController.deleteProduct);
exports.default = router;
