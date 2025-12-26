"use client";


























































































































































































































































































































































**Version:** 1.0**Ngày cập nhật:** 24/12/2024  **Tác giả:** Phone App Team  ---- **Backend:** [backend/src/controllers/order.controller.ts](backend/src/controllers/order.controller.ts)- **API:** [phone-app/src/lib/order-api.ts](phone-app/src/lib/order-api.ts)- **Order Detail:** [phone-app/src/app/account/orders/[orderId]/page.tsx](phone-app/src/app/account/orders/[orderId]/page.tsx)- **Gallery Page:** [phone-app/src/app/account/nft-receipts/page.tsx](phone-app/src/app/account/nft-receipts/page.tsx)- **Component:** [phone-app/src/components/order/NFTReceipt.tsx](phone-app/src/components/order/NFTReceipt.tsx)## 🔗 Related Files---- ✅ **Xem công khai:** Hiển thị trên OpenSea và các NFT marketplace- ✅ **Sưu tầm:** NFT độc nhất, có thể chuyển nhượng- ✅ **Bảo hành điện tử:** Sử dụng thay cho giấy bảo hành truyền thống- ✅ **Chứng nhận blockchain:** Bằng chứng bất biến về giao dịch### Lợi ích của NFT Receipt4. **Click vào NFT:** Để xem chi tiết đơn hàng tương ứng3. **Xem gallery:** Tất cả NFT receipts hiển thị dưới dạng grid2. **Click "NFT Receipts":** Trong menu account1. **Vào trang Account:** `/account`### Cách xem bộ sưu tập NFT5. **Xem NFT:** Sau khi mint thành công, bạn sẽ thấy Token ID và links để xem trên BscScan/OpenSea4. **Chờ xác nhận:** Blockchain sẽ xử lý transaction (khoảng 10-30 giây)3. **Click "Mint NFT Receipt":** Ở cuối trang, click nút mint NFT2. **Vào Order Detail:** Từ trang "Đơn hàng của tôi", click vào đơn hàng đã thanh toán1. **Hoàn thành đơn hàng:** Thanh toán thành công để đơn hàng chuyển sang trạng thái "Đã thanh toán"### Cách mint NFT Receipt## 📖 User Guide (cho khách hàng)---```}  "react": "^18.x.x"         // React  "next": "^15.x.x",         // Framework  "lucide-react": "^0.x.x",  // Icons{```json### Dependencies```NEXT_PUBLIC_CHAIN_ID=...                       # Chain ID (31337 local, 97 BSC testnet)NEXT_PUBLIC_BLOCKCHAIN_RPC_URL=...             # Blockchain RPC URLNEXT_PUBLIC_NFT_RECEIPT_CONTRACT_ADDRESS=0x... # NFT contract address```envCần cấu hình trong `.env.local`:### Environment Variables## 🚀 Deployment Notes---- [ ] **Double mint prevention:** Không thể mint 2 lần cho cùng 1 order- [ ] **Payment status:** Không thể mint NFT cho đơn hàng chưa thanh toán- [ ] **Ownership check:** User không thể mint/xem NFT của người khác### Security Testing- [ ] **Error handling:** Hiển thị error message khi API fail- [ ] **Image loading:** NFT image từ IPFS load đúng (fallback nếu lỗi)- [ ] **Gallery refresh:** Sau khi mint NFT mới, gallery page cập nhật danh sách- [ ] **Load receipt:** Auto-load receipt data khi vào order detail page- [ ] **Mint NFT:** Click mint button → API call → Success → Auto refresh → Hiển thị minted state### Functional Testing- [ ] **External links:** BscScan và OpenSea links mở đúng tab mới- [ ] **Mobile responsiveness:** Tất cả pages responsive trên mobile- [ ] **NFT Receipts Gallery - Has NFTs:** Grid layout responsive, cards clickable- [ ] **NFT Receipts Gallery - Empty:** Hiển thị empty state với link "Xem đơn hàng"- [ ] **Order Detail Page - Đã mint:** Hiển thị NFT info với links- [ ] **Order Detail Page - Đã thanh toán + chưa mint:** Hiển thị mint button- [ ] **Order Detail Page - Chưa thanh toán:** NFT section KHÔNG hiển thị### UI/UX Testing## ✅ Testing Checklist---- Service layer kiểm tra `paymentStatus === "COMPLETED"` trước khi mint- `OrderController.getOrderReceipt()`: Kiểm tra ownership- `OrderController.mintOrderReceipt()`: Kiểm tra ownership**Backend validation:**- User chỉ có thể mint/xem NFT của đơn hàng thuộc về mình- Chỉ hiển thị NFT receipt section khi `paymentStatus === "COMPLETED"`- User phải đăng nhập (`requireAuth` middleware)**Yêu cầu:**## 🔐 Access Control---- Image aspect ratio: `aspect-square`- Grid gap: `gap-6`- Border radius: `rounded-2xl`- Card padding: `p-6`### Spacing & Layout- Success: `CheckCircle2` (lucide-react)- Loading: `Loader2` (lucide-react)- External Links: `ExternalLink` (lucide-react)- NFT Feature: `Award` (lucide-react)### Icons- Border: `border-green-100`- Badge: `bg-green-600 text-white`- Background: `bg-green-50 to-emerald-50`**Minted Status:**- Border: `border-blue-100`- Text: `text-white`- Background: `bg-blue-600 hover:bg-blue-700`**Mint Button (chưa mint):**### Colors## 🎨 Design System---```}  mintedAt?: string;  metadata?: NFTMetadata;  metadataUrl?: string;  txHash?: string;  tokenId?: string;  exists: boolean;export interface ReceiptResponse {}  }>;    value: string | number;    trait_type: string;  attributes: Array<{  image: string;  description: string;  name: string;export interface NFTMetadata {```typescript### Types```export function getOpenSeaUrl(contractAddress: string, tokenId: string, network: 'bsc' | 'eth'): string// Helper: Get OpenSea NFT URLexport function getTransactionUrl(txHash: string, network: 'bsc' | 'eth'): string// Helper: Get blockchain explorer URLexport async function getOrderReceipt(orderId: string): Promise<ReceiptResponse>// Get NFT receipt infoexport async function mintOrderReceipt(orderId: string): Promise<ReceiptResponse>// Mint NFT receipt```typescriptTrong `phone-app/src/lib/order-api.ts`:### API Functions   - Displays in responsive grid layout   - Filters only orders with minted NFTs   - Loads receipt for each order   - Fetches all COMPLETED orders2. **NFT Receipts Gallery Page** ([phone-app/src/app/account/nft-receipts/page.tsx](phone-app/src/app/account/nft-receipts/page.tsx))   - Auto-loads receipt data if not provided   - Handles display of mint button or minted NFT info   - Props: `{ orderId, initialReceipt?, onMint, isMinting }`1. **`NFTReceipt.tsx`** ([phone-app/src/components/order/NFTReceipt.tsx](phone-app/src/components/order/NFTReceipt.tsx))### Components## 🔧 Technical Implementation---```}  href: "/account/nft-receipts",  description: "Bộ sưu tập hoá đơn điện tử",  title: "NFT Receipts",  icon: Award,  id: "nft-receipts",{```tsxMenu item mới trong `/account`:### Thêm vào Account Dashboard## 🗂️ Navigation---```└─────────────────────────────────────────────────────────┘│      [ 📦 Xem đơn hàng ]                                ││                                                         ││ và mint NFT để bắt đầu bộ sưu tập!                      ││ Bạn chưa mint NFT receipt nào. Hãy hoàn thành đơn hàng  ││                                                         ││           Chưa có NFT Receipt                           ││                                                         ││                    🏆                                   │┌─────────────────────────────────────────────────────────┐```tsx**Empty State:**```└───────────────┘  └───────────────┘  └───────────────┘│ BscScan | OS  │  │ BscScan | OS  │  │ BscScan | OS  │├───────────────┤  ├───────────────┤  ├───────────────┤│ 24/12/2024    │  │ 23/12/2024    │  │ 22/12/2024    ││ 25.000.000đ   │  │ 30.000.000đ   │  │ 15.000.000đ   ││ ORD-20241224  │  │ ORD-20241223  │  │ ORD-20241222  ││ Token ID: #12 │  │ Token ID: #34 │  │ Token ID: #56 │├───────────────┤  ├───────────────┤  ├───────────────┤│               │  │               │  │               ││ [NFT Image]   │  │ [NFT Image]   │  │ [NFT Image]   ││               │  │               │  │               │┌───────────────┐  ┌───────────────┐  ┌───────────────┐Grid Gallery (3 columns trên desktop, 1 column trên mobile):└─────────────────────────────────────────────────────────┘│    Bộ sưu tập hoá đơn điện tử của bạn                   ││ 🏆 NFT Receipts                                         │┌─────────────────────────────────────────────────────────┐```tsx**UI Layout:**- Link trực tiếp đến BscScan và OpenSea- Click vào card để xem chi tiết đơn hàng- Mỗi card hiển thị: NFT image, Token ID, Order Number, Tổng đơn, Ngày mint- Hiển thị tất cả NFT receipts của user dưới dạng grid gallery**Chức năng chính:**### 2. Trang NFT Receipts Gallery (`/account/nft-receipts`)---```└─────────────────────────────────────────────────────────┘│ └───────────────────────────────────────────────────┘   ││ │                                                   │   ││ │         [NFT Receipt Image]                       │   ││ │                                                   │   ││ ┌───────────────────────────────────────────────────┐   ││ Preview NFT                                            ││                                                         ││ └───────────────────────────────────────────────────┘   ││ │ Xem trên OpenSea →                                │   ││ ┌───────────────────────────────────────────────────┐   ││                                                         ││ └───────────────────────────────────────────────────┘   ││ │ Xem trên BscScan →                                │   ││ ┌───────────────────────────────────────────────────┐   ││                                                         ││ Token ID: #12345                                        ││                                                         │├─────────────────────────────────────────────────────────┤│ [✓ Đã Mint]                                            ││ 🏆 Digital Receipt (NFT)                                │┌─────────────────────────────────────────────────────────┐```tsx#### **State 2: Đã mint NFT** (order.nftTokenId !== null)- Sau khi mint thành công, tự động refresh và hiển thị state 2- Call API `POST /api/orders/:orderId/nft-receipt`- Loading state với spinner animation**Khi click "Mint NFT Receipt":**```└─────────────────────────────────────────────────────────┘│ ⚠️ Phí gas blockchain sẽ được tính (0.001 - 0.01 BNB)  ││                                                         ││ └─────────────────────────────────────────────────────┘ ││ │ 🏆 Mint NFT Receipt của bạn                         │ ││ ┌─────────────────────────────────────────────────────┐ ││                                                         ││    Hiển thị trên các NFT marketplace                    ││ ✅ Xem trên OpenSea                                     ││                                                         ││    Sử dụng NFT làm bảo hành sản phẩm                    ││ ✅ Bảo hành điện tử                                     ││                                                         ││    Bằng chứng hợp pháp về giao dịch mua hàng            ││ ✅ Chứng minh quyền sở hữu                              ││                                                         │├─────────────────────────────────────────────────────────┤│ Hoá đơn điện tử trên Blockchain                         ││ 🏆 Digital Receipt (NFT)                                │┌─────────────────────────────────────────────────────────┐```tsx#### **State 1: Chưa mint NFT** (order.nftTokenId === null)**UI States:**- Hiển thị thông tin NFT nếu đã mint (Token ID, transaction hash, links)- Cho phép mint NFT receipt nếu chưa mint- Hiển thị NFT Receipt section khi đơn hàng đã thanh toán thành công (`paymentStatus === "COMPLETED"`)**Chức năng chính:**### 1. Trang Order Detail (`/account/orders/[orderId]`)## 🎯 Các trang liên quan---- ✅ Sử dụng NFT làm chứng nhận quyền sở hữu và bảo hành- ✅ Truy cập NFT trên blockchain explorer (BscScan, OpenSea)- ✅ Xem bộ sưu tập NFT receipts của mình- ✅ Mint hoá đơn điện tử dạng NFT sau khi thanh toán thành côngTính năng **NFT Receipt** cho phép người dùng:## 📋 Tổng quan---> **Tài liệu UX**: Hướng dẫn người dùng xem và quản lý NFT Receipt trên phone-appimport * as React from "react";
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
  Award,
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
    id: "nft-receipts",
    icon: Award,
    title: "NFT Receipts",
    description: "Bộ sưu tập hoá đơn điện tử",
    href: "/account/nft-receipts",
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
