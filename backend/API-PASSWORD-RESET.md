# API Password Reset

## Endpoints

### 1. Forgot Password
**POST** `/api/password/forgot`

Gửi yêu cầu reset password. Tạo token reset và lưu vào DB.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (Success - 200):**
```json
{
  "message": "Nếu email tồn tại, link reset password đã được gửi",
  "token": "abc123..." // Chỉ có trong development mode
}
```

**Lưu ý:**
- Luôn trả về success message để tránh leak thông tin user
- Token có hiệu lực 1 giờ
- Trong development, token được log ra console và trả về response
- Trong production, cần tích hợp email service để gửi link reset

---

### 2. Reset Password
**POST** `/api/password/reset`

Reset password với token đã nhận được.

**Request Body:**
```json
{
  "token": "abc123...",
  "password": "newpassword123"
}
```

**Response (Success - 200):**
```json
{
  "message": "Đặt lại mật khẩu thành công"
}
```

**Response (Error - 400):**
```json
{
  "message": "Token không hợp lệ hoặc đã hết hạn"
}
```

**Validation:**
- Token: required, string
- Password: required, min 6 ký tự

---

## Flow hoàn chỉnh

1. **User quên mật khẩu:**
   - Gọi `POST /api/password/forgot` với email
   - Backend tạo token và lưu DB
   - (Production) Gửi email với link reset
   - (Development) Token được log ra console

2. **User click link reset:**
   - Link dạng: `https://yourdomain.com/reset-password?token=abc123`
   - Frontend hiển thị form nhập password mới

3. **User submit password mới:**
   - Frontend gọi `POST /api/password/reset` với token và password mới
   - Backend verify token, update password, đánh dấu token đã dùng

4. **User login với password mới:**
   - Gọi `POST /api/auth/login` với email và password mới

---

## Database Schema

```prisma
model PasswordReset {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  token     String   @unique
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([token])
  @@index([expiresAt])
}
```

**Các trường:**
- `token`: Token ngẫu nhiên (32 bytes hex)
- `expiresAt`: Thời gian hết hạn (1 giờ sau khi tạo)
- `usedAt`: Thời gian token được sử dụng (null nếu chưa dùng)

---

## Test với REST Client

Xem file `test-password-reset.http` để test API.

**Bước 1:** Gửi forgot password
```http
POST http://localhost:4000/api/password/forgot
Content-Type: application/json

{
  "email": "admin@example.com"
}
```

**Bước 2:** Copy token từ response hoặc console log

**Bước 3:** Reset password
```http
POST http://localhost:4000/api/password/reset
Content-Type: application/json

{
  "token": "YOUR_TOKEN_HERE",
  "password": "newpassword123"
}
```

**Bước 4:** Test login
```http
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "newpassword123"
}
```

---

## TODO - Production

Để deploy production, cần:

1. **Tích hợp Email Service:**
   - Sử dụng Nodemailer, SendGrid, hoặc AWS SES
   - Gửi email với link reset thay vì log console
   - Template email đẹp với branding

2. **Bảo mật:**
   - KHÔNG trả token trong response (chỉ gửi qua email)
   - Rate limiting cho endpoint forgot password
   - CAPTCHA để chống spam

3. **Cleanup:**
   - Cron job xóa token đã hết hạn/đã dùng
   - Giới hạn số lần request reset trong 1 khoảng thời gian

