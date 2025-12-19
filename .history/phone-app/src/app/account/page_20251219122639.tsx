"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
  Package,
  CreditCard,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AppleHeader from "@/components/header/apple-header";
import Footer from "@/components/footer";
import { useAuth } from "@/lib/auth-client";
import { logout } from "@/lib/auth-client";

const menuItems = [
  {
    id: "orders",
    icon: Package,
    title: "Đơn hàng của tôi",
    description: "Theo dõi và quản lý đơn hàng",
    href: "/account/orders",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: "addresses",
    icon: MapPin,
    title: "Địa chỉ giao hàng",
    description: "Quản lý địa chỉ nhận hàng",
    href: "/account/addresses",
    color: "text-green-600",
    bgColor: "bg-green-50",
    badge: "Sắp có",
  },
  {
    id: "wishlist",
    icon: Heart,
    title: "Sản phẩm yêu thích",
    description: "Danh sách sản phẩm đã lưu",
    href: "/account/wishlist",
    color: "text-red-600",
    bgColor: "bg-red-50",
    badge: "Sắp có",
  },
  {
    id: "payment",
    icon: CreditCard,
    title: "Phương thức thanh toán",
    description: "Quản lý thẻ và tài khoản",
    href: "/account/payment",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    badge: "Sắp có",
  },
  {
    id: "notifications",
    icon: Bell,
    title: "Thông báo",
    description: "Cài đặt thông báo",
    href: "/account/notifications",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    badge: "Sắp có",
  },
  {
    id: "settings",
    icon: Settings,
    title: "Cài đặt tài khoản",
    description: "Thông tin cá nhân & bảo mật",
    href: "/account/settings",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    badge: "Sắp có",
  },
];

export default function AccountPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/account");
    }
  }, [user, authLoading, router]);

  const handleLogout = async () => {
    if (confirm("Bạn có chắc muốn đăng xuất?")) {
      try {
        await logout();
        router.push("/");
      } catch (err) {
        console.error("Logout error:", err);
      }
    }
  };

  if (authLoading) {
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

  if (!user) {
    return null; // Will redirect
  }

  return (
    <main className="bg-gray-50 min-h-screen py-8 md:py-12">
        <div className="content-container max-w-[1200px]">
          {/* User Profile Card */}
          <div className="bg-white rounded-2xl p-8 mb-6 shadow-sm">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-grow">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {user.name || "Người dùng"}
                </h1>
                <p className="text-gray-600 mb-4">{user.email}</p>
                <div className="flex flex-wrap gap-3">
                  <div className="px-4 py-2 bg-blue-50 rounded-full text-sm text-blue-700 font-medium">
                    {user.role === "ADMIN" ? "Quản trị viên" : "Khách hàng"}
                  </div>
                  <div className="px-4 py-2 bg-green-50 rounded-full text-sm text-green-700 font-medium">
                    ✓ Đã xác thực
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="rounded-full gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 text-center">
              <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Đơn hàng</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <ShoppingBag className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Đang giao</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Yêu thích</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <MapPin className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Địa chỉ</p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Quản lý tài khoản
              </h2>
            </div>
            <div className="divide-y">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-4 p-6 hover:bg-gray-50 transition group ${
                    item.badge ? "pointer-events-none opacity-60" : ""
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition`}
                  >
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.title}
                      </h3>
                      {item.badge && (
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  {!item.badge && (
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Support Section */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 mt-6 text-white">
            <h3 className="text-xl font-semibold mb-2">Cần hỗ trợ?</h3>
            <p className="text-blue-100 mb-6">
              Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn 24/7
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full"
              >
                Chat với chúng tôi
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full"
              >
                Gọi: 1900 1234
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full"
              >
                Email: support@phonestore.com
              </Button>
            </div>
          </div>
        </div>
      </main>
  );
}
