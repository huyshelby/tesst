"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  MapPin,
  Heart,
  Settings,
  LogOut,
  Package,
  CreditCard,
  Bell,
  Phone,
  Mail,
  MessageCircle,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { getUserOrders } from "@/lib/order-api";
import { AvatarUpload } from "@/components/account/avatar-upload";
import { AccountSkeleton } from "@/components/account/account-skeleton";
import { StatCard } from "@/components/account/stat-card";
import { EmptyState } from "@/components/account/empty-state";

// Menu configuration with Apple-like minimal design
const menuItems = [
  {
    id: "orders",
    icon: Package,
    title: "Đơn hàng của tôi",
    description: "Theo dõi và quản lý đơn hàng",
    href: "/account/orders",
  },
  {
    id: "addresses",
    icon: MapPin,
    title: "Địa chỉ giao hàng",
    description: "Quản lý địa chỉ nhận hàng",
    href: "/account/addresses",
    badge: "Sắp có",
    disabled: true,
  },
  {
    id: "wishlist",
    icon: Heart,
    title: "Sản phẩm yêu thích",
    description: "Danh sách sản phẩm đã lưu",
    href: "/account/wishlist",
    badge: "Sắp có",
    disabled: true,
  },
  {
    id: "payment",
    icon: CreditCard,
    title: "Phương thức thanh toán",
    description: "Quản lý thẻ và tài khoản",
    href: "/account/payment",
    badge: "Sắp có",
    disabled: true,
  },
  {
    id: "notifications",
    icon: Bell,
    title: "Thông báo",
    description: "Cài đặt thông báo và ưu đãi",
    href: "/account/notifications",
    badge: "Sắp có",
    disabled: true,
  },
  {
    id: "settings",
    icon: Settings,
    title: "Cài đặt tài khoản",
    description: "Thông tin cá nhân & bảo mật",
    href: "/account/settings",
    badge: "Sắp có",
    disabled: true,
  },
];

