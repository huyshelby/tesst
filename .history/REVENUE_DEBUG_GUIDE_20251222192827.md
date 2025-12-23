# Revenue Dashboard Bug Fix Guide

## 🐛 Vấn đề: Không hiển thị dữ liệu doanh thu

### Triệu chứng
- Admin dashboard không hiển thị doanh thu (revenue = 0đ)
- Revenue chart trống (empty array)
- Stat cards hiển thị "0đ" hoặc loading mãi

### Nguyên nhân chính

#### 1. **Không có đơn hàng DELIVERED trong database** ⚠️ MOST COMMON

Backend chỉ tính doanh thu từ đơn hàng có `status = "DELIVERED"`:

```typescript
// backend/src/controllers/dashboard.controller.ts
const currentRevenue = await prisma.order.aggregate({
  where: {
    createdAt: { gte: thirtyDaysAgo },
    status: "DELIVERED",  // ⚠️ Chỉ đơn đã giao mới tính revenue
  },
  _sum: { total: true, subtotal: true, ... }
})
```

**Kiểm tra:**
```bash
cd backend
npm run debug-revenue
```

**Kết quả mong đợi:**
```
✅ DELIVERED Orders (last 30 days): 15
💰 Total Revenue (30 days): 45,000,000đ
```

**Nếu thấy:**
```
⚠️ NO DELIVERED ORDERS IN LAST 30 DAYS!
```

→ **Đây là nguyên nhân!**

#### 2. **Đơn hàng quá cũ (> 30 ngày)**

Dashboard chỉ hiển thị doanh thu trong **30 ngày gần nhất**.

**Kiểm tra:**
```bash
npm run debug-revenue
```

Output sẽ hiển thị date range:
```
📆 Date Range:
  - Oldest: 15/10/2025 (DELIVERED)
  - Newest: 20/12/2025 (PENDING)
```

Nếu newest order < 30 days ago → Revenue = 0

#### 3. **Backend API lỗi**

**Kiểm tra:**
```bash
# Test backend API directly
curl http://localhost:4000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected response:**
```json
{
  "revenue": {
    "total": 15000000,
    "change": 25.5,
    "trend": "up"
  },
  ...
}
```

#### 4. **Frontend không gọi được API**

**Kiểm tra:** Browser DevTools → Network tab

- API call `/dashboard/stats` có status 200?
- Response có data?
- CORS error?
- 401 Unauthorized?

#### 5. **Authentication issue**

Admin chưa login hoặc token expired.

**Kiểm tra:**
```typescript
// admin-dashboard/src/hooks/use-dashboard.ts
export function useDashboardStats() {
  const { isAdmin } = useAuth()
  return useQuery({
    enabled: !!isAdmin, // ⚠️ Chỉ fetch khi isAdmin = true
    ...
  })
}
```

---

## 🔧 Solutions

### Solution 1: Tạo đơn hàng DELIVERED (Development)

#### Option A: Update existing orders
```bash
# Open Prisma Studio
cd backend
npx prisma studio
```

1. Vào table `Order`
2. Chọn orders có `paymentStatus = "COMPLETED"`
3. Đổi `status` → `DELIVERED`
4. Save

#### Option B: Seed database
```bash
cd backend
npm run seed
```

Seed script sẽ tạo orders với nhiều status khác nhau.

#### Option C: Manual SQL
```sql
-- Update 10 đơn gần nhất thành DELIVERED
UPDATE "Order"
SET status = 'DELIVERED'
WHERE id IN (
  SELECT id FROM "Order"
  ORDER BY "createdAt" DESC
  LIMIT 10
);
```

### Solution 2: Thay đổi logic tính revenue (Production)

Nếu muốn tính revenue cho **tất cả đơn đã thanh toán** (không chỉ DELIVERED):

```typescript
// backend/src/controllers/dashboard.controller.ts
const currentRevenue = await prisma.order.aggregate({
  where: {
    createdAt: { gte: thirtyDaysAgo },
    // Đổi từ status: "DELIVERED" thành:
    paymentStatus: "COMPLETED", // ✅ Tính tất cả đơn đã thanh toán
  },
  _sum: { total: true, ... }
})
```

**⚠️ Trade-off:**
- ✅ Revenue hiển thị sớm hơn (ngay khi thanh toán)
- ❌ Có thể tính revenue cho đơn bị hủy sau

### Solution 3: Thêm filter options (Best for Production)

Cho phép admin chọn filter:

```typescript
// Add to API
GET /api/dashboard/stats?status=DELIVERED
GET /api/dashboard/stats?status=COMPLETED  // All paid orders
GET /api/dashboard/stats?status=ALL        // All orders
```

---

## 🧪 Testing Steps

### 1. Run Debug Script
```bash
cd backend
npm run debug-revenue
```

**Check output:**
- DELIVERED orders count > 0?
- Total revenue > 0?
- Date range trong 30 ngày?

### 2. Test Backend API

**File:** `backend/test-revenue-debug.http`

1. Login as admin (get token)
2. Test `/dashboard/stats` endpoint
3. Verify response có `revenue.total > 0`

### 3. Test Frontend

1. Khởi động backend: `npm run dev` (in `backend/`)
2. Khởi động admin-dashboard: `npm run dev` (in `admin-dashboard/`)
3. Login as admin: `admin@example.com` / `admin123`
4. Mở Dashboard page
5. Kiểm tra:
   - [ ] Revenue card hiển thị số tiền
   - [ ] Revenue chart có data
   - [ ] Không có error trong console

### 4. Check Browser Console

Mở DevTools → Console, check for:

```javascript
// ✅ Good
GET /api/dashboard/stats 200 OK
Response: { revenue: { total: 15000000 }, ... }

