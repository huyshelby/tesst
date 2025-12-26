"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Award, ExternalLink, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/utils/currency";
import { getUserOrders, getOrderReceipt, type Order, type ReceiptResponse } from "@/lib/order-api";
import { useAuth } from "@/lib/auth-client";

interface OrderWithReceipt extends Order {
  receipt?: ReceiptResponse;
}

export default function NFTReceiptsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = React.useState<OrderWithReceipt[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/account/nft-receipts");
    }
  }, [user, authLoading, router]);

  React.useEffect(() => {
    if (!user) return;

    const fetchOrdersWithReceipts = async () => {
      try {
        // Fetch all COMPLETED orders
        const result = await getUserOrders({ limit: 100 });
        const completedOrders = result.orders.filter(
          (order) => order.paymentStatus === "COMPLETED"
        );

        // Fetch receipt for each order
        const ordersWithReceipts = await Promise.all(
          completedOrders.map(async (order) => {
            try {
              const receipt = await getOrderReceipt(order.id);
              return { ...order, receipt };
            } catch (error) {
              return { ...order, receipt: { exists: false } };
            }
          })
        );

        // Filter only orders with minted NFTs
        const mintedOrders = ordersWithReceipts.filter(
          (order) => order.receipt?.exists
        );

        setOrders(mintedOrders);
      } catch (err) {
        console.error("Failed to load NFT receipts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersWithReceipts();
  }, [user]);

  if (authLoading || loading) {
    return (
      <main className="bg-gray-50 min-h-screen py-12">
        <div className="content-container max-w-[1200px]">
          <div className="bg-white rounded-2xl p-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Đang tải NFT receipts...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="content-container max-w-[1200px]">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">NFT Receipts</h1>
              <p className="text-gray-600">Bộ sưu tập hoá đơn điện tử của bạn</p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Chưa có NFT Receipt
            </h2>
            <p className="text-gray-600 mb-6">
              Bạn chưa mint NFT receipt nào. Hãy hoàn thành đơn hàng và mint NFT để bắt đầu bộ sưu tập!
            </p>
            <Link href="/account/orders">
              <Button className="rounded-full bg-blue-600 hover:bg-blue-700">
                <Package className="w-4 h-4 mr-2" />
                Xem đơn hàng
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="group"
              >
                <div className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200">
                  {/* NFT Image */}
                  {order.receipt?.metadata?.image && (
                    <div className="relative w-full aspect-square mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      <Image
                        src={order.receipt.metadata.image.replace(
                          "ipfs://",
                          "https://ipfs.io/ipfs/"
                        )}
                        alt={`NFT Receipt #${order.receipt.tokenId}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  )}

                  {/* Token Info */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">Token ID</span>
                      <span className="text-sm font-mono font-bold text-blue-600">
                        #{order.receipt?.tokenId}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {order.orderNumber}
                    </p>
                  </div>

                  {/* Order Summary */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Tổng đơn</span>
                      <span className="font-semibold text-gray-900">
                        {formatVND(order.total)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Ngày mint</span>
                      <span className="text-gray-900">
                        {order.receipt?.mintedAt
                          ? new Date(order.receipt.mintedAt).toLocaleDateString(
                              "vi-VN",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )
                          : "-"}
                      </span>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (order.receipt?.txHash) {
                          window.open(
                            `https://bscscan.com/tx/${order.receipt.txHash}`,
                            "_blank"
                          );
                        }
                      }}
                      className="flex-1 text-xs text-blue-600 hover:text-blue-700 font-medium py-2 px-3 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-1"
                    >
                      BscScan
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (order.receipt?.tokenId) {
                          window.open(
                            `https://testnets.opensea.io/assets/bsc-testnet/${
                              process.env.NEXT_PUBLIC_NFT_RECEIPT_CONTRACT_ADDRESS
                            }/${order.receipt.tokenId}`,
                            "_blank"
                          );
                        }
                      }}
                      className="flex-1 text-xs text-blue-600 hover:text-blue-700 font-medium py-2 px-3 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-1"
                    >
                      OpenSea
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