export default function AccountPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [uploading, setUploading] = React.useState(false);

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

  const handleAvatarUpload = async (file: File) => {
    setUploading(true);
    try {
      // TODO: Implement avatar upload API
      const formData = new FormData();
      formData.append("avatar", file);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log("Avatar upload:", file.name);
      // await uploadAvatar(formData);
    } catch (error) {
      console.error("Avatar upload failed:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  // Stats state – will be hydrated from API without blocking initial render
  const [stats, setStats] = React.useState({
    orders: 0,
    shipping: 0,
    wishlist: 0,
    addresses: 0,
  });

  // Fetch stats after mount (avoid SSR randomness, prevent hydration issues)
  React.useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const [allRes, shipRes] = await Promise.all([
          getUserOrders({ page: 1, limit: 1 }),
          getUserOrders({ status: "SHIPPING", page: 1, limit: 1 }),
        ]);

        const addressesCount = user.defaultAddress ? 1 : 0;
        const nextStats = {
          orders: allRes?.pagination?.total || 0,
          shipping: shipRes?.pagination?.total || 0,
          wishlist: 0, // no API yet
          addresses: addressesCount,
        };
        if (!cancelled) setStats(nextStats);
      } catch (e) {
        console.error("Load stats failed", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (authLoading) {
    return <AccountSkeleton />;
  }

  if (!user) {
    return null; // Will redirect
  }

  const userName = user.name || (user.email ? user.email.split("@")[0] : "") || "Người dùng";
  const userRole = user.role === "ADMIN" ? "Quản trị viên" : "Khách hàng";

  return (
    <main className="min-h-screen bg-[#F5F5F7] py-8 md:py-12">
      <div className="content-container max-w-[1200px]">
        {/* ===== USER PROFILE HEADER ===== */}
        <section className="bg-white rounded-2xl p-8 md:p-10 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Avatar with Upload */}
            <AvatarUpload
              user={user}
              onUpload={handleAvatarUpload}
              className="mx-auto md:mx-0"
            />

            {/* User Info */}
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-semibold text-[#1C1C1E] mb-2 tracking-tight">
                {userName}
              </h1>

              {/* Email (masked) */}
              <div className="space-y-1 mb-5">
                {user.email ? (
                  <p className="text-[15px] text-gray-500">
                    {maskEmail(user.email)}
                  </p>
                ) : null}
                {user.phone ? (
                  <p className="text-[15px] text-gray-500">
                    {maskPhone(user.phone)}
                  </p>
                ) : null}
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full text-sm text-gray-700 font-medium border border-gray-200">
                  <ShieldCheck className="w-4 h-4" strokeWidth={2} />
                  <span>{userRole}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-full text-sm text-green-700 font-medium border border-green-200">
                  <CheckCircle className="w-4 h-4" strokeWidth={2} />
                  <span>Đã xác thực</span>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <Button
              variant="outline"
              onClick={handleLogout}
              className="rounded-full border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 mx-auto md:mx-0"
            >
              <LogOut className="w-4 h-4 mr-2" strokeWidth={2} />
              Đăng xuất
            </Button>
          </div>
        </section>

        {/* ===== DEFAULT SHIPPING ADDRESS ===== */}
        <section className="bg-white rounded-2xl overflow-hidden shadow-sm mb-6">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-[#1C1C1E] tracking-tight">
              Địa chỉ giao hàng mặc định
            </h2>
          </div>
          {user.defaultAddress ? (
            <div className="px-6 py-5">
              <div className="space-y-1 text-[15px] text-gray-700">
                {user.defaultAddress.recipient ? (
                  <p className="font-medium text-gray-900">{user.defaultAddress.recipient}</p>
                ) : null}
                {user.defaultAddress.phone ? (
                  <p>{maskPhone(user.defaultAddress.phone)}</p>
                ) : null}
                <p>
                  {[user.defaultAddress.line1, user.defaultAddress.ward, user.defaultAddress.district, user.defaultAddress.province]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={MapPin}
              title="Chưa có địa chỉ giao hàng"
              description="Thêm địa chỉ mặc định để thanh toán và giao hàng nhanh hơn."
              actionLabel="Thêm địa chỉ"
              actionHref="/account/addresses/new"
            />
          )}
        </section>


        {/* ===== QUICK STATS ===== */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Package}
            label="Đơn hàng"
            value={stats.orders}
            href="/account/orders"
            emptyMessage="Bạn chưa có đơn hàng nào"
            emptyCtaLabel="Mua sắm ngay"
            emptyCtaHref="/phone"
            color="text-[#1C1C1E]"
          />
          <StatCard
            icon={ShoppingBag}
            label="Đang giao"
            value={stats.shipping}
            href="/account/orders?status=shipping"
            emptyMessage="Không có đơn đang giao"
            emptyCtaLabel="Theo dõi đơn hàng"
            emptyCtaHref="/account/orders?status=shipping"
            color="text-[#1C1C1E]"
          />
          <StatCard
            icon={Heart}
            label="Yêu thích"
            value={stats.wishlist}
            href="/account/wishlist"
            emptyMessage="Danh sách yêu thích trống"
            emptyCtaLabel="Khám phá sản phẩm"
            emptyCtaHref="/phone"
            color="text-[#1C1C1E]"
          />
          <StatCard
            icon={MapPin}
            label="Địa chỉ"
            value={stats.addresses}
            href="/account/addresses"
            emptyMessage="Thêm địa chỉ"
            emptyCtaLabel="Thêm địa chỉ"
            emptyCtaHref="/account/addresses/new"
            color="text-[#1C1C1E]"
          />
        </section>



        {/* ===== CUSTOMER SUPPORT ===== */}
        <section className="bg-gradient-to-r from-[#1C1C1E] to-[#2C2C2E] rounded-2xl p-8 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold text-white mb-2">
                Cần hỗ trợ?
              </h3>
              <p className="text-gray-300 text-[15px] max-w-md">
                Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn 24/7
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center md:justify-end">
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 rounded-full backdrop-blur-sm transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4 mr-2" strokeWidth={2} />
                Chat ngay
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 rounded-full backdrop-blur-sm transition-all duration-200"
              >
                <Phone className="w-4 h-4 mr-2" strokeWidth={2} />
                1900 1234
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 rounded-full backdrop-blur-sm transition-all duration-200 hidden md:inline-flex"
              >
                <Mail className="w-4 h-4 mr-2" strokeWidth={2} />
                Email
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

// ===== UTILITY FUNCTIONS =====
/**
 * Mask phone for privacy: keep 2 đầu + 2 cuối, thay giữa bằng *
 * Ví dụ: 0912345678 -> 09******78
 */
function maskPhone(phone: string): string {
  const cleaned = (phone || "").replace(/\D/g, "");
  if (cleaned.length <= 4) return cleaned;
  const first = cleaned.slice(0, 2);
  const last = cleaned.slice(-2);
  return `${first}${"*".repeat(Math.max(0, cleaned.length - 4))}${last}`;
}


/**
 * Mask email for privacy
 * Example: john.doe@example.com → jo****@example.com
 */
function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;

  if (local.length <= 2) {
    return `${local}***@${domain}`;
  }

  const visibleChars = 2;
  const masked = local.slice(0, visibleChars) + "****";
  return `${masked}@${domain}`;
}
