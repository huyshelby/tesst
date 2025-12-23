"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/utils/currency";
import {
  getUserOrders,
  getOrderStatusText,
  getOrderStatusColor,
  canCancelOrder,
  cancelOrder,
  type Order,
} from "@/lib/order-api";
import { useAuth } from "@/lib/auth-client";

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/account/orders");
    }
  }, [user, authLoading, router]);

  React.useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const data = await getUserOrders({ limit: 20 });
        setOrders(data.orders);
      } catch (err: any) {
        setError(err.message || "Không thể tải đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    // Fetch immediately
    fetchOrders();

    // Poll every 5 seconds to check for status updates
    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    // Cleanup
    return () => clearInterval(interval);
  }, [user]);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Bạn có chắc muốn huỷ đơn hàng này?")) return;

    try {
      await cancelOrder(orderId);
      // Refresh orders list
      const data = await getUserOrders({ limit: 20 });
      setOrders(data.orders);
    } catch (err: any) {
      alert(err.message || "Không thể huỷ đơn hàng");
    }
  };

  if (authLoading || loading) {
    return (
      <main className="bg-gray-50 min-h-screen py-12">
        <div className="content-container max-w-[1200px]">
          <div className="bg-white rounded-2xl p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--color-brand)] mx-auto"></div>
            <p className="text-gray-600 mt-4">Đang tải...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="content-container max-w-[1200px]">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
            Đơn hàng của tôi
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý và theo dõi đơn hàng của bạn
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Chưa có đơn hàng nào
            </h2>
            <p className="text-gray-600 mb-6">
              Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!
            </p>
            <Link href="/">
              <Button size="lg" className="rounded-full">
                Khám phá sản phẩm
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Đơn hàng #{order.orderNumber}
                      </h3>
                      <span
                        className={`text-xs px-3 py-1 rounded-full border font-medium ${getOrderStatusColor(
                          order.status
                        )}`}
                      >
                        {getOrderStatusText(order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Đặt ngày{" "}
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Tổng tiền</p>
                    <p className="text-xl font-bold text-[color:var(--color-brand)]">
                      {formatVND(order.total)}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">
                      {order.items.length} sản phẩm
                    </p>
                    {order.paymentMethod === "CRYPTO" && (
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                        🔗 Blockchain
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {order.items.slice(0, 2).map((item) => (
                      <p key={item.id} className="text-sm text-gray-900">
                        • {item.product.name} x{item.quantity}
                      </p>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm text-gray-600">
                        và {order.items.length - 2} sản phẩm khác...
                      </p>
                    )}
                  </div>
                  {order.paymentStatus === "PENDING" && order.paymentMethod === "CRYPTO" && (
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-yellow-700">
                        ⏳ Đang chờ xác nhận blockchain...
                      </p>
                    </div>
                  )}
                  {order.paymentStatus === "COMPLETED" && (
                    <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs text-green-700">
                        ✓ Đã thanh toán
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      className="w-full rounded-full"
                    >
                      Xem chi tiết
                    </Button>
                  </Link>
                  {canCancelOrder(order.status) && (
                    <Button
                      variant="outline"
                      onClick={() => handleCancelOrder(order.id)}
                      className="rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Huỷ đơn
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
