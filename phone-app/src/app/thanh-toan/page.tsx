"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import AppleHeader from "@/components/header/apple-header";
import Footer from "@/components/footer";
import { products } from "@/lib/mock";
import { formatVND } from "@/utils/currency";
import { getCartItems, type CartItem } from "@/lib/cart";

const steps = [
  { id: 1, name: "Giỏ hàng", href: "/gio-hang" },
  { id: 2, name: "Thông tin", href: "/thanh-toan" },
  { id: 3, name: "Thanh toán", href: "/thanh-toan" },
  { id: 4, name: "Hoàn tất", href: "#" },
];

const traditionalMethods = [
  { id: "card", name: "Thẻ ATM / Visa / Mastercard", icon: "💳" },
  { id: "momo", name: "Ví MoMo", icon: "📱" },
  { id: "vnpay", name: "VNPay", icon: "🏦" },
  { id: "bank", name: "Chuyển khoản ngân hàng", icon: "🏛️" },
  { id: "installment", name: "Trả góp 0%", icon: "📊" },
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

export default function CheckoutPage() {
  const [query, setQuery] = React.useState("");
  const [paymentType, setPaymentType] = React.useState<
    "traditional" | "blockchain"
  >("traditional");
  const [selectedMethod, setSelectedMethod] = React.useState("card");
  const [selectedWallet, setSelectedWallet] = React.useState("metamask");
  const [selectedNetwork, setSelectedNetwork] = React.useState("ethereum");
  const [selectedToken, setSelectedToken] = React.useState("usdt");
  const [walletConnected, setWalletConnected] = React.useState(false);
  const [countdown, setCountdown] = React.useState(600); // 10 minutes
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);

  // Load cart items from localStorage
  React.useEffect(() => {
    setCartItems(getCartItems());
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 10000000 ? 0 : 300000;
  const discount = 0;
  const total = subtotal - discount + shipping;

  // Convert to crypto
  const selectedTokenData = tokens.find((t) => t.id === selectedToken);
  const cryptoAmount = selectedTokenData
    ? (total / selectedTokenData.rate).toFixed(6)
    : "0";
  const networkFee = 0.002; // Mock fee

  // Countdown timer
  React.useEffect(() => {
    if (paymentType === "blockchain" && walletConnected && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [paymentType, walletConnected, countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <AppleHeader query={query} setQuery={setQuery} />

      <main className="bg-gray-50 min-h-screen py-8">
        <div className="content-container max-w-[1200px]">
          {/* Progress Steps */}
          <div className="bg-white rounded-2xl p-6 mb-6">
            <nav aria-label="Progress">
              <ol className="flex items-center justify-between">
                {steps.map((step, idx) => (
                  <li key={step.id} className="flex items-center">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                          idx <= 1
                            ? "border-[color:var(--color-brand)] bg-[color:var(--color-brand)] text-white"
                            : "border-gray-300 text-gray-400"
                        }`}
                      >
                        {idx < 1 ? <Check className="w-5 h-5" /> : step.id}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          idx <= 1 ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {step.name}
                      </span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div
                        className={`mx-4 h-0.5 w-16 md:w-32 ${
                          idx < 1
                            ? "bg-[color:var(--color-brand)]"
                            : "bg-gray-300"
                        }`}
                      />
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Information & Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <div className="bg-white rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Thông tin khách hàng
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Họ và tên *</Label>
                      <Input
                        id="name"
                        placeholder="Nguyễn Văn A"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Số điện thoại *</Label>
                      <Input
                        id="phone"
                        placeholder="0901234567"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Địa chỉ giao hàng *</Label>
                    <Input
                      id="address"
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="save-info" className="w-4 h-4" />
                    <Label htmlFor="save-info" className="cursor-pointer">
                      Lưu thông tin cho lần sau
                    </Label>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Phương thức thanh toán
                </h2>

                {/* Payment Type Selector */}
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => setPaymentType("traditional")}
                    className={`flex-1 px-4 py-3 rounded-xl border-2 transition ${
                      paymentType === "traditional"
                        ? "border-[color:var(--color-brand)] bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="text-sm font-semibold">
                      Thanh toán truyền thống
                    </div>
                  </button>
                  <button
                    onClick={() => setPaymentType("blockchain")}
                    className={`flex-1 px-4 py-3 rounded-xl border-2 transition ${
                      paymentType === "blockchain"
                        ? "border-[color:var(--color-brand)] bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="text-sm font-semibold">
                      Thanh toán Blockchain
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Crypto / Web3
                    </div>
                  </button>
                </div>

                {/* Traditional Payment Methods */}
                {paymentType === "traditional" && (
                  <RadioGroup
                    value={selectedMethod}
                    onValueChange={setSelectedMethod}
                  >
                    <div className="space-y-3">
                      {traditionalMethods.map((method) => (
                        <div
                          key={method.id}
                          className="flex items-center space-x-3"
                        >
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
                            onClick={() => setSelectedWallet(wallet.id)}
                            className={`p-3 rounded-xl border-2 transition ${
                              selectedWallet === wallet.id
                                ? "border-[color:var(--color-brand)] bg-white"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          >
                            <div className="text-2xl mb-1">{wallet.icon}</div>
                            <div className="text-xs font-medium">
                              {wallet.name}
                            </div>
                          </button>
                        ))}
                      </div>
                      {!walletConnected && (
                        <Button
                          onClick={() => setWalletConnected(true)}
                          className="w-full mt-3 rounded-full"
                        >
                          Kết nối ví
                        </Button>
                      )}
                      {walletConnected && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-700">
                            Đã kết nối: 0x1234...5678
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
                        value={selectedNetwork}
                        onValueChange={setSelectedNetwork}
                      >
                        <div className="space-y-2">
                          {networks.map((network) => (
                            <div
                              key={network.id}
                              className="flex items-center space-x-3"
                            >
                              <RadioGroupItem
                                value={network.id}
                                id={network.id}
                              />
                              <Label
                                htmlFor={network.id}
                                className="cursor-pointer"
                              >
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
                        value={selectedToken}
                        onValueChange={setSelectedToken}
                      >
                        <div className="space-y-2">
                          {tokens.map((token) => (
                            <div
                              key={token.id}
                              className="flex items-center space-x-3"
                            >
                              <RadioGroupItem value={token.id} id={token.id} />
                              <Label
                                htmlFor={token.id}
                                className="cursor-pointer"
                              >
                                {token.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Payment Details */}
                    {walletConnected && (
                      <div className="bg-white rounded-xl p-4 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Số tiền (VND)</span>
                          <span className="font-semibold">
                            {formatVND(total)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            Số tiền ({selectedTokenData?.name})
                          </span>
                          <span className="font-semibold">{cryptoAmount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            Network fee (ước tính)
                          </span>
                          <span className="font-semibold">
                            {networkFee} ETH
                          </span>
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
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 sticky top-24 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Tóm tắt đơn hàng
                </h3>

                {/* Products */}
                <div className="space-y-3 py-4 border-b border-gray-200">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="relative w-16 h-16 bg-gray-50 rounded-lg flex-shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-contain p-2"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {item.selectedColor} • {item.selectedStorage}
                        </p>
                        <p className="text-sm font-semibold text-[color:var(--color-brand)] mt-1">
                          {formatVND(item.product.price)}
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
                      {shipping === 0 ? "Miễn phí" : formatVND(shipping)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Giảm giá</span>
                      <span className="font-medium">
                        -{formatVND(discount)}
                      </span>
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
                  {paymentType === "blockchain" && walletConnected && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        ≈ {cryptoAmount} {selectedTokenData?.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Tỷ giá: 1 {selectedTokenData?.name} ={" "}
                        {formatVND(selectedTokenData?.rate || 0)}
                      </p>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <Button
                  className="w-full rounded-full h-12 text-base font-semibold"
                  disabled={paymentType === "blockchain" && !walletConnected}
                >
                  {paymentType === "blockchain"
                    ? "Thanh toán bằng Blockchain"
                    : "Thanh toán"}
                </Button>

                <p className="text-xs text-center text-gray-500">
                  Bằng cách thanh toán, bạn đồng ý với{" "}
                  <Link href="#" className="text-[color:var(--color-brand)]">
                    Điều khoản dịch vụ
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
