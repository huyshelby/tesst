# Hướng dẫn Test Luồng Đặt Hàng - Phone App

## 📋 Tổng quan API Order

Backend đã có đầy đủ các API cần thiết:

### ✅ User Order APIs (Phone App)
- `POST /api/orders` - Tạo đơn hàng từ giỏ hàng
- `GET /api/orders` - Lấy danh sách đơn hàng của user
- `GET /api/orders/:orderId` - Lấy chi tiết đơn hàng theo ID
- `GET /api/orders/number/:orderNumber` - Lấy đơn hàng theo mã đơn
- `POST /api/orders/:orderId/cancel` - Hủy đơn hàng

### ✅ Admin Order APIs (Admin Dashboard)
- `GET /api/orders/admin/all` - Lấy tất cả đơn hàng (Admin)
- `PUT /api/orders/admin/:orderId/status` - Cập nhật trạng thái đơn hàng
- `PUT /api/orders/admin/:orderId/payment` - Cập nhật trạng thái thanh toán

## 🔧 Chuẩn bị Test

### 1. Khởi động Backend
```bash
cd backend
npm run dev
```
Backend chạy tại: http://localhost:4000

### 2. Tạo tài khoản test
Chạy file: `backend/test-order-flow.http` để test API

Hoặc tạo user qua API:
```http
POST http://localhost:4000/api/auth/register
Content-Type: application/json

{
  "email": "user@test.com",
  "password": "test123",
  "name": "Test User"
}
```

### 3. Tạo admin (nếu chưa có)
```bash
cd backend
npm run create-admin
```

## 📝 Luồng Test Đầy Đủ

### Bước 1: Đăng nhập
```http
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "user@test.com",
  "password": "test123"
}
```

Lưu `accessToken` từ response.

### Bước 2: Lấy danh mục và sản phẩm
```http
# Lấy categories
GET http://localhost:4000/api/categories

# Lấy products
GET http://localhost:4000/api/products?limit=10
```

### Bước 3: Thêm vào giỏ hàng
```http
POST http://localhost:4000/api/cart/items
Content-Type: application/json
Authorization: Bearer <accessToken>

{
  "productId": "<product-id-từ-step-2>",
  "quantity": 1,
  "selectedColor": "Midnight",
  "selectedStorage": "128GB"
}
```

### Bước 4: Xem giỏ hàng
```http
GET http://localhost:4000/api/cart
Authorization: Bearer <accessToken>
```

### Bước 5: Đặt hàng
```http
POST http://localhost:4000/api/orders
Content-Type: application/json
Authorization: Bearer <accessToken>

{
  "customerName": "Nguyễn Văn A",
  "customerEmail": "user@test.com",
  "customerPhone": "0912345678",
  "shippingAddress": "123 Lê Lợi",
  "shippingCity": "Hồ Chí Minh",
  "shippingDistrict": "Quận 1",
  "shippingWard": "Phường Bến Nghé",
  "paymentMethod": "CARD",
  "notes": "Giao giờ hành chính"
}
```

### Bước 6: Xem đơn hàng
```http
# Xem danh sách đơn hàng
GET http://localhost:4000/api/orders
Authorization: Bearer <accessToken>

# Xem chi tiết đơn hàng
GET http://localhost:4000/api/orders/<order-id>
Authorization: Bearer <accessToken>
```

### Bước 7: Hủy đơn hàng (nếu cần)
```http
POST http://localhost:4000/api/orders/<order-id>/cancel
Authorization: Bearer <accessToken>
```

## 🔍 Kiểm tra trong Phone App

### 1. Khởi động Phone App
```bash
cd phone-app
npm run dev
```
App chạy tại: http://localhost:3000

### 2. Test UI Flow
1. **Trang chủ** (`/`) → Xem sản phẩm
2. **Chi tiết sản phẩm** → Click "Thêm vào giỏ hàng"
3. **Giỏ hàng** (`/gio-hang`) → Xem giỏ hàng, điều chỉnh số lượng
4. **Đăng nhập** (`/login`) → Đăng nhập tài khoản
5. **Thanh toán** (`/thanh-toan`) → Điền thông tin, chọn phương thức
6. **Đặt hàng** → Click "Đặt hàng"
7. **Thành công** (`/dat-hang-thanh-cong`) → Xem thông tin đơn hàng
8. **Đơn hàng của tôi** (`/account/orders`) → Xem lịch sử đơn hàng

## ⚠️ Lỗi Thường Gặp

### 1. 404 - Endpoint not found
**Vấn đề:** Admin dashboard gọi sai endpoint
- ❌ Sai: `/api/orders/admin?page=1`
- ✅ Đúng: `/api/orders/admin/all?page=1`

**Giải pháp:** Sửa file `admin-dashboard/src/hooks/use-orders.ts`

### 2. 401 - Unauthorized
**Vấn đề:** Chưa đăng nhập hoặc token hết hạn
**Giải pháp:** 
- Đăng nhập lại
- Check localStorage có `accessToken` không
- Check cookie có `refreshToken` không

### 3. Cart is empty
**Vấn đề:** Giỏ hàng trống khi đặt hàng
**Giải pháp:** Thêm sản phẩm vào giỏ trước khi đặt hàng

### 4. Insufficient stock
**Vấn đề:** Không đủ hàng trong kho
**Giải pháp:** 
- Check stock của product trong database
- Giảm số lượng trong giỏ hàng

## 📊 Kiểm tra Database

```bash
cd backend
npx prisma studio
```

Mở http://localhost:5555 để xem:
- **Order** table - Danh sách đơn hàng
- **OrderItem** table - Chi tiết sản phẩm trong đơn
- **Cart** table - Giỏ hàng
- **Product** table - Tồn kho (stock)

## ✅ Checklist Test

- [ ] Backend chạy thành công
- [ ] Có user test (register hoặc seed)
- [ ] Có products trong database
- [ ] Login thành công, có access token
- [ ] Thêm vào giỏ hàng thành công
- [ ] Xem giỏ hàng có items
- [ ] Tạo order thành công
- [ ] Giỏ hàng được clear sau khi order
- [ ] Stock giảm đúng số lượng
- [ ] Xem được order trong `/account/orders`
- [ ] Cancel order thành công (nếu status cho phép)

## 🎯 Kết quả Mong đợi

### Order object sau khi tạo:
```json
{
  "id": "uuid",
  "orderNumber": "ORD-XXXXX",
  "status": "PENDING",
  "paymentStatus": "PENDING",
  "paymentMethod": "CARD",
  "customerName": "Nguyễn Văn A",
  "customerEmail": "user@test.com",
  "customerPhone": "0912345678",
  "shippingAddress": "123 Lê Lợi",
  "shippingCity": "Hồ Chí Minh",
  "subtotal": 24990000,
  "shippingFee": 0,
  "total": 24990000,
  "items": [
    {
      "id": "uuid",
      "productId": "uuid",
      "product": { ... },
      "quantity": 1,
      "price": 24990000
    }
  ]
}
```

## 📞 Support

Nếu gặp vấn đề, check:
1. Backend logs trong terminal
2. Browser console logs
3. Network tab trong DevTools
4. Database trong Prisma Studio
