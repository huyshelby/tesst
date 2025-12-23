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
          <div className="text-sm font-semibold">Thanh toán truyền thống</div>
        </button>
        <button
          onClick={() => handlePaymentTypeChange("blockchain")}
          className={`flex-1 px-4 py-3 rounded-xl border-2 transition ${
            paymentType === "blockchain"
              ? "border-[color:var(--color-brand)] bg-blue-50"
              : "border-gray-200"
          }`}
        >
          <div className="text-sm font-semibold">Thanh toán Blockchain</div>
          <div className="text-xs text-gray-600 mt-1">Crypto / Web3</div>
        </button>
      </div>

      {/* Traditional Payment Methods */}
      {paymentType === "traditional" && (
        <RadioGroup value={selectedMethod} onValueChange={onMethodChange as any}>
          <div className="space-y-3">
            {traditionalMethods.map((method) => (
              <div key={method.id} className="flex items-center space-x-3">
                <RadioGroupItem value={method.id} id={method.id} />
                <Label
                  htmlFor={method.id}
                  className="flex items-center gap-3 cursor-pointer flex-1 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <span className="text-2xl">{method.icon}</span>
                  <span>{method.name}</span>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      )}

      {/* Blockchain Payment Methods */}
      {paymentType === "blockchain" && (
        <div className="space-y-6 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-6">
          {/* Wallet Selection */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Chọn ví
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {cryptoWallets.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() =>
                    onCryptoInfoChange?.({
                      ...cryptoInfo!,
                      wallet: wallet.id,
                    })
                  }
                  className={`p-3 rounded-xl border-2 transition ${
                    cryptoInfo?.wallet === wallet.id
                      ? "border-[color:var(--color-brand)] bg-white"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-1">{wallet.icon}</div>
                  <div className="text-xs font-medium">{wallet.name}</div>
                </button>
              ))}
            </div>

            {/* MetaMask Connection */}
            {!isInstalled && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Vui lòng cài đặt MetaMask extension để tiếp tục
                </p>
                <Button
                  onClick={() => window.open("https://metamask.io/download/", "_blank")}
                  className="w-full mt-2 rounded-full"
                  variant="outline"
                >
                  Tải MetaMask
                </Button>
              </div>
            )}

            {isInstalled && !isConnected && (
              <Button
                onClick={handleConnectWallet}
                disabled={metamaskLoading}
                className="w-full mt-3 rounded-full"
              >
                {metamaskLoading ? "Đang kết nối..." : "Kết nối ví MetaMask"}
              </Button>
            )}

            {isConnected && !isCorrectNetwork && (
              <div className="mt-3 space-y-2">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Vui lòng chuyển sang mạng {networkName}
                  </p>
                </div>
                <Button
                  onClick={switchToNetwork}
                  disabled={metamaskLoading}
                  className="w-full rounded-full"
                >
                  Chuyển sang {networkName}
                </Button>
              </div>
            )}

            {isConnected && isCorrectNetwork && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <div className="flex-1">
                  <span className="text-sm font-medium text-green-700 block">
                    Đã kết nối
                  </span>
                  <span className="text-xs text-green-600 font-mono">
                    {account?.slice(0, 6)}...{account?.slice(-4)}
                  </span>
                </div>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                  {networkName}
                </span>
              </div>
            )}
          </div>

          {/* Network Selection */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Chọn mạng
            </h3>
            <RadioGroup
              value={cryptoInfo?.network}
              onValueChange={(val) =>
                onCryptoInfoChange?.({ ...cryptoInfo!, network: val })
              }
            >
              <div className="space-y-2">
                {networks.map((network) => (
                  <div key={network.id} className="flex items-center space-x-3">
                    <RadioGroupItem value={network.id} id={network.id} />
                    <Label htmlFor={network.id} className="cursor-pointer">
                      {network.name} ({network.symbol})
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Token Selection */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Chọn token
            </h3>
            {isHardhatLocal && (
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  ℹ️ Trên Hardhat Local, chỉ có ETH khả dụng. USDT/USDC chỉ hoạt động trên BSC Testnet.
                </p>
              </div>
            )}
            <RadioGroup
              value={cryptoInfo?.token}
              onValueChange={(val) =>
                onCryptoInfoChange?.({ ...cryptoInfo!, token: val })
              }
            >
              <div className="space-y-2">
                {availableTokens.map((token) => (
                  <div key={token.id} className="flex items-center space-x-3">
                    <RadioGroupItem value={token.id} id={token.id} />
                    <Label htmlFor={token.id} className="cursor-pointer">
                      {token.name}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Payment Details */}
          {isConnected && isCorrectNetwork && (
            <div className="bg-white rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Số tiền (VND)</span>
                <span className="font-semibold">{formatVND(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Số tiền ({selectedTokenData?.name})
                </span>
                <span className="font-semibold">{cryptoAmount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Network fee (ước tính)</span>
                <span className="font-semibold">{networkFee} ETH</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t pt-3">
                <span className="text-gray-600 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Thời gian còn lại
                </span>
                <span className="font-semibold text-orange-600">
                  {formatTime(countdown)}
                </span>
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Lưu ý quan trọng:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Giao dịch Blockchain không thể hoàn tác</li>
                <li>Vui lòng kiểm tra đúng mạng và địa chỉ ví</li>
                <li>Giao dịch sẽ được xác nhận trong 5-15 phút</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
