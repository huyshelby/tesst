import { fetchApi } from "./api";
import type { Product } from "./product-api";

export type CartItem = {
  id: string;
  cartId: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedColor?: string | null;
  selectedStorage?: string | null;
};

export type Cart = {
  id: string;
  userId?: string | null;
  sessionId?: string | null;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
};

export type CartResponse = {
  cart: Cart;
  summary: {
    itemsCount: number;
    subtotal: number;
  };
};

export async function getCart(): Promise<CartResponse> {
  const res = await fetchApi("/cart", { method: "GET" });
  if (!res.ok) throw new Error("Không thể tải giỏ hàng");
  return res.json();
}

export async function addItem(payload: {
  productId: string;
  quantity: number;
  selectedColor?: string;
  selectedStorage?: string;
}) {
  const res = await fetchApi("/cart/items", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || "Không thể thêm vào giỏ hàng");
  }
  if (typeof window !== "undefined") window.dispatchEvent(new Event("cart-updated"));
  return res.json();
}

export async function updateItem(itemId: string, quantity: number) {
  const res = await fetchApi(`/cart/items/${itemId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error("Không thể cập nhật số lượng");
  if (typeof window !== "undefined") window.dispatchEvent(new Event("cart-updated"));
  return res.json();
}

export async function removeItem(itemId: string) {
  const res = await fetchApi(`/cart/items/${itemId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Không thể xoá sản phẩm khỏi giỏ");
  if (typeof window !== "undefined") window.dispatchEvent(new Event("cart-updated"));
  return res.json();
}

export async function clearCart() {
  const res = await fetchApi(`/cart`, { method: "DELETE" });
  if (!res.ok) throw new Error("Không thể xoá giỏ hàng");
  if (typeof window !== "undefined") window.dispatchEvent(new Event("cart-updated"));
  return res.json();
}

export async function getCartCount(): Promise<number> {
  try {
    const data = await getCart();
    return data.summary.itemsCount;
  } catch {
    return 0;
  }
}