// ❌ Bad
GET /api/dashboard/stats 401 Unauthorized
Error: Token expired

// ❌ Bad
CORS error: Access-Control-Allow-Origin
```

---

## 📊 Expected Behavior

### Backend Response
```json
{
  "revenue": {
    "total": 15500000,        // ✅ > 0
    "subtotal": 15000000,
    "shippingFee": 500000,
    "discount": 0,
    "change": 25.5,           // % thay đổi vs 30 ngày trước
    "trend": "up"             // up/down/neutral
  },
  "orders": {
    "total": 45,
    "pending": 5,
    "processing": 10,
    "delivered": 25,          // ✅ > 0
    "cancelled": 5,
    "change": 15.2
  },
  ...
}
```

### Frontend Display
```
┌─────────────────────────────────┐
│ Doanh thu (30 ngày)             │
│ 15.5tr đ           ↗ +25.5%    │
└─────────────────────────────────┘
```

---

## 🔍 Debug Checklist

Trước khi hỏi, check các điều sau:

- [ ] Backend server đang chạy? (`npm run dev` in `backend/`)
- [ ] Database có orders? (`npx prisma studio`)
- [ ] Orders có status DELIVERED? (run `npm run debug-revenue`)
- [ ] Orders trong 30 ngày gần nhất?
- [ ] Admin đã login? (check localStorage `auth_token`)
- [ ] API call thành công? (Network tab → status 200)
- [ ] Response có data? (không phải `{ revenue: { total: 0 } }`)
- [ ] CORS configured? (`backend/src/app.ts` → origin includes admin URL)
- [ ] Env variables set? (`NEXT_PUBLIC_API_URL=http://localhost:4000/api`)

---

## 📁 Related Files

### Backend
- `backend/src/controllers/dashboard.controller.ts` - Logic tính revenue
- `backend/src/routes/dashboard.route.ts` - API routes
- `backend/scripts/debug-revenue.ts` - Debug script
- `backend/test-revenue-debug.http` - API tests

### Frontend
- `admin-dashboard/src/hooks/use-dashboard.ts` - React Query hooks
- `admin-dashboard/src/app/(dashboard)/page.tsx` - Dashboard page
- `admin-dashboard/src/components/dashboard/stat-card.tsx` - Revenue card
- `admin-dashboard/src/components/dashboard/revenue-chart.tsx` - Chart

### Database
- `backend/prisma/schema.prisma` - Order model
- `backend/prisma/seed.ts` - Seed data

---

## 🎓 Understanding the Logic

### Why only DELIVERED orders?

Revenue should only count when:
1. ✅ Customer paid
2. ✅ Product delivered
3. ✅ No refund risk

Order lifecycle:
```
PENDING → CONFIRMED → PROCESSING → SHIPPING → DELIVERED
                                              ↑
                                        Count revenue here
```

### Why 30 days window?

Dashboard shows **recent performance**:
- Current period: Last 30 days
- Previous period: 30-60 days ago
- Change % = (current - previous) / previous * 100

---

## 🚀 Quick Fix (Development)

```bash
# 1. Check data
cd backend
npm run debug-revenue

# 2. If no DELIVERED orders, update via SQL
npx prisma studio
# → Go to Order table
# → Change status to DELIVERED for recent orders

# 3. Refresh admin dashboard
# → Should see revenue now
```

---

## 📞 Still Not Working?

1. Share output of `npm run debug-revenue`
2. Share screenshot of Network tab (API call)
3. Share browser console errors
4. Share backend terminal logs
