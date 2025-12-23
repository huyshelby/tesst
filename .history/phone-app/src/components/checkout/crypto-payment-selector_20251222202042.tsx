"use client";

import * as React from "react";
import { Check, AlertCircle, Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/utils/currency";
import { useMetaMask } from "@/lib/blockchain/use-metamask";

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

interface CryptoPaymentSelectorProps {
  cryptoInfo?: CryptoPaymentInfo;
  onCryptoInfoChange?: (info: CryptoPaymentInfo) => void;
  totalAmount: number;
}

export function CryptoPaymentSelector({
  cryptoInfo,
  onCryptoInfoChange,
  totalAmount,
}: CryptoPaymentSelectorProps) {
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
      return tokens.filter(t => t.id === "eth");
    }
    return tokens;
  }, [isHardhatLocal]);

  const selectedTokenData = availableTokens.find((t) => t.id === cryptoInfo?.token);
  const cryptoAmount = selectedTokenData
    ? (totalAmount / selectedTokenData.rate).toFixed(6)
    : "0";
  const networkFee = 0.002; // Mock fee

  // Auto-select ETH if on Hardhat Local and USDT/USDC is selected
  React.useEffect(() => {
    if (isHardhatLocal && cryptoInfo?.token && !["eth", "bnb"].includes(cryptoInfo.token)) {
      onCryptoInfoChange?.({ ...cryptoInfo, token: "eth" });
    }
  }, [isHardhatLocal, cryptoInfo, onCryptoInfoChange]);

  // Countdown timer
  React.useEffect(() => {
    if (isConnected && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isConnected, countdown]);

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

  return (
    <div className="space-y-6">
      {/* MetaMask Not Installed Warning */}
      {!isInstalled && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-amber-400" />
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                MetaMask chưa được cài đặt.{" "}
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline hover:text-amber-800"
                >
                  Tải xuống tại đây
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Wrong Network Warning */}
      {isInstalled && isConnected && !isCorrectNetwork && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
            <div className="ml-3">
              <p className="text-sm text-red-700 mb-2">
                Vui lòng chuyển sang mạng Hardhat Local (Chain ID: 31337)
              </p>
              <Button
                onClick={switchToNetwork}
                variant="outline"
                size="sm"
                className="bg-white hover:bg-red-50"
              >
                Chuyển mạng
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Connect Wallet Section */}
      {!isConnected && (
        <div className="space-y-4">
          <Label className="text-gray-700 font-medium">
            Kết nối ví
          </Label>
          <div className="grid gap-3">
            {cryptoWallets.map((wallet) => (
              <button
                key={wallet.id}
                disabled={wallet.id !== "metamask" || !isInstalled || metamaskLoading}
                onClick={() => {
                  if (wallet.id === "metamask") {
                    handleConnectWallet();
                  }
                  onCryptoInfoChange?.({
                    wallet: wallet.id,
                    network: cryptoInfo?.network || "",
                    token: cryptoInfo?.token || "",
                  });
                }}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition ${
                  cryptoInfo?.wallet === wallet.id
                    ? "border-[color:var(--color-brand)] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${
                  wallet.id !== "metamask" || !isInstalled
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                } ${metamaskLoading ? "opacity-50 cursor-wait" : ""}`}
              >
                <span className="text-3xl">{wallet.icon}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium">{wallet.name}</div>
                  {wallet.id !== "metamask" && (
                    <div className="text-xs text-gray-500">Sắp ra mắt</div>
                  )}
                  {wallet.id === "metamask" && metamaskLoading && (
                    <div className="text-xs text-blue-600">Đang kết nối...</div>
                  )}
                </div>
                {cryptoInfo?.wallet === wallet.id && (
                  <Check className="w-5 h-5 text-[color:var(--color-brand)]" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Connected Wallet Info */}
      {isConnected && isCorrectNetwork && (
        <>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-green-700">
              <Check className="w-5 h-5" />
              <div>
                <div className="font-medium">Ví đã kết nối</div>
                <div className="text-sm">
                  {account?.slice(0, 6)}...{account?.slice(-4)}
                </div>
                <div className="text-xs text-green-600 mt-1">
                  {networkName}
                </div>
              </div>
            </div>
          </div>

          {/* Network Selection */}
          <div className="space-y-3">
            <Label className="text-gray-700 font-medium">
              Chọn mạng lưới
            </Label>
            <RadioGroup
              value={cryptoInfo?.network}
              onValueChange={(network) =>
                onCryptoInfoChange?.({
                  wallet: cryptoInfo?.wallet || "",
                  network,
                  token: cryptoInfo?.token || "",
                })
              }
            >
              {networks.map((network) => (
                <div
                  key={network.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border ${
                    network.id === "ethereum"
                      ? "border-gray-200"
                      : "border-gray-100 opacity-50"
                  }`}
                >
                  <RadioGroupItem
                    value={network.id}
                    id={network.id}
                    disabled={network.id !== "ethereum"}
                  />
                  <Label
                    htmlFor={network.id}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="font-medium">{network.name}</div>
                    <div className="text-xs text-gray-500">
                      {network.symbol}
                      {network.id !== "ethereum" && " (Sắp ra mắt)"}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Token Selection */}
          <div className="space-y-3">
            <Label className="text-gray-700 font-medium">
              Chọn loại tiền
            </Label>
            <RadioGroup
              value={cryptoInfo?.token}
              onValueChange={(token) =>
                onCryptoInfoChange?.({
                  wallet: cryptoInfo?.wallet || "",
                  network: cryptoInfo?.network || "",
                  token,
                })
              }
            >
              {availableTokens.map((token) => (
                <div
                  key={token.id}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200"
                >
                  <RadioGroupItem value={token.id} id={token.id} />
                  <Label
                    htmlFor={token.id}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{token.name}</span>
                      <span className="text-sm text-gray-500">
                        {formatVND(token.rate)}/token
                      </span>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Payment Summary */}
          {cryptoInfo?.token && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tổng tiền:</span>
                <span className="font-medium">{formatVND(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Số lượng crypto:</span>
                <span className="font-medium">
                  {cryptoAmount} {selectedTokenData?.name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phí mạng (dự kiến):</span>
                <span className="font-medium">{networkFee} ETH</span>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                <Clock className="w-4 h-4 text-amber-500" />
                <span className="text-xs text-gray-600">
                  Thời gian giữ giá: {formatTime(countdown)}
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
