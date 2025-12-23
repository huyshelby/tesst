"use client";

import * as React from "react";
import { Check } from "lucide-react";
import type { PaymentMethod } from "@/lib/order-api";

const traditionalMethods = [
  { id: "CARD", name: "Thẻ ATM / Visa / Mastercard", icon: "💳" },
  { id: "MOMO", name: "Ví MoMo", icon: "📱" },
  { id: "VNPAY", name: "VNPay", icon: "🏦" },
  { id: "BANK_TRANSFER", name: "Chuyển khoản ngân hàng", icon: "🏛️" },
  { id: "INSTALLMENT", name: "Trả góp 0%", icon: "📊" },
];

export interface CryptoPaymentInfo {
  wallet: string;
  network: string;
  token: string;
}

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  onBlockchainClick?: () => void;
}

export function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
  onBlockchainClick,
}: PaymentMethodSelectorProps) {
  return (
    <div className="bg-white rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Phương thức thanh toán
      </h2>

      {/* Traditional Payment Methods */}
      <div className="space-y-3 mb-6">
        {traditionalMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => onMethodChange(method.id as PaymentMethod)}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition ${
              selectedMethod === method.id
                ? "border-[color:var(--color-brand)] bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <span className="text-2xl">{method.icon}</span>
            <span className="flex-1 text-left font-medium">{method.name}</span>
            {selectedMethod === method.id && (
              <Check className="w-5 h-5 text-[color:var(--color-brand)]" />
            )}
          </button>
        ))}
      </div>

      {/* Blockchain Payment Button */}
      <button
        onClick={onBlockchainClick}
        className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition ${
          selectedMethod === "CRYPTO"
            ? "border-[color:var(--color-brand)] bg-blue-50"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <span className="text-2xl">🦊</span>
        <div className="flex-1 text-left">
          <div className="font-medium">Thanh toán bằng Blockchain</div>
          <div className="text-xs text-gray-500">MetaMask / Crypto Wallet</div>
        </div>
        {selectedMethod === "CRYPTO" && (
          <Check className="w-5 h-5 text-[color:var(--color-brand)]" />
        )}
      </button>
    </div>
  );
}
