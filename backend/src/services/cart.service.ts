import { prisma } from "../utils/prisma";
import type { Prisma } from "@prisma/client";

export class CartService {
  // Get or create cart for user
  static async getOrCreateCart(userId?: string, sessionId?: string) {
    if (!userId && !sessionId) {
      throw new Error("Either userId or sessionId is required");
    }

    const where = userId ? { userId } : { sessionId };

    let cart = await prisma.cart.findUnique({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: userId ? { userId } : { sessionId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    return cart;
  }

  // Add item to cart
  static async addItem(
    cartId: string,
    productId: string,
    quantity: number,
    selectedColor?: string,
    selectedStorage?: string
  ) {
    // Check if product exists and has stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.stock < quantity) {
      throw new Error("Insufficient stock");
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId,
        productId,
        selectedColor,
        selectedStorage,
      },
    });

    if (existingItem) {
      // Update quantity
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true },
      });
    }

    // Create new item
    return prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity,
        selectedColor,
        selectedStorage,
      },
      include: { product: true },
    });
  }

  // Update cart item quantity
  static async updateItemQuantity(itemId: string, quantity: number) {
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true },
    });

    if (!item) {
      throw new Error("Cart item not found");
    }

    if (item.product.stock < quantity) {
      throw new Error("Insufficient stock");
    }

    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { product: true },
    });
  }

  // Remove item from cart
  static async removeItem(itemId: string) {
    return prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  // Clear cart
  static async clearCart(cartId: string) {
    return prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }

  // Get cart with items
  static async getCart(cartId: string) {
    return prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}
