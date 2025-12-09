---
type: "manual"
---

# Backend Rules — Node.js + TypeScript + Express

## Kiến trúc & Coding

- Node LTS (>= 20), TypeScript `strict: true`. Không dùng `any` trừ khi có lý do.
- Cấu trúc:
  src/
  app.ts (khởi tạo express, middleware)
  routes/**/\*.ts
  controllers/**/_.ts (mỏng, chỉ điều phối)
  services/\*\*/_.ts (logic nghiệp vụ)
  repositories/**/\*.ts (ORM/DB)
  schemas/**/_.ts (Zod)
  middlewares/\*\*/_.ts
  utils/**/\*.ts
  tests/**
- Tiêu chuẩn: ESLint + Prettier. Import theo alias `@/…`.

## HTTP & Middleware (thứ tự)

helmet → cors (whitelist từ ENV) → express.json() → compression → rateLimit → auth → routes → errorHandler

- Tắt `x-powered-by`. Log ở dev; không log secrets.

## Validation & DTO

- Validate **mọi input** ở boundary (controller) bằng **Zod**.
- Tách `schema`/`dto` riêng; reject 400 với thông điệp rõ ràng.

## AuthN/AuthZ (JWT)

- Access Token: TTL 15m, gửi qua `Authorization: Bearer <jwt>`.
- Refresh Token: TTL 7d, **HttpOnly + Secure + SameSite=Strict** cookie.
- Endpoint `/auth/refresh`: xoay vòng refresh token; thu hồi nếu lệch version hoặc nằm trong blacklist.
- Không bao giờ log JWT/secret. Secret lấy từ ENV (validate bằng Zod).
- Với cookie refresh, **chống CSRF**: yêu cầu custom header `X-CSRF-Token` hoặc double-submit.

## Lỗi & Response

- Lỗi chuẩn: `{ error: { code, message, details? } }`.
- 404 trả `{ error: { code: "NOT_FOUND", message } }`.
- Phân trang: `?page&limit`; trả `meta: { page, limit, total }`.

## DB & Giao dịch

- Repository pattern; transaction cho nhiều bước ghi.
- Mật khẩu/keys luôn hash (bcrypt/argon2). Không bao giờ lưu plaintext.

## Test

- Unit: service/utility. Integration: controller với supertest.
- Tối thiểu 80% cover cho service và các branch chính.

## Observability

- `/healthz` (liveness), `/readyz` (readiness).
- (Tuỳ chọn) `/metrics` Prometheus.

## CI

- Chạy: `lint → test → typecheck → build`. Fail bất cứ bước nào thì chặn merge.
