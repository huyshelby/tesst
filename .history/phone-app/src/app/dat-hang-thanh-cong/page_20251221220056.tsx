"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Check, Package, Clock, MapPin, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppleHeader from "@/components/header/apple-header";
import Footer from "@/components/footer";
import { formatVND } from "@/utils/currency";
import {
  getOrderByNumber,
  getOrderStatusText,
  getPaymentMethodText,
  type Order,
} from "@/lib/order-api";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get("orderNumber");

  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!orderNumber) {
      setError("Không tìm thấy số đơn hàng");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const data = await getOrderByNumber(orderNumber);
        setOrder(data);
      } catch (err: any) {
        setError(err.message || "Không thể tải thông tin đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    // Fetch immediately
    fetchOrder();

    // Poll every 3 seconds for status updates (for blockchain payments)
    const interval = setInterval(() => {
      fetchOrder();
    }, 3000);

    // Cleanup
    return () => clearInterval(interval);
  }, [orderNumber]);

  if (loading) {
    return (
      <>
        <AppleHeader />
        <main className="bg-gray-50 min-h-screen py-12">
          <div className="content-container max-w-[800px]">
            <div className="bg-white rounded-2xl p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--color-brand)] mx-auto"></div>
              <p className="text-gray-600 mt-4">Đang tải thông tin đơn hàng...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <AppleHeader />
        <main className="bg-gray-50 min-h-screen py-12">
          <div className="content-container max-w-[800px]">
            <div className="bg-white rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">❌</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Có lỗi xảy ra
              </h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={() => router.push("/")} className="rounded-full">
                Về trang chủ
              </Button>
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

      <main className="bg-gray-50 min-h-screen py-8 md:py-12">
        <div className="content-container max-w-[800px]">
          {/* Success Header */}
          <div className="bg-white rounded-2xl p-8 md:p-12 text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Đặt hàng thành công!
            </h1>
            <p className="text-gray-600 mb-4">
              Cảm ơn bạn đã mua hàng tại Apple Store
            </p>
            <div className="bg-gray-50 rounded-xl p-4 inline-block">
              <p className="text-sm text-gray-600 mb-1">Mã đơn hàng</p>
              <p className="text-2xl font-bold text-[color:var(--color-brand)]">
                {order.orderNumber}
              </p>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-white rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Trạng thái đơn hàng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                <Package className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Trạng thái</p>
                  <p className="font-semibold text-gray-900">
                    {getOrderStatusText(order.status)}
                  </p>
                </div>
              </div>
              <div className={`flex items-center gap-3 p-4 rounded-xl ${
                order.paymentStatus === "COMPLETED"
                  ? "bg-green-50"
                  : "bg-yellow-50"
              }`}>
                <Clock className={`w-8 h-8 ${
                  order.paymentStatus === "COMPLETED"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`} />
                <div>
                  <p className="text-sm text-gray-600">Thanh toán</p>
                  <p className="font-semibold text-gray-900">
                    {order.paymentStatus === "PENDING"
                      ? "Chờ thanh toán"
                      : order.paymentStatus === "COMPLETED"
                      ? "Đã thanh toán ✓"
                      : order.paymentStatus}
                  </p>
                  {order.paymentStatus === "PENDING" && order.paymentMethod === "CRYPTO" && (
                    <p className="text-xs text-yellow-600 mt-1">
                      Đang chờ xác nhận blockchain...
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                <CreditCard className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Phương thức</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {getPaymentMethodText(order.paymentMethod)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Chi tiết đơn hàng
            </h2>

            {/* Products */}
            <div className="space-y-4 mb-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                  <div className="relative w-20 h-20 bg-gray-50 rounded-lg flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-contain p-2"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {item.product.name}
                    </h3>
                    {(item.selectedColor || item.selectedStorage) && (
                      <p className="text-sm text-gray-600 mb-1">
                        {[item.selectedColor, item.selectedStorage]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Số lượng: {item.quantity}
                      </span>
                      <span className="font-semibold text-[color:var(--color-brand)]">
                        {formatVND(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tạm tính</span>
                <span>{formatVND(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span>
                  {order.shippingFee === 0
                    ? "Miễn phí"
                    : formatVND(order.shippingFee)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Giảm giá</span>
                  <span>-{formatVND(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Tổng cộng</span>
                <span className="text-[color:var(--color-brand)]">
                  {formatVND(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Thông tin giao hàng
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="text-gray-600 w-32">Người nhận:</span>
                <span className="font-medium">{order.customerName}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-32">Số điện thoại:</span>
                <span className="font-medium">{order.customerPhone}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-32">Email:</span>
                <span className="font-medium">{order.customerEmail}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-32">Địa chỉ:</span>
                <span className="font-medium">
                  {order.shippingAddress}
                  {order.shippingWard && `, ${order.shippingWard}`}
                  {order.shippingDistrict && `, ${order.shippingDistrict}`}
                  {order.shippingCity && `, ${order.shippingCity}`}
                </span>
              </div>
              {order.notes && (
                <div className="flex">
                  <span className="text-gray-600 w-32">Ghi chú:</span>
                  <span className="font-medium">{order.notes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/account/orders/${order.id}`} className="flex-1">
              <Button variant="outline" className="w-full rounded-full h-12">
                Xem chi tiết đơn hàng
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button className="w-full rounded-full h-12">
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>

          {/* Info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              📧 Chúng tôi đã gửi email xác nhận đơn hàng đến{" "}
              <span className="font-semibold">{order.customerEmail}</span>. Vui
              lòng kiểm tra hộp thư để theo dõi trạng thái đơn hàng.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
