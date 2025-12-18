import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { requireAuth, requireRole } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../schemas/category.schema";

const router = Router();

// Public routes
router.get("/", CategoryController.getCategories);
router.get("/tree", CategoryController.getCategoryTree);
router.get("/:id", CategoryController.getCategoryById);
router.get("/slug/:slug", CategoryController.getCategoryBySlug);

// Admin routes
router.post(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  validate(createCategorySchema),
  CategoryController.createCategory
);

router.put(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  validate(updateCategorySchema),
  CategoryController.updateCategory
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  CategoryController.deleteCategory
);

export default router;
