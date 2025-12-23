"use client";

import * as React from "react";
import { X, CheckCircle, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMetaMask } from "@/lib/blockchain/use-metamask";
import { usePayment } from "@/lib/blockchain/use-payment";
import { formatVND } from "@/utils/currency";

interface BlockchainPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: string;
  totalVND: number;
  cryptoAmount: string;
  cryptoToken: string;
  tokenAddress: string;
  onSuccess: (txHash: string) => void;
}

type PaymentStep = "connect" | "approve" | "payment" | "confirming" | "success" | "error";

export function BlockchainPaymentModal({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  totalVND,
  cryptoAmount,
  cryptoToken,
  tokenAddress,
  onSuccess
}: BlockchainPaymentModalProps) {
  const [step, setStep] = React.useState<PaymentStep>("connect");
  const [txHash, setTxHash] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState<string>("");

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

  const {
    loading: paymentLoading,
    error: paymentError,
    payWithToken,
    payWithNative
  } = usePayment();

  const isNativeToken = tokenAddress === "0x0000000000000000000000000000000000000000";

  // Auto-connect on mount if MetaMask is installed
  React.useEffect(() => {
    if (isOpen && isInstalled && !isConnected) {
      handleConnect();
    }
  }, [isOpen, isInstalled, isConnected]);

  // Check network after connection
  React.useEffect(() => {
    if (isConnected && !isCorrectNetwork) {
      setStep("connect");
    } else if (isConnected && isCorrectNetwork) {
      setStep("payment");
    }
  }, [isConnected, isCorrectNetwork]);

  const handleConnect = async () => {
    setErrorMessage("");
    const success = await connect();
    if (success) {
      if (!isCorrectNetwork) {
        await handleSwitchNetwork();
      } else {
        setStep("payment");
      }
    } else {
      setErrorMessage("Không thể kết nối MetaMask");
    }
  };

  const handleSwitchNetwork = async () => {
    setErrorMessage("");
    const success = await switchToNetwork();
    if (success) {
      setStep("payment");
    } else {
      setErrorMessage(`Vui lòng chuyển sang mạng ${networkName}`);
    }
  };

  const handlePayment = async () => {
    setErrorMessage("");
    setStep("confirming");

    try {
      let result;
      
      if (isNativeToken) {
        // Pay with native coin (ETH/BNB)
        result = await payWithNative(orderId, cryptoAmount);
      } else {
        // Pay with ERC20 token (USDT/USDC)
        result = await payWithToken(orderId, tokenAddress, cryptoAmount);
      }

      if (result.success && result.txHash) {
        setTxHash(result.txHash);
        setStep("success");
        onSuccess(result.txHash);
      } else {
        setStep("error");
        setErrorMessage(result.error || "Giao dịch thất bại");
      }
    } catch (err: any) {
      setStep("error");
      setErrorMessage(err.message || "Có lỗi xảy ra");
    }
  };

  const handleClose = () => {
    if (step !== "confirming") {
      onClose();
    }
  };

  const getExplorerUrl = () => {
    if (!txHash) return "";
    // For Hardhat local, no explorer
    if (networkName === "Hardhat Local") return "";
    // For BSC Testnet
    return `https://testnet.bscscan.com/tx/${txHash}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        {/* Close button */}
        {step !== "confirming" && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Thanh toán Blockchain
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Đơn hàng: {orderNumber}
          </p>
        </div>

        {/* Content based on step */}
        <div className="space-y-4">
          {/* Step: Connect Wallet */}
          {step === "connect" && (
            <>
              {!isInstalled && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    Vui lòng cài đặt MetaMask extension để tiếp tục
                  </p>
                  <Button
                    onClick={() => window.open("https://metamask.io/download/", "_blank")}
                    className="mt-3 w-full"
                  >
                    Tải MetaMask
                  </Button>
                </div>
              )}

              {isInstalled && !isConnected && (
                <>
                  <p className="text-sm text-gray-600">
                    Kết nối ví MetaMask để thanh toán
                  </p>
                  <Button
                    onClick={handleConnect}
                    disabled={metamaskLoading}
                    className="w-full"
                  >
                    {metamaskLoading ? "Đang kết nối..." : "Kết nối MetaMask"}
                  </Button>
                </>
              )}

              {isConnected && !isCorrectNetwork && (
                <>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      Vui lòng chuyển sang mạng {networkName}
                    </p>
                  </div>
                  <Button onClick={handleSwitchNetwork} className="w-full">
                    Chuyển sang {networkName}
                  </Button>
                </>
              )}

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">{errorMessage}</p>
                </div>
              )}
            </>
          )}

          {/* Step: Payment */}
          {step === "payment" && (
            <>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Số tiền (VND)</span>
                  <span className="font-semibold">{formatVND(totalVND)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Số tiền ({cryptoToken})</span>
                  <span className="font-semibold">{cryptoAmount} {cryptoToken}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Mạng</span>
                  <span className="font-semibold">{networkName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ví</span>
                  <span className="font-mono text-xs">
                    {account?.slice(0, 6)}...{account?.slice(-4)}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  {isNativeToken 
                    ? `Bạn sẽ thanh toán ${cryptoAmount} ${cryptoToken} cho đơn hàng này.`
                    : `Bạn sẽ cần approve token trước, sau đó thanh toán ${cryptoAmount} ${cryptoToken}.`
                  }
                </p>
              </div>

              <Button
                onClick={handlePayment}
                disabled={paymentLoading}
                className="w-full"
              >
                {paymentLoading ? "Đang xử lý..." : "Xác nhận thanh toán"}
              </Button>
            </>
          )}

          {/* Step: Confirming */}
          {step === "confirming" && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-lg font-semibold text-gray-900 mb-2">
                Đang xử lý giao dịch...
              </p>
              <p className="text-sm text-gray-600">
                Vui lòng xác nhận trong MetaMask và chờ transaction confirm
              </p>
            </div>
          )}

          {/* Step: Success */}
          {step === "success" && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <p className="text-xl font-bold text-gray-900 mb-2">
                Thanh toán thành công!
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Giao dịch của bạn đã được xác nhận trên blockchain
              </p>
              
              {txHash && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-600 mb-1">Transaction Hash:</p>
                  <p className="text-xs font-mono break-all">{txHash}</p>
                </div>
              )}

              {getExplorerUrl() && (
                <Button
                  onClick={() => window.open(getExplorerUrl(), "_blank")}
                  variant="outline"
                  className="w-full mb-3"
                >
                  Xem trên Explorer <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              )}

              <Button onClick={onClose} className="w-full">
                Hoàn tất
              </Button>
            </div>
          )}

          {/* Step: Error */}
          {step === "error" && (
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <p className="text-xl font-bold text-gray-900 mb-2">
                Giao dịch thất bại
              </p>
              <p className="text-sm text-gray-600 mb-4">
                {errorMessage || paymentError || "Có lỗi xảy ra"}
              </p>
              <div className="space-y-2">
                <Button onClick={() => setStep("payment")} className="w-full">
                  Thử lại
                </Button>
                <Button onClick={onClose} variant="outline" className="w-full">
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

