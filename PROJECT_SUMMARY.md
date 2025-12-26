# 📱 E-Commerce Phone Store - Tóm Tắt Dự Án

> **Phiên bản**: 2.0.0 | **Cập nhật**: December 2024

---

## 🎯 Tổng Quan

**E-Commerce Phone Store** là hệ thống thương mại điện tử chuyên bán sản phẩm Apple với tích hợp thanh toán blockchain. Hệ thống được xây dựng theo kiến trúc Monorepo với 4 thành phần chính.

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Phone App     │    │ Admin Dashboard │    │   Backend API   │
│  (Next.js 15)   │◄──►│  (Next.js 14)   │◄──►│  (Express.js)   │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 4000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                               ┌─────────────────┐
                                               │ PostgreSQL DB   │
                                               │   (Prisma ORM)  │
                                               └─────────────────┘
                                                        │
                                               ┌─────────────────┐
                                               │  Blockchain     │
                                               │ (Smart Contract)│
                                               └─────────────────┘
```

## 🛠️ Tech Stack

| Thành Phần | Công Nghệ | Mục Đích |
|------------|-----------|----------|
| **Backend** | Express.js + TypeScript + Prisma | API Server & Business Logic |
| **Database** | PostgreSQL + Prisma ORM | Data Storage |
| **Phone App** | Next.js 15 + Tailwind CSS | Customer Frontend |
| **Admin Dashboard** | Next.js 14 + shadcn/ui | Admin Interface |
| **Blockchain** | Solidity + Hardhat + Ethers.js | Crypto Payment |
| **Authentication** | JWT + Refresh Token | User Auth |

## 📦 Cấu Trúc Dự Án

```
newpro/
├── backend/              # Express.js API Server
├── phone-app/            # Customer Frontend (Next.js 15)
├── admin-dashboard/      # Admin Frontend (Next.js 14)
├── blockchain/           # Smart Contracts (Hardhat)
└── contracts/            # Solidity Contracts
```

## ✨ Tính Năng Chính

### 🔐 Authentication & Authorization
- **JWT Authentication**: Access Token (15 phút) + Refresh Token (30 ngày)
- **RBAC**: USER (khách hàng) và ADMIN (quản trị viên)
- **Password Reset**: Email-based reset flow

### 📱 Product Management
- **Hierarchical Categories**: Parent → Child → Grandchild
- **Product Variants**: Màu sắc, dung lượng
- **Image Gallery**: Multiple product images
- **Stock Management**: Inventory tracking

### 🛒 Shopping Cart
- **Dual Cart System**: 
  - Logged-in users: Database storage
  - Anonymous users: Session storage
- **Cart Sync**: Tự động merge khi đăng nhập

### 📋 Order Management
- **Order Flow**: PENDING → CONFIRMED → PROCESSING → SHIPPING → DELIVERED
- **Payment Methods**: COD, Bank Transfer, MoMo, VNPay, **Blockchain**
- **Order Tracking**: Real-time status updates

### 💰 Blockchain Payment
- **Supported Tokens**: ETH, USDT, USDC
- **Smart Contract**: PaymentContract.sol
- **MetaMask Integration**: Wallet connection
- **Auto Verification**: Backend tự động verify transactions

### 📊 Admin Dashboard
- **Analytics**: Revenue charts, order statistics
- **Product CRUD**: Full product management
- **Order Management**: Status updates, delete orders
- **Customer Management**: User administration

## 🔌 API Endpoints Chính

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/refresh` - Refresh token

### Products
- `GET /api/products` - Danh sách sản phẩm (filter, pagination)
- `POST /api/products` - Tạo sản phẩm (ADMIN)
- `PUT /api/products/:id` - Cập nhật (ADMIN)

### Orders
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders` - Danh sách đơn hàng user
- `PUT /api/orders/admin/:id/status` - Cập nhật trạng thái (ADMIN)

### Blockchain
- `POST /api/orders/:id/blockchain-payment` - Xác nhận thanh toán crypto

## 🚀 Hướng Dẫn Chạy

### Development Setup
```bash
# 1. Clone và cài đặt dependencies
git clone <repo>
cd newpro

# Backend
cd backend && npm install
cp .env.example .env

# Database
docker-compose up -d
npx prisma migrate dev
npm run seed

# Phone App
cd ../phone-app && npm install

# Admin Dashboard
cd ../admin-dashboard && npm install

# Blockchain (Optional)
cd ../blockchain && npm install
npx hardhat node  # Terminal riêng
```

### Start Development Servers
```bash
# Terminal 1: Backend
cd backend && npm run dev  # http://localhost:4000

# Terminal 2: Phone App
cd phone-app && npm run dev  # http://localhost:3000

# Terminal 3: Admin Dashboard
cd admin-dashboard && npm run dev  # http://localhost:3001

# Terminal 4: Blockchain (Optional)
cd blockchain && npx hardhat node
```

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
PORT=4000
PAYMENT_CONTRACT_ADDRESS=0x...
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS=0x...
```

## 📊 Database Schema

### Core Models
- **User**: id, email, password, role
- **Category**: Hierarchical structure (parentId)
- **Product**: name, price, images, categoryId, specs
- **Cart**: userId/sessionId dual support
- **Order**: orderNumber, status, paymentStatus, crypto fields
- **OrderItem**: Snapshot product data at order time

### Key Relationships
```
User ||--o{ Order : places
Category ||--o{ Product : contains
Product ||--o{ CartItem : in_cart
Order ||--o{ OrderItem : contains
```

## 🔐 Security Features

- **JWT Tokens**: Short-lived access + long-lived refresh
- **Password Hashing**: Bcrypt
- **Input Validation**: Zod schemas
- **CORS Protection**: Configured for frontend domains
- **SQL Injection**: Prisma ORM protection
- **XSS Protection**: Helmet.js headers

## 🐛 Troubleshooting

### Port Conflicts
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

### Database Issues
```bash
cd backend
npx prisma migrate reset
npm run seed
```

### Blockchain Connection
- Kiểm tra Hardhat node đang chạy
- Verify contract address trong .env
- MetaMask network: Hardhat Local (Chain ID: 31337)

## 📚 Tài Liệu Chi Tiết

- [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - Tài liệu đầy đủ (1583 dòng)
- [README.md](./README.md) - Hướng dẫn cài đặt
- [BACKEND_SUMMARY.md](./BACKEND_SUMMARY.md) - Backend architecture
- [BLOCKCHAIN_PAYMENT_FLOW.md](./BLOCKCHAIN_PAYMENT_FLOW.md) - Blockchain integration

---

**Phiên bản**: 2.0.0 | **Cập nhật**: December 24, 2024 | **Trạng thái**: Production Ready
