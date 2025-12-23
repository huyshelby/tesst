"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppleHeader from "@/components/header/apple-header";
import Footer from "@/components/footer";
import { formatVND } from "@/utils/currency";
import { getCart, clearCart, type CartItem } from "@/lib/cart-api";
import {
  createOrder,
  type PaymentMethod,
  type CreateOrderPayload,
} from "@/lib/order-api";
import { CustomerInfoForm, validateCustomerInfo, type CustomerInfo } from "@/components/checkout/customer-info-form";
import { PaymentMethodSelector, type CryptoPaymentInfo } from "@/components/checkout/payment-method-selector";
import { OrderSummary } from "@/components/checkout/order-summary";
import { BlockchainPaymentModal } from "@/components/checkout/blockchain-payment-modal";
import { useAuth } from "@/lib/auth-client";
import { TOKENS } from "@/lib/blockchain/config";

const steps = [
  { id: 1, name: "Giỏ hàng", href: "/gio-hang" },
  { id: 2, name: "Thông tin", href: "/thanh-toan" },
  { id: 3, name: "Thanh toán", href: "/thanh-toan" },
  { id: 4, name: "Hoàn tất", href: "#" },
];

const tokens = [
  { id: "usdt", name: "USDT", rate: 25000 },
  { id: "usdc", name: "USDC", rate: 25000 },
  { id: "eth", name: "ETH", rate: 85000000 },
  { id: "bnb", name: "BNB", rate: 15000000 },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Customer info state
  const [customerInfo, setCustomerInfo] = React.useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    notes: "",
  });
  const [validationErrors, setValidationErrors] = React.useState<
    Partial<Record<keyof CustomerInfo, string>>
  >({});

  // Payment state
  const [selectedMethod, setSelectedMethod] = React.useState<PaymentMethod>("CARD");
  const [cryptoInfo, setCryptoInfo] = React.useState<CryptoPaymentInfo>({
    wallet: "metamask",
    network: "ethereum",
    token: "usdt",
  });

  // Load cart from backend
  React.useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await getCart();
        setCartItems(data.cart.items);
      } catch (err: any) {
        setError(err.message || "Không thể tải giỏ hàng");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  // Redirect if not logged in (after auth loads)
  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/thanh-toan");
    }
  }, [user, authLoading, router]);

  // Auto-fill user info if available
  React.useEffect(() => {
    if (user) {
      setCustomerInfo((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 10000000 ? 0 : 300000;
  const discount = 0;
  const total = subtotal - discount + shipping;

  // Convert to crypto
  const selectedTokenData = tokens.find((t) => t.id === cryptoInfo.token);
  const cryptoAmount = selectedTokenData
    ? (total / selectedTokenData.rate).toFixed(6)
    : "0";

  const handleSubmitOrder = async () => {
    // Validate customer info
    const validation = validateCustomerInfo(customerInfo);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setError("Vui lòng điền đầy đủ thông tin bắt buộc");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setValidationErrors({});
    setError(null);
    setSubmitting(true);

    try {
      // Prepare payload
      const payload: CreateOrderPayload = {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        shippingAddress: customerInfo.address,
        shippingCity: customerInfo.city,
        shippingDistrict: customerInfo.district || undefined,
        shippingWard: customerInfo.ward || undefined,
        paymentMethod: selectedMethod,
        notes: customerInfo.notes || undefined,
      };

      // Add crypto info if blockchain payment
      if (selectedMethod === "CRYPTO") {
        payload.cryptoWallet = cryptoInfo.wallet;
        payload.cryptoNetwork = cryptoInfo.network;
        payload.cryptoToken = cryptoInfo.token;
      }

      // Create order
      const order = await createOrder(payload);

      // Clear cart after successful order
      await clearCart();

      // Redirect to success page
      router.push(`/dat-hang-thanh-cong?orderNumber=${order.orderNumber}`);
    } catch (err: any) {
      setError(err.message || "Không thể tạo đơn hàng");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <AppleHeader />
        <main className="bg-gray-50 min-h-screen py-12">
          <div className="content-container max-w-[1200px]">
            <div className="bg-white rounded-2xl p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--color-brand)] mx-auto"></div>
              <p className="text-gray-600 mt-4">Đang tải...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <AppleHeader />
        <main className="bg-gray-50 min-h-screen py-12">
          <div className="content-container max-w-[1200px]">
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
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AppleHeader />

      <main className="bg-gray-50 min-h-screen py-8">
        <div className="content-container max-w-[1200px]">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <span className="text-red-600 text-xl">⚠️</span>
              <div>
                <p className="text-sm font-semibold text-red-800">Có lỗi xảy ra</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

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
              <CustomerInfoForm
                value={customerInfo}
                onChange={setCustomerInfo}
                errors={validationErrors}
              />

              {/* Payment Methods */}
              <PaymentMethodSelector
                selectedMethod={selectedMethod}
                onMethodChange={setSelectedMethod}
                cryptoInfo={cryptoInfo}
                onCryptoInfoChange={setCryptoInfo}
                totalAmount={total}
              />
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary
                items={cartItems}
                subtotal={subtotal}
                shipping={shipping}
                discount={discount}
                total={total}
                cryptoAmount={selectedMethod === "CRYPTO" ? cryptoAmount : undefined}
                cryptoToken={selectedMethod === "CRYPTO" ? selectedTokenData?.name : undefined}
                cryptoRate={selectedMethod === "CRYPTO" ? selectedTokenData?.rate : undefined}
              />

              {/* Submit Button */}
              <div className="mt-4">
                <Button
                  onClick={handleSubmitOrder}
                  disabled={submitting}
                  className="w-full rounded-full h-12 text-base font-semibold"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      Đang xử lý...
                    </span>
                  ) : selectedMethod === "CRYPTO" ? (
                    "Thanh toán bằng Blockchain"
                  ) : (
                    "Hoàn tất đặt hàng"
                  )}
                </Button>

                <p className="text-xs text-center text-gray-500 mt-3">
                  Bằng cách đặt hàng, bạn đồng ý với{" "}
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
