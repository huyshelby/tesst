# API Documentation - Role-Based Access Control

## Tổng quan
Hệ thống phân quyền dựa trên Role với 2 cấp độ:
- **USER**: Người dùng thường
- **ADMIN**: Quản trị viên

## Authentication
Tất cả API đều cần header:
```
Authorization: Bearer <access_token>
```

## User Endpoints

### GET /api/users/me
Lấy thông tin profile của user hiện tại
- **Quyền**: USER, ADMIN
- **Response**: User profile với role

```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:4000/api/users/me
```

## Admin Endpoints

### GET /api/admin/users
Lấy danh sách tất cả users (phân trang)
- **Quyền**: ADMIN only
- **Query params**: 
  - `page` (default: 1)
  - `limit` (default: 10, max: 100)

```bash
curl -H "Authorization: Bearer <admin_token>" \
  "http://localhost:4000/api/admin/users?page=1&limit=10"
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "User Name",
      "role": "USER",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### PUT /api/admin/users/:userId/role
Cập nhật role của user
- **Quyền**: ADMIN only
- **Body**: `{ "role": "USER" | "ADMIN" }`
- **Lưu ý**: Admin không thể tự hạ cấp chính mình

```bash
curl -X PUT \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"role": "ADMIN"}' \
  http://localhost:4000/api/admin/users/USER_ID/role
```

### DELETE /api/admin/users/:userId
Xóa user
- **Quyền**: ADMIN only
- **Lưu ý**: Admin không thể xóa chính mình

```bash
curl -X DELETE \
  -H "Authorization: Bearer <admin_token>" \
  http://localhost:4000/api/admin/users/USER_ID
```

### POST /api/admin/users/:userId/revoke-sessions
Thu hồi tất cả sessions của user
- **Quyền**: ADMIN only

```bash
curl -X POST \
  -H "Authorization: Bearer <admin_token>" \
  http://localhost:4000/api/admin/users/USER_ID/revoke-sessions
```

### GET /api/admin/stats
Xem thống kê hệ thống
- **Quyền**: ADMIN only

```bash
curl -H "Authorization: Bearer <admin_token>" \
  http://localhost:4000/api/admin/stats
```

**Response:**
```json
{
  "totalUsers": 100,
  "totalAdmins": 5,
  "activeSessions": 45,
  "recentUsers": 12,
  "usersByRole": {
    "admin": 5,
    "user": 95
  }
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "message": "Insufficient permissions",
  "required": ["ADMIN"],
  "current": "USER"
}
```

### 400 Bad Request
```json
{
  "message": "Cannot demote yourself from admin role"
}
```

## Tạo Admin User Đầu Tiên

```bash
npx ts-node scripts/create-admin.ts
```

**Thông tin admin mặc định:**
- Email: `admin@example.com`
- Password: `AdminPass123`
- Role: `ADMIN`

## Test Flow

1. **Đăng ký user thường**
2. **Login và lấy token**
3. **Thử truy cập admin endpoint** → 403 Forbidden
4. **Login admin**
5. **Truy cập admin endpoints** → Success
6. **Cập nhật role user thành admin**
7. **User login lại** → Có quyền admin

## Security Features

- ✅ JWT payload chứa role
- ✅ Middleware phân quyền theo role
- ✅ Admin không thể tự hạ cấp/xóa
- ✅ Session tracking và revoke
- ✅ Validation đầy đủ với Zod
- ✅ Error handling chuẩn
