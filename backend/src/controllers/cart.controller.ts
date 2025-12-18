import { Request, Response } from "express";
import { CartService } from "../services/cart.service";

export class CartController {
  // Get cart
  static async getCart(req: Request, res: Response) {
    const userId = req.user?.id;
    const sessionId = req.cookies.sessionId || req.headers["x-session-id"];

    const cart = await CartService.getOrCreateCart(userId, sessionId as string);

    // Calculate totals
    const items = cart.items.map((item) => ({
      ...item,
      subtotal: item.product.price * item.quantity,
    }));

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);

    res.json({
      cart: {
        ...cart,
        items,
      },
      summary: {
        itemsCount: items.reduce((sum, item) => sum + item.quantity, 0),
        subtotal,
      },
    });
  }

  // Add item to cart
  static async addItem(req: Request, res: Response) {
    const userId = req.user?.id;
    const sessionId = req.cookies.sessionId || req.headers["x-session-id"];

    const cart = await CartService.getOrCreateCart(userId, sessionId as string);

    const { productId, quantity, selectedColor, selectedStorage } = req.body;

    const item = await CartService.addItem(
      cart.id,
      productId,
      quantity,
      selectedColor,
      selectedStorage
    );

    res.status(201).json(item);
  }

  // Update cart item quantity
  static async updateItem(req: Request, res: Response) {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const item = await CartService.updateItemQuantity(itemId, quantity);

    res.json(item);
  }

  // Remove item from cart
  static async removeItem(req: Request, res: Response) {
    const { itemId } = req.params;

    await CartService.removeItem(itemId);

    res.json({ message: "Item removed from cart" });
  }

  // Clear cart
  static async clearCart(req: Request, res: Response) {
    const userId = req.user?.id;
    const sessionId = req.cookies.sessionId || req.headers["x-session-id"];

    const cart = await CartService.getOrCreateCart(userId, sessionId as string);

    await CartService.clearCart(cart.id);

    res.json({ message: "Cart cleared" });
  }
}
