"use client";

import * as React from "react";
import Image from "next/image";
import { formatVND } from "@/utils/currency";
import type { CartItem } from "@/lib/cart-api";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount?: number;
  total: number;
  cryptoAmount?: string;
  cryptoToken?: string;
  cryptoRate?: number;
}

export function OrderSummary({
  items,
  subtotal,
  shipping,
  discount = 0,
  total,
  cryptoAmount,
  cryptoToken,
  cryptoRate,
}: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-2xl p-6 sticky top-24 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Tóm tắt đơn hàng
      </h3>

      {/* Products */}
      <div className="space-y-3 py-4 border-b border-gray-200">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative w-16 h-16 bg-gray-50 rounded-lg flex-shrink-0">
              <Image
                src={item.product.image}
                alt={item.product.name}
                fill
                className="object-contain p-2"
                sizes="64px"
              />
              {item.quantity > 1 && (
                <div className="absolute -top-2 -right-2 bg-[color:var(--color-brand)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {item.quantity}
                </div>
              )}
            </div>
            <div className="flex-grow">
              <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                {item.product.name}
              </h4>
              {(item.selectedColor || item.selectedStorage) && (
                <p className="text-xs text-gray-600 mt-0.5">
                  {[item.selectedColor, item.selectedStorage]
                    .filter(Boolean)
                    .join(" • ")}
                </p>
              )}
              <p className="text-sm font-semibold text-[color:var(--color-brand)] mt-1">
                {formatVND(item.product.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="space-y-3 py-4 border-b border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tạm tính</span>
          <span className="font-medium">{formatVND(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Phí vận chuyển</span>
          <span className="font-medium">
            {shipping === 0 ? (
              <span className="text-green-600">Miễn phí</span>
            ) : (
              formatVND(shipping)
            )}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Giảm giá</span>
            <span className="font-medium">-{formatVND(discount)}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="py-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-semibold text-gray-900">
            Tổng cộng
          </span>
          <span className="text-2xl font-bold text-[color:var(--color-brand)]">
            {formatVND(total)}
          </span>
        </div>
        {cryptoAmount && cryptoToken && cryptoRate && (
          <div className="text-right">
            <p className="text-sm text-gray-600">
              ≈ {cryptoAmount} {cryptoToken}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Tỷ giá: 1 {cryptoToken} = {formatVND(cryptoRate)}
            </p>
          </div>
        )}
      </div>

      {/* Free shipping note */}
      {shipping > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            💡 Mua thêm {formatVND(10000000 - subtotal)} để được{" "}
            <span className="font-semibold">miễn phí vận chuyển</span>
          </p>
        </div>
      )}
    </div>
  );
}
