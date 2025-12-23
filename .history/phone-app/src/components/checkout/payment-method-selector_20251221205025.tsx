"use client";

import * as React from "react";
import { Check, AlertCircle, Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/utils/currency";
import type { PaymentMethod } from "@/lib/order-api";
import { useMetaMask } from "@/lib/blockchain/use-metamask";

const traditionalMethods = [
  { id: "CARD", name: "Thẻ ATM / Visa / Mastercard", icon: "💳" },
  { id: "MOMO", name: "Ví MoMo", icon: "📱" },
  { id: "VNPAY", name: "VNPay", icon: "🏦" },
  { id: "BANK_TRANSFER", name: "Chuyển khoản ngân hàng", icon: "🏛️" },
  { id: "INSTALLMENT", name: "Trả góp 0%", icon: "📊" },
];

const cryptoWallets = [
  { id: "metamask", name: "MetaMask", icon: "🦊" },
  { id: "walletconnect", name: "WalletConnect", icon: "🔗" },
  { id: "coinbase", name: "Coinbase Wallet", icon: "🔵" },
];

const networks = [
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "bnb", name: "BNB Chain", symbol: "BNB" },
  { id: "polygon", name: "Polygon", symbol: "MATIC" },
];

const tokens = [
  { id: "usdt", name: "USDT", rate: 25000 },
  { id: "usdc", name: "USDC", rate: 25000 },
  { id: "eth", name: "ETH", rate: 85000000 },
  { id: "bnb", name: "BNB", rate: 15000000 },
];

export interface CryptoPaymentInfo {
  wallet: string;
  network: string;
  token: string;
}

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  cryptoInfo?: CryptoPaymentInfo;
  onCryptoInfoChange?: (info: CryptoPaymentInfo) => void;
  totalAmount: number;
}

export function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
  cryptoInfo,
  onCryptoInfoChange,
  totalAmount,
}: PaymentMethodSelectorProps) {
  const [paymentType, setPaymentType] = React.useState<
    "traditional" | "blockchain"
  >(selectedMethod === "CRYPTO" ? "blockchain" : "traditional");
  const [countdown, setCountdown] = React.useState(600); // 10 minutes

  // Use MetaMask hook for real wallet connection
  const {
    isInstalled,
    isConnected,
    account,
    isCorrectNetwork,
    networkName,
    loading: metamaskLoading,
    connect,
    switchToNetwork
  } = useMetaMask();

  // Check if on Hardhat Local (only ETH available)
  const isHardhatLocal = networkName === "Hardhat Local";

  // Filter tokens based on network
  const availableTokens = React.useMemo(() => {
    if (isHardhatLocal) {
      // Only ETH on Hardhat Local
      return tokens.filter(t => t.id === "eth");
    }
    return tokens;
  }, [isHardhatLocal]);

  const selectedTokenData = tokens.find((t) => t.id === cryptoInfo?.token);
  const cryptoAmount = selectedTokenData
    ? (totalAmount / selectedTokenData.rate).toFixed(6)
    : "0";
  const networkFee = 0.002; // Mock fee

  // Countdown timer
  React.useEffect(() => {
    if (paymentType === "blockchain" && isConnected && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [paymentType, isConnected, countdown]);

  // Handler to connect MetaMask
  const handleConnectWallet = async () => {
    const success = await connect();
    if (success && !isCorrectNetwork) {
      await switchToNetwork();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePaymentTypeChange = (type: "traditional" | "blockchain") => {
    setPaymentType(type);
    if (type === "traditional") {
      onMethodChange("CARD");
    } else {
      onMethodChange("CRYPTO");
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Phương thức thanh toán
      </h2>

      {/* Payment Type Selector */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => handlePaymentTypeChange("traditional")}
          className={`flex-1 px-4 py-3 rounded-xl border-2 transition ${
            paymentType === "traditional"
              ? "border-[color:var(--color-brand)] bg-blue-50"
              : "border-gray-200"
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
            <RadioGroup
              value={cryptoInfo?.token}
              onValueChange={(val) =>
                onCryptoInfoChange?.({ ...cryptoInfo!, token: val })
              }
            >
              <div className="space-y-2">
                {tokens.map((token) => (
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
