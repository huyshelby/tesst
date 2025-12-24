# 📘 HƯỚNG DẪN NFT RECEIPT CHO NGƯỜI DÙNG & QUẢN TRỊ VIÊN

> **Tài liệu UX/UI**: Giải thích cách người dùng và admin tương tác với tính năng NFT Receipt

---

## 🎯 MỤC LỤC

1. [Góc độ Khách hàng (User Flow)](#1-góc-độ-khách-hàng-user-flow)
2. [Góc độ Quản trị viên (Admin Flow)](#2-góc-độ-quản-trị-viên-admin-flow)
3. [Notification System](#3-notification-system)
4. [Dashboard & Analytics](#4-dashboard--analytics)
5. [Troubleshooting cho User](#5-troubleshooting-cho-user)

---

## 1. GÓC ĐỘ KHÁCH HÀNG (USER FLOW)

### 🛍️ Khi nào khách hàng biết đơn hàng có NFT Receipt?

#### **Timeline của NFT Receipt:**

```
Đặt hàng → Thanh toán → Xác nhận đơn → [NFT Available] → Mint NFT → NFT Owned
   ↓           ↓            ↓              ↓                ↓           ↓
PENDING    PENDING      CONFIRMED     COMPLETED          Minting    Minted
```

#### **A. TRƯỚC KHI THANH TOÁN** ❌ Không thể mint NFT

**Điều kiện**: `paymentStatus !== "COMPLETED"`

**UI Hiển thị**: 
- ⚠️ KHÔNG hiển thị NFT Receipt section
- Hoặc hiển thị message: _"NFT Receipt sẽ khả dụng sau khi thanh toán thành công"_

**Màn hình**:
```
┌─────────────────────────────────────────┐
│  Đơn hàng #ORD-20241224-ABC             │
│  Status: Chờ thanh toán                 │
│                                         │
│  ⚠️ NFT Receipt                         │
│  ┌───────────────────────────────────┐ │
│  │ Hoá đơn NFT sẽ khả dụng sau khi  │ │
│  │ thanh toán thành công.            │ │
│  │                                   │ │
│  │ [Button Disabled]                 │ │
│  │ 🔒 Mint NFT Receipt               │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

#### **B. SAU KHI THANH TOÁN THÀNH CÔNG** ✅ Có thể mint NFT

**Điều kiện**: `paymentStatus === "COMPLETED"`

**Vị trí hiển thị**:
1. **Trang Order Detail** (`/account/orders/[orderId]`)
2. **Email xác nhận đơn hàng** (nếu có tích hợp)
3. **Notification** (nếu có real-time notification)

**File code**: `phone-app/src/app/account/orders/[orderId]/page.tsx`

**UI State 1: Chưa mint** (Component `NFTReceipt.tsx`)

```tsx
// Hiển thị Card khi order.nftTokenId === null
┌───────────────────────────────────────────┐
│ 🎁 Digital Receipt (NFT)                  │
├───────────────────────────────────────────┤
│                                           │
│ Nhận NFT hoá đơn độc nhất được lưu trên   │
│ blockchain. NFT này:                       │
│                                           │
│ ✅ Chứng minh quyền sở hữu sản phẩm       │
│ ✅ Có thể dùng làm bảo hành điện tử       │
│ ✅ Xem được trên OpenSea & NFT marketplaces│
│ ✅ Là collectible item độc nhất của bạn   │
│                                           │
│ ┌───────────────────────────────────────┐ │
│ │   🔨 Mint NFT Receipt của bạn         │ │
│ └───────────────────────────────────────┘ │
│                                           │
│ ⚠️ Phí gas blockchain sẽ được tính        │
│    (khoảng 0.001 - 0.01 BNB)              │
└───────────────────────────────────────────┘
```

**Khi user click nút "Mint NFT Receipt":**

1. **Loading State**:
```tsx
┌───────────────────────────────────────────┐
│ ⏳ Đang mint NFT Receipt...               │
│                                           │
│ [Spinner Animation]                       │
│                                           │
│ Vui lòng đợi, giao dịch đang được        │
│ xử lý trên blockchain...                  │
└───────────────────────────────────────────┘
```

2. **API Call**:
```typescript
POST /api/orders/{orderId}/nft-receipt
Authorization: Bearer <jwt_token>

// Backend sẽ:
// - Tạo metadata JSON
// - Upload lên IPFS
// - Mint NFT trên smart contract
// - Lưu tokenId vào database
```

3. **Success Response**:
```json
{
  "success": true,
  "message": "NFT receipt minted successfully.",
  "data": {
    "tokenId": "123",
    "txHash": "0x1234567890abcdef...",
    "alreadyMinted": false
  }
}
```

---

**UI State 2: Đã mint** (sau khi mint thành công)

```tsx
┌───────────────────────────────────────────┐
│ 🎁 Digital Receipt (NFT)                  │
├───────────────────────────────────────────┤
│                                           │
│ Status: ✅ Minted                         │
│                                           │
│ ┌───────────────────────────────────────┐ │
│ │ Token ID:     #123                    │ │
│ │                                       │ │
│ │ Transaction:  View on BscScan 🔗      │ │
│ │                                       │ │
│ │ View on Market: OpenSea 🔗            │ │
│ └───────────────────────────────────────┘ │
│                                           │
│ [NFT Preview Image]                       │
│ ┌───────────────────────────────────────┐ │
│ │                                       │ │
│ │       [Order Receipt Image]           │ │
│ │          #ORD-20241224-ABC            │ │
│ │                                       │ │
│ └───────────────────────────────────────┘ │
└───────────────────────────────────────────┘
```

**Links được tạo tự động:**

```typescript
// 1. BscScan Transaction Link
https://bscscan.com/tx/0x1234567890abcdef...
// → User click để xem chi tiết transaction on-chain

// 2. OpenSea NFT Link
https://opensea.io/assets/bsc/0xContractAddress/123
// → User click để xem NFT trên marketplace
```

---

### 📧 Notification cho User

#### **Email Notification** (nếu tích hợp)

**Trigger**: Sau khi mint NFT thành công

**Template**:

```
Subject: 🎁 NFT Receipt của bạn đã được tạo - Đơn hàng #ORD-20241224-ABC

Xin chào Nguyễn Văn A,

Hoá đơn NFT cho đơn hàng #ORD-20241224-ABC của bạn đã được tạo thành công!

NFT Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Token ID: #123
Blockchain: Binance Smart Chain (BSC)
Contract: 0x1234567890abcdef...
Transaction: 0xabcdef1234567890...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bạn có thể:
• Xem trên BscScan: [Link]
• Xem trên OpenSea: [Link]
• Quản lý trong Account: [Link to Order Detail]

NFT này chứng minh quyền sở hữu hợp pháp sản phẩm của bạn và có thể dùng làm bảo hành điện tử.

Trân trọng,
E-Commerce Team
```

---

#### **In-App Notification** (nếu có WebSocket/Pusher)

**Toast Notification** khi mint xong:

```tsx
// Success Toast
┌─────────────────────────────────────┐
│ ✅ NFT Receipt đã được tạo!         │
│                                     │
│ Token ID: #123                      │
│ [Xem chi tiết] [Đóng]              │
└─────────────────────────────────────┘
```

---

### 📱 User Access Points

**Khách hàng có thể thấy NFT Receipt ở:**

#### 1. **Order Detail Page** (Chính)
```
URL: /account/orders/[orderId]
File: phone-app/src/app/account/orders/[orderId]/page.tsx
```

**Layout**:
```
┌─────────────────────────────────────────────────┐
│ ← Quay lại đơn hàng                             │
│                                                 │
│ Đơn hàng #ORD-20241224-ABC    [Status Badge]   │
├─────────────────────────┬───────────────────────┤
│ Main Content (2/3)      │ Sidebar (1/3)         │
│                         │                       │
│ 📦 Sản phẩm             │ 💳 Thanh toán         │
│ [Product List]          │ [Payment Info]        │
│                         │                       │
│ 📍 Thông tin giao hàng  │ 📊 Tóm tắt đơn hàng   │
│ [Shipping Address]      │ [Order Summary]       │
│                         │                       │
│ 🎁 Digital Receipt (NFT)│                       │
│ [NFT Card Component]    │                       │
└─────────────────────────┴───────────────────────┘
```

#### 2. **Order List Page** (Badge indicator)
```
URL: /account/orders
File: phone-app/src/app/account/orders/page.tsx
```

**Enhancement idea** (chưa implement):
```tsx
// Thêm NFT badge vào order card
<OrderCard>
  <OrderNumber>#ORD-20241224-ABC</OrderNumber>
  <Status>Đã giao</Status>
  {order.nftTokenId && (
    <Badge variant="success">
      ✅ NFT Receipt
    </Badge>
  )}
</OrderCard>
```

#### 3. **Profile/Dashboard** (Statistics - optional)
```
Số NFT Receipts đã sở hữu: 5
Tổng giá trị đơn hàng có NFT: 125,000,000 VND
```

---

### 🎯 User Journey Example

**Scenario: Anh Minh mua iPhone 15 Pro Max**

```
1️⃣ DAY 1 - 10:00 AM: Đặt hàng
   ✅ Tạo đơn hàng thành công
   ✅ Chọn thanh toán blockchain
   ❌ NFT chưa available (chưa thanh toán)

2️⃣ DAY 1 - 10:05 AM: Thanh toán
   ✅ Connect MetaMask
   ✅ Approve payment transaction
   ✅ Payment confirmed on blockchain
   ✅ Order status → COMPLETED
   ✨ NFT Receipt section xuất hiện!

3️⃣ DAY 1 - 10:10 AM: Mint NFT
   👆 Click "Mint NFT Receipt"
   ⏳ Loading... (30-60 seconds)
   ✅ NFT minted successfully
   📧 Nhận email notification
   
   UI hiển thị:
   - Token ID: #123
   - Transaction: 0xabcdef...
   - View on OpenSea link

4️⃣ DAY 1 - 10:15 AM: Xem NFT
   👆 Click "View on OpenSea"
   🌐 Mở OpenSea page
   👀 Thấy NFT Receipt với:
      - Image: Order receipt graphic
      - Attributes: Order number, amount, date
      - Properties: Customer info, items purchased

5️⃣ DAY 2: Nhận hàng
   📦 Sản phẩm được giao
   ✅ Có NFT làm chứng nhận
   💼 Có thể dùng NFT cho warranty claim

6️⃣ DAY 30: Bảo hành
   🔧 Sản phẩm có vấn đề
   📱 Show NFT cho service center
   ✅ Chứng minh mua hàng chính hãng
   ✅ Được bảo hành
```

---

## 2. GÓC ĐỘ QUẢN TRỊ VIÊN (ADMIN FLOW)

### 👨‍💼 Admin Dashboard - Quản lý NFT Receipts

#### **A. Order Detail Page (Admin)**

**File**: `admin-dashboard/src/app/(dashboard)/orders/[id]/page.tsx`

**Current State**: Chưa có NFT Receipt section

**Enhancement cần thêm**:

```tsx
// Thêm vào Order Detail Page
<div className="rounded-lg border bg-card p-6">
  <div className="flex items-center gap-2 mb-4">
    <Gift className="w-5 h-5 text-muted-foreground" />
    <h2 className="text-lg font-semibold">NFT Receipt</h2>
  </div>
  
  {order.nftTokenId ? (
    // NFT đã được mint
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Status:</span>
        <Badge variant="success">✅ Minted</Badge>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Token ID:</span>
        <span className="font-mono font-bold">#{order.nftTokenId}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Minted At:</span>
        <span>{formatDate(order.nftMintedAt)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Transaction:</span>
        <a 
          href={`https://bscscan.com/tx/${order.nftMintTxHash}`}
          target="_blank"
          className="text-blue-600 hover:underline flex items-center gap-1"
        >
          View on BscScan <ExternalLink className="w-3 h-3" />
        </a>
      </div>
      <Separator />
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          View Metadata
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          View on OpenSea
        </Button>
      </div>
    </div>
  ) : (
    // NFT chưa được mint
    <div className="text-center py-6">
      {order.paymentStatus === 'COMPLETED' ? (
        <>
          <p className="text-muted-foreground mb-4">
            NFT chưa được mint cho đơn hàng này.
          </p>
          <Button 
            onClick={handleAdminMintNFT}
            disabled={mintingNFT}
          >
            {mintingNFT ? 'Minting...' : 'Mint NFT cho khách hàng'}
          </Button>
        </>
      ) : (
        <p className="text-muted-foreground">
          NFT chỉ khả dụng khi đơn hàng đã thanh toán
        </p>
      )}
    </div>
  )}
</div>
```

---

#### **B. Orders List Page (Admin)**

**File**: `admin-dashboard/src/app/(dashboard)/orders/page.tsx`

**Enhancement: Thêm NFT column**

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Order Number</TableHead>
      <TableHead>Customer</TableHead>
      <TableHead>Total</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Payment</TableHead>
      <TableHead>NFT</TableHead>  {/* New column */}
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {orders.map((order) => (
      <TableRow key={order.id}>
        {/* ... existing columns ... */}
        
        {/* NFT Column */}
        <TableCell>
          {order.nftTokenId ? (
            <Badge variant="success">
              ✅ #{order.nftTokenId}
            </Badge>
          ) : order.paymentStatus === 'COMPLETED' ? (
            <Badge variant="secondary">
              ⏳ Not minted
            </Badge>
          ) : (
            <span className="text-muted-foreground text-xs">—</span>
          )}
        </TableCell>
        
        {/* ... actions ... */}
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

#### **C. NFT Analytics Dashboard** (New Page - Optional)

**Path**: `/admin/nft-analytics`

**Purpose**: Tổng quan về NFT Receipts trong hệ thống

```tsx
// admin-dashboard/src/app/(dashboard)/nft-analytics/page.tsx

export default function NFTAnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">NFT Receipt Analytics</h1>
      
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total NFTs Minted"
          value="1,234"
          change="+12.5%"
          icon={Gift}
        />
        <StatCard
          title="Mint Success Rate"
          value="98.5%"
          change="+2.1%"
          icon={CheckCircle}
        />
        <StatCard
          title="Avg Gas Cost"
          value="0.0035 BNB"
          change="-5.2%"
          icon={DollarSign}
        />
        <StatCard
          title="Total Value Secured"
          value="2.5B VND"
          change="+18.3%"
          icon={Shield}
        />
      </div>
      
      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>NFT Minting Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Line chart: NFTs minted over time */}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Mint Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Pie chart: Minted vs Not Minted vs Ineligible */}
          </CardContent>
        </Card>
      </div>
      
      {/* Recent NFT Mints Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent NFT Mints</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token ID</TableHead>
                <TableHead>Order Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Minted At</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* List of recent mints */}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

### 📊 Admin Monitoring Queries

#### **SQL Queries cho Dashboard**

```sql
-- 1. Total NFTs minted
SELECT COUNT(*) as total_minted
FROM "Order"
WHERE "nftTokenId" IS NOT NULL;

-- 2. Mint success rate
SELECT 
  ROUND(
    COUNT(*) FILTER (WHERE "nftTokenId" IS NOT NULL) * 100.0 / 
    NULLIF(COUNT(*) FILTER (WHERE "paymentStatus" = 'COMPLETED'), 0),
    2
  ) AS mint_rate_percent
FROM "Order";

-- 3. Orders eligible but not minted (follow-up opportunity)
SELECT 
  "id",
  "orderNumber",
  "customerName",
  "total",
  "createdAt"
FROM "Order"
WHERE "paymentStatus" = 'COMPLETED'
  AND "nftTokenId" IS NULL
ORDER BY "createdAt" DESC
LIMIT 50;

-- 4. Average time from payment to NFT mint
SELECT 
  AVG(EXTRACT(EPOCH FROM ("nftMintedAt" - "createdAt"))) / 60 AS avg_minutes
FROM "Order"
WHERE "nftMintedAt" IS NOT NULL;

-- 5. Top customers by NFT collection
SELECT 
  "userId",
  "customerName",
  COUNT(*) as nft_count,
  SUM("total") as total_value
FROM "Order"
WHERE "nftTokenId" IS NOT NULL
GROUP BY "userId", "customerName"
ORDER BY nft_count DESC
LIMIT 10;

-- 6. NFT minting trend by month
SELECT 
  DATE_TRUNC('month', "nftMintedAt") as month,
  COUNT(*) as mints_count
FROM "Order"
WHERE "nftMintedAt" IS NOT NULL
GROUP BY month
ORDER BY month DESC;
```

---

### 🛠️ Admin Actions

#### **1. Manual Mint NFT cho User**

**Scenario**: User báo lỗi không mint được NFT

**Admin Process**:

```typescript
// admin-dashboard/src/lib/admin-api.ts

export async function adminMintNFT(orderId: string) {
  // Admin gọi endpoint đặc biệt (cần ADMIN role)
  const response = await api.post(`/admin/orders/${orderId}/mint-nft`);
  return response.data;
}
```

**Backend endpoint**:

```typescript
// backend/src/routes/order.route.ts

router.post(
  "/admin/:orderId/mint-nft",
  requireAuth,
  requireRole("ADMIN"),
  OrderController.adminMintOrderReceipt
);

// backend/src/controllers/order.controller.ts

static async adminMintOrderReceipt(req: Request, res: Response) {
  const { orderId } = req.params;
  const adminId = req.user!.id;
  
  console.log(`[Admin] ${adminId} manually minting NFT for order ${orderId}`);
  
  const order = await OrderService.getOrderById(orderId);
  
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  
  // Admin có thể mint cho bất kỳ order nào (không check userId)
  const result = await OrderService.mintOrderReceipt(orderId, order.userId);
  
  res.status(201).json({
    success: true,
    message: "NFT minted by admin",
    data: result
  });
}
```

---

#### **2. View NFT Metadata**

```typescript
// Admin có thể xem metadata của NFT
export async function getNFTMetadata(orderId: string) {
  const response = await api.get(`/admin/orders/${orderId}/nft-metadata`);
  return response.data;
}

// Backend
static async getNFTMetadata(req: Request, res: Response) {
  const { orderId } = req.params;
  const nftService = getNFTReceiptService();
  const metadata = await nftService.getReceiptInfo(orderId);
  res.json(metadata);
}
```

---

#### **3. Bulk Operations**

```typescript
// Mint NFTs cho nhiều orders cùng lúc (batch job)
export async function bulkMintNFTs(orderIds: string[]) {
  const results = await Promise.allSettled(
    orderIds.map(id => adminMintNFT(id))
  );
  
  return {
    success: results.filter(r => r.status === 'fulfilled').length,
    failed: results.filter(r => r.status === 'rejected').length,
    details: results
  };
}
```

---

### 📈 Admin Reports

#### **Daily NFT Mint Report**

**Email gửi tới admin hàng ngày**:

```
Subject: 📊 NFT Receipt Daily Report - Dec 24, 2024

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 TODAY'S STATISTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NFTs Minted Today:       45
Orders Paid Today:       50
Mint Rate:               90%
Failed Mints:            2
Avg Mint Time:           45 seconds
Total Gas Cost:          0.157 BNB

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ ATTENTION REQUIRED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Eligible but Not Minted: 5 orders
- Order #ORD-20241224-001 (2 hours ago)
- Order #ORD-20241224-015 (4 hours ago)
...

Failed Mints: 2 orders
- Order #ORD-20241224-032 (Error: Gas too low)
- Order #ORD-20241224-040 (Error: IPFS timeout)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 CUMULATIVE STATS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total NFTs Minted:       1,234
Overall Mint Rate:       98.5%
Total Value Secured:     2.5B VND

[View Full Report] [Dashboard]
```

---

## 3. NOTIFICATION SYSTEM

### 🔔 Các loại Notifications

#### **A. User Notifications**

| Event | Channel | Content |
|-------|---------|---------|
| Order Paid | Email + In-app | "Đơn hàng đã thanh toán. NFT Receipt sẵn sàng để mint!" |
| NFT Minted | Email + In-app | "NFT Receipt #123 đã được tạo thành công" |
| Mint Failed | Email | "Lỗi khi tạo NFT. Team đang xử lý." |

#### **B. Admin Notifications**

| Event | Channel | Content |
|-------|---------|---------|
| Daily Report | Email | Statistics + Failed mints list |
| Mint Failure | Slack/Email | "Order #XXX failed to mint: [error]" |
| High Gas Alert | Slack | "Gas price above 50 gwei. Consider pausing mints." |

---

### 📧 Email Templates

#### **Template 1: NFT Available**

```html
<!DOCTYPE html>
<html>
<body>
  <h2>🎁 NFT Receipt sẵn sàng!</h2>
  
  <p>Xin chào {{customerName}},</p>
  
  <p>Đơn hàng <strong>{{orderNumber}}</strong> của bạn đã được thanh toán thành công!</p>
  
  <p>Bạn có thể mint NFT Receipt miễn phí (chỉ mất phí gas nhỏ):</p>
  
  <a href="{{orderDetailUrl}}" style="
    display: inline-block;
    padding: 12px 24px;
    background: #2563EB;
    color: white;
    text-decoration: none;
    border-radius: 8px;
  ">
    🔨 Mint NFT Receipt
  </a>
  
  <p style="margin-top: 20px; font-size: 12px; color: #666;">
    NFT Receipt là chứng nhận blockchain bất biến về giao dịch mua hàng của bạn.
  </p>
</body>
</html>
```

---

#### **Template 2: NFT Minted Successfully**

```html
<!DOCTYPE html>
<html>
<body>
  <h2>✅ NFT Receipt đã được tạo!</h2>
  
  <p>Xin chào {{customerName}},</p>
  
  <p>NFT Receipt cho đơn hàng <strong>{{orderNumber}}</strong> đã được mint thành công!</p>
  
  <div style="background: #F3F4F6; padding: 16px; border-radius: 8px; margin: 20px 0;">
    <strong>NFT Details:</strong><br/>
    Token ID: <code>#{{tokenId}}</code><br/>
    Blockchain: Binance Smart Chain<br/>
    Transaction: <a href="https://bscscan.com/tx/{{txHash}}">{{txHash}}</a>
  </div>
  
  <p>Bạn có thể:</p>
  <ul>
    <li>Xem trên <a href="{{openSeaUrl}}">OpenSea</a></li>
    <li>Xem trong <a href="{{orderDetailUrl}}">tài khoản của bạn</a></li>
    <li>Sử dụng làm chứng nhận bảo hành</li>
  </ul>
</body>
</html>
```

---

## 4. DASHBOARD & ANALYTICS

### 📊 Metrics để theo dõi

#### **User-facing Metrics**

```tsx
// Profile page: "My NFT Collection"
┌────────────────────────────────────┐
│ 🎁 NFT Receipt Collection          │
├────────────────────────────────────┤
│                                    │
│ Total NFTs:              5         │
│ Total Value:    125,000,000 VND    │
│                                    │
│ [View All NFTs]                    │
└────────────────────────────────────┘
```

#### **Admin-facing Metrics**

```sql
-- Dashboard KPIs
1. Total NFTs Minted: 1,234
2. Mint Success Rate: 98.5%
3. Avg Mint Time: 45 seconds
4. Total Gas Spent: 2.5 BNB
5. Total Value Secured: 2.5B VND
6. Pending Mints: 15 (eligible but not minted)
```

---

### 📈 Charts & Visualizations

#### **1. Mint Trend Over Time**
```
Line chart: NFTs minted per day/week/month
X-axis: Time
Y-axis: Number of NFTs
```

#### **2. Mint Status Pie Chart**
```
- Minted: 1,234 (85%)
- Eligible but not minted: 150 (10%)
- Not eligible (unpaid): 70 (5%)
```

#### **3. Gas Cost Trend**
```
Line chart: Average gas cost per mint over time
Helps admin decide when to pause/resume minting
```

#### **4. Top Collectors**
```
Bar chart: Users with most NFT receipts
```

---

## 5. TROUBLESHOOTING CHO USER

### ❓ FAQs - Người dùng thường hỏi

#### **Q1: Tại sao tôi không thấy nút Mint NFT?**

**A**: NFT Receipt chỉ khả dụng khi:
- ✅ Đơn hàng đã thanh toán thành công (`paymentStatus = COMPLETED`)
- ✅ Bạn đang xem đúng trang Order Detail
- ✅ Hệ thống NFT đang hoạt động (không maintenance)

**Kiểm tra**:
1. Vào trang `/account/orders/[orderId]`
2. Kiểm tra trạng thái thanh toán
3. Nếu đã thanh toán mà vẫn không thấy → Liên hệ support

---

#### **Q2: Mint NFT có mất phí không?**

**A**: 
- ❌ **Không mất phí từ website** (miễn phí mint)
- ✅ **Có phí gas blockchain** (do mạng blockchain tính)
  - Ước tính: 0.001 - 0.01 BNB (~$0.30 - $3 USD)
  - Phí thay đổi theo network congestion

---

#### **Q3: Tôi đã click Mint nhưng không thấy gì xảy ra?**

**Possible reasons**:

1. **Loading chậm**: Mint có thể mất 30-60 giây
   - **Solution**: Đợi thêm, không refresh page

2. **Gas quá thấp**: Transaction failed
   - **Solution**: Admin sẽ retry, hoặc liên hệ support

3. **Network error**: Timeout khi upload IPFS
   - **Solution**: Backend sẽ tự retry, hoặc admin mint manually

---

#### **Q4: Làm sao để xem NFT trên OpenSea?**

**Steps**:
1. Sau khi mint xong, click link **"View on OpenSea"**
2. Nếu chưa thấy NFT ngay → Đợi 5-10 phút (indexing time)
3. Có thể "Refresh Metadata" trên OpenSea để force update

---

#### **Q5: NFT có thể chuyển nhượng được không?**

**A**: 
- ✅ **Có**, NFT là ERC721 chuẩn, có thể transfer
- ⚠️ **Lưu ý**: Transfer NFT ≠ Transfer order ownership
  - NFT chỉ là "proof of purchase"
  - Không tự động chuyển quyền bảo hành (cần chính sách riêng)

---

#### **Q6: Tôi mất NFT thì sao?**

**A**: 
- NFT được lưu trên blockchain, không thể "mất"
- Nếu mất access wallet → Không thể transfer/sell NFT
- Order info vẫn còn trong hệ thống web2
- Có thể request admin "revoke & remint" (nếu chính sách cho phép)

---

### 🆘 Support Workflow

#### **User Report Issue → Admin Investigate**

```
1. User báo: "Không mint được NFT"
   ↓
2. Support check:
   - Order status? (COMPLETED?)
   - nftTokenId in DB? (null?)
   - Error logs?
   ↓
3. Admin actions:
   a) Nếu eligible → Manual mint từ admin dashboard
   b) Nếu có lỗi kỹ thuật → Escalate to dev team
   c) Nếu user issue → Hướng dẫn lại
   ↓
4. Follow-up với user
   - Email: "NFT đã được mint thành công"
   - Include: Token ID, links
```

---

## 🎯 CHECKLIST IMPLEMENTATION

### ✅ User Experience

- [ ] NFT section hiển thị sau khi payment COMPLETED
- [ ] Loading state khi minting
- [ ] Success state với token ID, links
- [ ] Error handling với message rõ ràng
- [ ] Email notification khi NFT minted
- [ ] Mobile-responsive UI
- [ ] Accessibility (screen readers, keyboard nav)

### ✅ Admin Experience

- [ ] NFT status hiển thị trong order detail
- [ ] NFT column trong orders list
- [ ] Manual mint capability
- [ ] View metadata function
- [ ] Analytics dashboard
- [ ] Daily report email
- [ ] Bulk operations support
- [ ] Error logs & monitoring

### ✅ Monitoring & Analytics

- [ ] Track mint success rate
- [ ] Monitor gas costs
- [ ] Alert on failures
- [ ] Dashboard metrics
- [ ] Export reports (CSV, PDF)
- [ ] Integration với Google Analytics

---

## 📚 TÀI LIỆU LIÊN QUAN

- [NFT_ORDER_RECEIPT_FEATURE.md](./NFT_ORDER_RECEIPT_FEATURE.md) - Technical documentation
- [BLOCKCHAIN_PAYMENT_FLOW.md](./BLOCKCHAIN_PAYMENT_FLOW.md) - Payment integration
- [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - System architecture

---

**Phiên bản**: v1.0  
**Cập nhật lần cuối**: 2024-12-24  
**Tác giả**: E-Commerce Team
