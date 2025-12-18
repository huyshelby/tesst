import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { requireAuth, requireRole } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import {
  createProductSchema,
  updateProductSchema,
  getProductsQuerySchema,
} from "../schemas/product.schema";

const router = Router();

// Public routes
router.get(
  "/",
  validate(getProductsQuerySchema),
  ProductController.getProducts
);
router.get("/:id", ProductController.getProductById);
router.get("/slug/:slug", ProductController.getProductBySlug);

// Admin routes
router.post(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  validate(createProductSchema),
  ProductController.createProduct
);

router.put(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  validate(updateProductSchema),
  ProductController.updateProduct
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  ProductController.deleteProduct
);

export default router;
