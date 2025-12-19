"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package, MapPin, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppleHeader from "@/components/header/apple-header";
import Footer from "@/components/footer";
import { formatVND } from "@/utils/currency";
import {
  getOrderById,
  getOrderStatusText,
  getOrderStatusColor,
  getPaymentMethodText,
  canCancelOrder,
  cancelOrder,
  type Order,
} from "@/lib/order-api";
import { useAuth } from "@/lib/auth-client";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const orderId = params?.orderId as string;

  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?redirect=/account/orders");
    }
  }, [user, authLoading, router]);

  React.useEffect(() => {
    if (!user || !orderId) return;

    const fetchOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (err: any) {
        setError(err.message || "Không thể tải đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [user, orderId]);

  const handleCancelOrder = async () => {
    if (!order || !confirm("Bạn có chắc muốn huỷ đơn hàng này?")) return;

    try {
      const updated = await cancelOrder(order.id);
      setOrder(updated);
    } catch (err: any) {
      alert(err.message || "Không thể huỷ đơn hàng");
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

  if (error || !order) {
    return (
      <>
        <AppleHeader />
        <main className="bg-gray-50 min-h-screen py-12">
          <div className="content-container max-w-[1200px]">
            <div className="bg-white rounded-2xl p-12 text-center">
              <p className="text-xl text-gray-600 mb-6">{error}</p>
              <Link href="/account/orders">
                <Button size="lg" className="rounded-full">
                  Quay lại danh sách đơn hàng
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

      <main className="bg-gray-50 min-h-screen py-8 md:py-12">
        <div className="content-container max-w-[1200px]">
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh sách đơn hàng
          </Link>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Header */}
              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      Đơn hàng #{order.orderNumber}
                    </h1>
                    <p className="text-sm text-gray-600">
                      Đặt ngày{" "}
                      {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-sm px-4 py-2 rounded-full border font-medium ${getOrderStatusColor(
                      order.status
                    )}`}
                  >
                    {getOrderStatusText(order.status)}
                  </span>
                </div>

                {canCancelOrder(order.status) && (
                  <Button
                    variant="outline"
                    onClick={handleCancelOrder}
                    className="w-full rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Huỷ đơn hàng
                  </Button>
                )}
              </div>

              {/* Products */}
              <div className="bg-white rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Sản phẩm
                </h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 pb-4 border-b last:border-0"
                    >
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
                        <div className="flex items-center justify-between mt-2">
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
              </div>

              {/* Shipping Info */}
              <div className="bg-white rounded-2xl p-6">
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
                      {order.shippingDistrict &&
                        `, ${order.shippingDistrict}`}
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
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Payment Info */}
              <div className="bg-white rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Thanh toán
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phương thức:</span>
                    <span className="font-medium text-right">
                      {getPaymentMethodText(order.paymentMethod)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span
                      className={`font-medium ${
                        order.paymentStatus === "COMPLETED"
                          ? "text-green-600"
                          : order.paymentStatus === "FAILED"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {order.paymentStatus === "PENDING"
                        ? "Chờ thanh toán"
                        : order.paymentStatus === "COMPLETED"
                        ? "Đã thanh toán"
                        : order.paymentStatus === "FAILED"
                        ? "Thất bại"
                        : "Đã hoàn tiền"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Tóm tắt đơn hàng
                </h3>
                <div className="space-y-3">
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
                  <div className="flex justify-between text-lg font-bold pt-3 border-t">
                    <span>Tổng cộng</span>
                    <span className="text-[color:var(--color-brand)]">
                      {formatVND(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
