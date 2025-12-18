import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { optionalAuth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
} from "../schemas/cart.schema";

const router = Router();

// All cart routes support both authenticated and anonymous users
router.get("/", optionalAuth, CartController.getCart);

router.post(
  "/items",
  optionalAuth,
  validate(addToCartSchema),
  CartController.addItem
);

router.put(
  "/items/:itemId",
  optionalAuth,
  validate(updateCartItemSchema),
  CartController.updateItem
);

router.delete(
  "/items/:itemId",
  optionalAuth,
  validate(removeCartItemSchema),
  CartController.removeItem
);

router.delete("/", optionalAuth, CartController.clearCart);

export default router;
