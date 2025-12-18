import type { Product } from "@/lib/mock";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedStorage?: string;
}

const CART_KEY = "apple-store-cart";

export const getCartItems = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveCartItems = (items: CartItem[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const addToCart = (item: CartItem): void => {
  const items = getCartItems();
  const existingIndex = items.findIndex(
    (i) =>
      i.product.id === item.product.id &&
      i.selectedColor === item.selectedColor &&
      i.selectedStorage === item.selectedStorage
  );

  if (existingIndex >= 0) {
    items[existingIndex].quantity += item.quantity;
  } else {
    items.push(item);
  }

  saveCartItems(items);

  // Dispatch custom event to notify cart updates
  window.dispatchEvent(new Event("cart-updated"));
};

export const removeFromCart = (index: number): void => {
  const items = getCartItems();
  items.splice(index, 1);
  saveCartItems(items);
  window.dispatchEvent(new Event("cart-updated"));
};

export const updateCartItemQuantity = (
  index: number,
  quantity: number
): void => {
  const items = getCartItems();
  if (items[index] && quantity > 0) {
    items[index].quantity = quantity;
    saveCartItems(items);
    window.dispatchEvent(new Event("cart-updated"));
  }
};

export const clearCart = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event("cart-updated"));
};

export const getCartCount = (): number => {
  return getCartItems().reduce((sum, item) => sum + item.quantity, 0);
};
