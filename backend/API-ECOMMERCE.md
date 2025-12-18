# Backend E-Commerce API Documentation

Backend API cho ứng dụng e-commerce bán điện thoại và thiết bị điện tử.

## 🚀 Setup

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình môi trường

Tạo file `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"
JWT_SECRET="your-secret-key"
REFRESH_SECRET="your-refresh-secret"
PORT=4000
```

### 3. Chạy migrations

```bash
npx prisma migrate dev
```

### 4. Seed database

```bash
npx tsx prisma/seed.ts
```

### 5. Chạy server

```bash
npm run dev
```

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Đăng xuất

### Products

- `GET /api/products` - Lấy danh sách sản phẩm (có phân trang, filter)
  - Query params: `category`, `brand`, `minPrice`, `maxPrice`, `search`, `sortBy`, `order`, `page`, `limit`
- `GET /api/products/:id` - Lấy chi tiết sản phẩm theo ID
- `GET /api/products/slug/:slug` - Lấy chi tiết sản phẩm theo slug
- `POST /api/products` - Tạo sản phẩm mới (Admin only)
- `PUT /api/products/:id` - Cập nhật sản phẩm (Admin only)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin only)

### Cart

- `GET /api/cart` - Lấy giỏ hàng (hỗ trợ cả user đã đăng nhập và chưa đăng nhập)
- `POST /api/cart/items` - Thêm sản phẩm vào giỏ
- `PUT /api/cart/items/:itemId` - Cập nhật số lượng sản phẩm
- `DELETE /api/cart/items/:itemId` - Xóa sản phẩm khỏi giỏ
- `DELETE /api/cart` - Xóa toàn bộ giỏ hàng

### Orders

**User endpoints:**

- `POST /api/orders` - Tạo đơn hàng từ giỏ hàng (requires auth)
- `GET /api/orders` - Lấy danh sách đơn hàng của user
  - Query params: `status`, `page`, `limit`
- `GET /api/orders/:orderId` - Lấy chi tiết đơn hàng
- `GET /api/orders/number/:orderNumber` - Lấy đơn hàng theo mã đơn
- `POST /api/orders/:orderId/cancel` - Hủy đơn hàng

**Admin endpoints:**

- `GET /api/orders/admin/all` - Lấy tất cả đơn hàng
- `PUT /api/orders/admin/:orderId/status` - Cập nhật trạng thái đơn hàng
- `PUT /api/orders/admin/:orderId/payment` - Cập nhật trạng thái thanh toán

### Users

- `GET /api/users/me` - Lấy thông tin user hiện tại
- `PUT /api/users/me` - Cập nhật thông tin user

### Admin

- `GET /api/admin/users` - Lấy danh sách users
- `PUT /api/admin/users/:id/role` - Cập nhật role của user

## 🗃️ Database Schema

### Product

```typescript
{
  id: string
  name: string
  slug: string (unique)
  description: string?
  price: number
  listPrice: number?
  image: string
  images: string[]
  category: ProductCategory (enum)
  brand: string
  stock: number
  rating: number?
  reviews: number
  badges: string[]
  installment: boolean
  specs: JSON? // {ram, storage, color, etc}
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Cart & CartItem

```typescript
Cart {
  id: string
  userId: string? (for logged in users)
  sessionId: string? (for anonymous users)
  items: CartItem[]
  createdAt: DateTime
  updatedAt: DateTime
}

CartItem {
  id: string
  cartId: string
  productId: string
  quantity: number
  selectedColor: string?
  selectedStorage: string?
}
```

### Order & OrderItem

```typescript
Order {
  id: string
  userId: string
  orderNumber: string (unique, auto-generated)
  status: OrderStatus (enum)

  // Customer info
  customerName: string
  customerEmail: string
  customerPhone: string

  // Shipping
  shippingAddress: string
  shippingCity: string
  shippingDistrict: string?
  shippingWard: string?

  // Payment
  paymentMethod: PaymentMethod (enum)
  paymentStatus: PaymentStatus (enum)
  cryptoWallet: string?
  cryptoNetwork: string?
  cryptoToken: string?
  cryptoTxHash: string?

  // Pricing
  subtotal: number
  shippingFee: number
  discount: number
  total: number

  notes: string?
  items: OrderItem[]

  createdAt: DateTime
  updatedAt: DateTime
}

OrderItem {
  id: string
  orderId: string
  productId: string
  productName: string (snapshot)
  productImage: string (snapshot)
  price: number (snapshot)
  quantity: number
  selectedColor: string?
  selectedStorage: string?
  subtotal: number
}
```

## 🔐 Authentication

API sử dụng JWT với hai loại token:

- **Access Token**: Có thời gian sống ngắn (15 phút), gửi trong header `Authorization: Bearer <token>`
- **Refresh Token**: Có thời gian sống dài (7 ngày), lưu trong HTTP-only cookie

## 🛒 Cart Logic

Cart hỗ trợ cả user đã đăng nhập và chưa đăng nhập:

- **Đã đăng nhập**: Cart được lưu theo `userId`
- **Chưa đăng nhập**: Cart được lưu theo `sessionId` (từ cookie hoặc header)

## 📦 Order Flow

1. User thêm sản phẩm vào giỏ hàng
2. User checkout và tạo đơn hàng
3. Hệ thống:
   - Tạo Order với status PENDING
   - Tạo OrderItems (snapshot của sản phẩm)
   - Giảm stock của sản phẩm
   - Xóa cart items
4. Admin cập nhật trạng thái đơn hàng: CONFIRMED → PROCESSING → SHIPPING → DELIVERED
5. Admin cập nhật trạng thái thanh toán khi xác nhận

## 💳 Payment Methods

Hỗ trợ nhiều phương thức thanh toán:

- CARD (Thẻ ATM/Visa/Mastercard)
- MOMO (Ví MoMo)
- VNPAY
- BANK_TRANSFER (Chuyển khoản)
- INSTALLMENT (Trả góp 0%)
- CRYPTO (Cryptocurrency - với thông tin wallet, network, token, txHash)

## 🔧 Development

### Generate Prisma Client

```bash
npx prisma generate
```

### Create Migration

```bash
npx prisma migrate dev --name migration_name
```

### View Database

```bash
npx prisma studio
```

## 📝 Notes

- Tất cả giá tiền đều tính bằng VND
- Miễn phí ship cho đơn hàng ≥ 500,000đ
- Stock được quản lý tự động khi tạo/hủy đơn hàng
- Order không thể hủy khi đã ở trạng thái PROCESSING trở lên
