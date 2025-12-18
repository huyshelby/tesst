# Hướng dẫn kết nối Admin Dashboard với Backend

## ✅ Đã hoàn tất

### 1. Cấu hình Backend

- **CORS**: Đã thêm `http://localhost:3001` vào whitelist trong [backend/src/app.ts](../backend/src/app.ts)
- **Backend API**: Đang chạy trên `http://localhost:4000`

### 2. Cấu hình Admin Dashboard

- **Environment**: File `.env.local` đã được tạo với:
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:4000/api
  NEXT_PUBLIC_APP_URL=http://localhost:3001
  ```
- **Dev Server**: Đang chạy trên `http://localhost:3001`

### 3. Tài khoản Admin

Đã tạo admin user để test:

```
📧 Email: admin@example.com
🔑 Password: AdminPass123
👤 Role: ADMIN
```

## 🚀 Test kết nối

### Bước 1: Kiểm tra Backend

```bash
curl http://localhost:4000/api/health
# Kết quả mong đợi: {"ok":true}
```

### Bước 2: Test Login API

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "AdminPass123"
  }'
```

### Bước 3: Đăng nhập Admin Dashboard

1. Mở trình duyệt tại `http://localhost:3001`
2. Nhập thông tin:
   - Email: `admin@example.com`
   - Password: `AdminPass123`
3. Click "Đăng nhập"

## 📝 API Endpoints

### Authentication

- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Lấy thông tin user hiện tại

### Protected Routes (Requires Admin Role)

- `GET /api/admin/users` - Danh sách users
- `GET /api/products` - Danh sách sản phẩm
- `GET /api/categories` - Danh sách categories
- `GET /api/orders` - Danh sách đơn hàng

## 🔧 Troubleshooting

### Lỗi CORS

Nếu gặp lỗi CORS, kiểm tra:

1. Backend CORS settings trong `backend/src/app.ts`
2. Đảm bảo `credentials: true` được bật

### Token không lưu

1. Check browser Console (F12)
2. Kiểm tra localStorage có `accessToken` không
3. Kiểm tra Cookies có `refreshToken` không

### API không response

1. Kiểm tra backend đang chạy: `http://localhost:4000/api/health`
2. Kiểm tra `.env.local` có đúng URL không
3. Xem terminal backend có lỗi không

## 📚 Tài liệu liên quan

- [Backend API Documentation](../backend/API-RBAC.md)
- [Admin Dashboard Architecture](./ARCHITECTURE.md)
- [Design System](./DESIGN_SYSTEM.md)
