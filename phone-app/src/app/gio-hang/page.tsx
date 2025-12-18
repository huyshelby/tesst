"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/mock";
import { formatVND } from "@/utils/currency";
import AppleHeader from "@/components/header/apple-header";
import Footer from "@/components/footer";
import { getCartItems, saveCartItems, type CartItem } from "@/lib/cart";

export default function CartPage() {
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  React.useEffect(() => {
    setCartItems(getCartItems());
  }, []);

  // Upsell accessories
  const accessories = products.slice(-3);
  const [selectedAccessories, setSelectedAccessories] = React.useState<
    string[]
  >([]);

  const updateQuantity = (index: number, delta: number) => {
    setCartItems((prev) => {
      const newItems = [...prev];
      const newQty = newItems[index].quantity + delta;
      if (newQty > 0) {
        newItems[index].quantity = newQty;
      }
      saveCartItems(newItems);
      return newItems;
    });
  };

  const removeItem = (index: number) => {
    setCartItems((prev) => {
      const newItems = prev.filter((_, i) => i !== index);
      saveCartItems(newItems);
      return newItems;
    });
  };

  const toggleAccessory = (id: string) => {
    setSelectedAccessories((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const accessoriesTotal = accessories
    .filter((a) => selectedAccessories.includes(a.id))
    .reduce((sum, a) => sum + a.price, 0);
  const discount = 0;
  const shipping = subtotal > 10000000 ? 0 : 300000;
  const total = subtotal + accessoriesTotal - discount + shipping;

  return (
    <>
      <AppleHeader />

      <main className="bg-gray-50 min-h-screen py-8 md:py-12">
        <div className="content-container max-w-[1140px]">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
              Giỏ hàng
            </h1>
            <p className="text-gray-600 mt-2">{cartItems.length} sản phẩm</p>
          </div>

          {cartItems.length === 0 ? (
            // Empty cart
            <div className="bg-white rounded-2xl p-12 text-center">
              <p className="text-xl text-gray-600 mb-6">
                Giỏ hàng của bạn đang trống
              </p>
              <Link href="/">
                <Button size="lg" className="rounded-full">
                  Tiếp tục mua sắm
                </Button>
              </Link>
            </div>
          ) : (
            // Cart with items
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left column - Cart items + Upsell */}
              <div className="lg:col-span-2 space-y-6">
                {/* Cart Items */}
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl p-4 md:p-6 flex gap-4 hover:shadow-md transition"
                    >
                      {/* Product Image */}
                      <div className="relative w-24 h-24 md:w-32 md:h-32 bg-gray-50 rounded-xl flex-shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-contain p-3"
                          sizes="128px"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-grow space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <Link href={`/product/${item.product.id}`}>
                              <h3 className="font-semibold text-gray-900 hover:text-[color:var(--color-brand)] transition line-clamp-2">
                                {item.product.name}
                              </h3>
                            </Link>
                            <div className="text-sm text-gray-600 space-y-0.5">
                              {item.selectedColor && (
                                <p>Màu: {item.selectedColor}</p>
                              )}
                              {item.selectedStorage && (
                                <p>Dung lượng: {item.selectedStorage}</p>
                              )}
                            </div>
                          </div>

                          {/* Delete button */}
                          <button
                            onClick={() => removeItem(index)}
                            className="text-gray-400 hover:text-red-500 transition p-1"
                            aria-label="Xoá"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity controls */}
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(index, -1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(index, 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-lg font-bold text-[color:var(--color-brand)]">
                              {formatVND(item.product.price * item.quantity)}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-sm text-gray-500">
                                {formatVND(item.product.price)} / sp
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upsell Section */}
                <div className="bg-white rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Mua kèm ưu đãi
                  </h3>
                  <div className="space-y-3">
                    {accessories.map((accessory) => {
                      const isSelected = selectedAccessories.includes(
                        accessory.id
                      );
                      return (
                        <button
                          key={accessory.id}
                          onClick={() => toggleAccessory(accessory.id)}
                          className={`w-full flex items-center gap-4 p-3 rounded-xl border-2 transition ${
                            isSelected
                              ? "border-[color:var(--color-brand)] bg-blue-50/50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {/* Checkbox */}
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                              isSelected
                                ? "bg-[color:var(--color-brand)] border-[color:var(--color-brand)]"
                                : "border-gray-300"
                            }`}
                          >
                            {isSelected && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>

                          {/* Image */}
                          <div className="relative w-12 h-12 bg-gray-50 rounded-lg flex-shrink-0">
                            <Image
                              src={accessory.image}
                              alt={accessory.name}
                              fill
                              className="object-contain p-1"
                              sizes="48px"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-grow text-left">
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">
                              {accessory.name}
                            </p>
                            <p className="text-sm text-[color:var(--color-brand)] font-semibold">
                              {formatVND(accessory.price)}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right column - Order Summary (sticky) */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 space-y-4 lg:sticky lg:top-24">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Tóm tắt đơn hàng
                  </h3>

                  {/* Summary rows */}
                  <div className="space-y-3 py-4 border-t border-b border-gray-200">
                    <div className="flex justify-between text-gray-600">
                      <span>Tạm tính</span>
                      <span className="font-medium">{formatVND(subtotal)}</span>
                    </div>

                    {selectedAccessories.length > 0 && (
                      <div className="flex justify-between text-gray-600">
                        <span>Phụ kiện</span>
                        <span className="font-medium">
                          {formatVND(accessoriesTotal)}
                        </span>
                      </div>
                    )}

                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Giảm giá</span>
                        <span className="font-medium">
                          -{formatVND(discount)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-600">
                      <span>Phí vận chuyển</span>
                      <span className="font-medium">
                        {shipping === 0 ? "Miễn phí" : formatVND(shipping)}
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center py-2">
                    <span className="text-lg font-semibold text-gray-900">
                      Tổng cộng
                    </span>
                    <span className="text-2xl font-bold text-[color:var(--color-brand)]">
                      {formatVND(total)}
                    </span>
                  </div>

                  {/* CTA */}
                  <Link href="/thanh-toan">
                    <Button
                      size="lg"
                      className="w-full rounded-full text-base h-12"
                    >
                      Tiến hành thanh toán
                    </Button>
                  </Link>

                  {/* Free shipping notice */}
                  {shipping > 0 && (
                    <p className="text-xs text-center text-gray-500">
                      Mua thêm {formatVND(10000000 - subtotal)} để được miễn phí
                      vận chuyển
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
