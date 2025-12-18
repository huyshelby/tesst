# Admin Dashboard - Quick Start

Dự án Admin Dashboard đã được setup xong! 🎉

## 📦 Đã tạo sẵn:

### Structure
```
admin-dashboard/
├── src/
│   ├── app/
│   │   ├── (auth)/login/     - Trang đăng nhập
│   │   ├── (dashboard)/      - Layout dashboard + pages
│   │   ├── layout.tsx        - Root layout
│   │   └── providers.tsx     - React Query + Toast
│   ├── components/
│   │   └── layout/           - Sidebar + Header
│   ├── lib/
│   │   ├── api.ts           - Axios client với auto refresh
│   │   ├── auth.ts          - Auth service
│   │   └── utils.ts         - Utility functions
│   ├── hooks/
│   │   └── use-auth.ts      - Auth hook
│   └── types/
│       └── models.ts        - TypeScript types
├── package.json
├── tailwind.config.ts
└── .env.local
```

### Features đã implement:
✅ Authentication flow (login/logout)
✅ Protected routes
✅ Sidebar navigation với collapse
✅ Header với search & user menu
✅ Dashboard page với KPI cards
✅ React Query setup
✅ Toast notifications
✅ API client với auto token refresh

## 🚀 Cài đặt & Chạy

### 1. Install dependencies
```bash
cd admin-dashboard
pnpm install
```

### 2. Start development server
```bash
pnpm dev
```

Open http://localhost:3001

### 3. Login
Sử dụng tài khoản admin từ backend:
- Email: admin@example.com (hoặc tài khoản bạn đã tạo)
- Password: password

## 📝 Next Steps

1. **Thêm shadcn/ui components:**
```bash
pnpm dlx shadcn-ui@latest add table
pnpm dlx shadcn-ui@latest add badge
pnpm dlx shadcn-ui@latest add tabs
```

2. **Implement Products page** - Xem IMPLEMENTATION.md

3. **Thêm charts** - Install recharts và tạo components

4. **Build remaining pages** - Orders, Customers, etc.

## 🔧 Available Scripts

```bash
pnpm dev      # Start dev server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
pnpm format   # Format code with Prettier
```

## 📚 Documentation

Xem các file trong thư mục admin-dashboard/:
- DESIGN_SYSTEM.md - Design specifications
- SCREEN_DESIGN.md - Screen mockups
- ARCHITECTURE.md - Technical architecture
- COMPONENTS.md - Component library
- IMPLEMENTATION.md - Detailed implementation guide

Enjoy coding! 🎨
