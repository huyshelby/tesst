# 🔍 Giải thích: Tại sao cột "Thanh toán" hiển thị "Chưa thanh toán"

## 📊 Tóm tắt vấn đề

Trong trang quản lý đơn hàng admin, cột **"Thanh toán"** hiển thị **"Chưa thanh toán"** cho tất cả các đơn hàng.

## 🎯 Nguyên nhân chính

### 1. **Thiết kế Database Schema**

Trong file `backend/prisma/schema.prisma`, model `Order` có field:

```prisma
model Order {
  // ...
  paymentMethod   PaymentMethod
  paymentStatus   PaymentStatus @default(PENDING)  // ← ĐÂY LÀ NGUYÊN NHÂN
  // ...
}

enum PaymentStatus {
  PENDING      // ← Giá trị mặc định
  COMPLETED
  FAILED
  REFUNDED
}
```

**Khi tạo đơn hàng mới**, `paymentStatus` tự động được set về `PENDING` (Chưa thanh toán).

### 2. **Logic tạo đơn hàng không tự động cập nhật paymentStatus**

Trong `backend/src/services/order.service.ts`, hàm `createOrder`:

```typescript
const newOrder = await tx.order.create({
  data: {
    userId,
    orderNumber: this.generateOrderNumber(),
    // ... các thông tin khác
    paymentMethod: orderData.paymentMethod as any,
    // ❌ KHÔNG CÓ paymentStatus ở đây
    // ✅ Nên tự động mặc định là PENDING
    subtotal,
    shippingFee,
    total,
  },
});
```

**Không có logic** để:
- Tự động set `paymentStatus = COMPLETED` khi `paymentMethod = COD`
- Tự động verify payment khi dùng CARD, MOMO, VNPAY, etc.

### 3. **Hiển thị trên Frontend**

File `admin-dashboard/src/app/(dashboard)/orders/page.tsx`:

```tsx
const getPaymentBadge = (status: string) => {
  const config = {
    PENDING: { label: 'Chưa thanh toán', variant: 'secondary' as const },
    COMPLETED: { label: 'Đã thanh toán', variant: 'success' as const },
    FAILED: { label: 'Thất bại', variant: 'destructive' as const },
  }
  return config[status as keyof typeof config] || { label: status, variant: 'secondary' as const }
}

// Hiển thị trong table
<Badge variant={getPaymentBadge(order.paymentStatus).variant}>
  {getPaymentBadge(order.paymentStatus).label}
</Badge>
```

Frontend **chỉ hiển thị** dữ liệu từ backend, không tự ý suy luận.

## 🔄 Quy trình thực tế

### Hiện tại:

```
1. Customer tạo đơn hàng → paymentStatus = PENDING
2. Admin xem đơn → Hiển thị "Chưa thanh toán"
3. Admin phải MANUALLY cập nhật paymentStatus qua API
```

### Backend có endpoint để Admin cập nhật:

```http
PUT /api/orders/admin/:orderId/payment
Content-Type: application/json
Authorization: Bearer <admin_token>

{
  "paymentStatus": "COMPLETED"
}
```

## ✅ Giải pháp

### Option 1: **Tự động đánh dấu COD là PENDING (hiện tại)**
- COD = Ship cod, thanh toán khi nhận hàng
- paymentStatus = PENDING cho đến khi ship deliver
- Admin cập nhật thành COMPLETED khi shipper confirm nhận tiền

### Option 2: **Tự động set COMPLETED cho một số payment methods**

Sửa `backend/src/services/order.service.ts`:

```typescript
static async createOrder(userId: string, orderData: {...}) {
  // ...
  
  // Xác định paymentStatus dựa trên paymentMethod
  let paymentStatus: PaymentStatus = 'PENDING';
  
  // Nếu là COD, giữ PENDING (thanh toán khi nhận hàng)
  // Nếu là thanh toán online, cần verify payment gateway
  if (orderData.paymentMethod === 'CARD' || 
      orderData.paymentMethod === 'MOMO' ||
      orderData.paymentMethod === 'VNPAY') {
    // TODO: Verify payment with gateway
    // paymentStatus = 'COMPLETED' nếu verify thành công
  }
  
  const newOrder = await tx.order.create({
    data: {
      // ...
      paymentMethod: orderData.paymentMethod as any,
      paymentStatus,  // ← Thêm dòng này
      // ...
    },
  });
}
```

### Option 3: **Thêm webhook từ payment gateway**

Khi customer thanh toán qua MOMO/VNPAY/CARD:
1. Payment gateway gửi webhook về server
2. Server tự động cập nhật `paymentStatus = COMPLETED`
3. Admin không cần thao tác thủ công

## 📋 Checklist hành động

- [ ] **Quyết định business logic**: COD nên là PENDING hay COMPLETED?
- [ ] **Tích hợp payment gateway** (nếu cần): MoMo, VNPay webhook
- [ ] **Thêm auto-update logic** trong OrderService.createOrder
- [ ] **Thêm UI button** trong admin để admin có thể update payment status dễ dàng
- [ ] **Thêm notification** khi payment status thay đổi

## 🎯 Kết luận

**Hiện trạng hoàn toàn đúng theo thiết kế:**
- Database schema: `paymentStatus` mặc định là `PENDING` ✅
- Backend logic: Không tự động update payment status ✅
- Frontend: Hiển thị chính xác dữ liệu từ backend ✅

**Để đơn hàng hiển thị "Đã thanh toán":**
1. Admin cần gọi API cập nhật payment status
2. Hoặc tích hợp payment gateway để tự động verify
3. Hoặc thêm logic auto-update cho COD khi shipper confirm deliver

---

## 📱 Demo flow thực tế

### Với COD:
```
Customer đặt hàng → PENDING
↓
Admin confirm đơn → PENDING
↓
Shipper giao hàng → PENDING
↓
Shipper nhận tiền mặt → Admin update → COMPLETED
```

### Với thanh toán online:
```
Customer chọn MOMO → PENDING
↓
Thanh toán trên app MOMO → Webhook → COMPLETED
↓
Admin thấy "Đã thanh toán" ✅
```

---

**📅 Created:** December 20, 2025
**👤 Context:** E-Commerce Admin Dashboard - Order Management
