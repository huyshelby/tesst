# Admin Dashboard - E-Commerce Phone Store

> Hệ thống quản trị website bán hàng điện thoại chuyên nghiệp, hiện đại và dễ sử dụng

## 📋 Tổng quan

Admin Dashboard được thiết kế để quản lý toàn bộ hoạt động của website thương mại điện tử bán điện thoại và phụ kiện Apple. Hệ thống tập trung vào:

- ✅ **Tính thực dụng**: Tối ưu workflow cho quản trị viên
- ✅ **Dễ sử dụng**: UI/UX trực quan, dễ học
- ✅ **Hiệu suất cao**: Xử lý dữ liệu lớn mượt mà
- ✅ **Mở rộng dễ dàng**: Kiến trúc module, component-based
- ✅ **Phân quyền linh hoạt**: Role-based access control

---

## 🎯 Chức năng chính

### 1. Dashboard (Tổng quan)

- **KPI Cards**: Doanh thu, đơn hàng, cảnh báo tồn kho
- **Biểu đồ**: Doanh thu theo thời gian, phân bổ đơn hàng
- **Bảng**: Đơn hàng mới nhất, sản phẩm bán chạy

### 2. Quản lý sản phẩm

- **Danh sách**: Tìm kiếm, filter, sort, bulk actions
- **Thêm/Sửa**: Form đa tab với upload ảnh, rich text editor
- **Danh mục**: Tree view với hierarchy, drag-and-drop
- **Thuộc tính**: Dynamic key-value attributes

### 3. Quản lý đơn hàng

- **Danh sách**: Filter theo trạng thái, khách hàng, ngày
- **Chi tiết**: Timeline trạng thái, thông tin giao hàng
- **Thao tác**: Xác nhận, hủy, hoàn tiền, in hóa đơn

### 4. Quản lý khách hàng

- **Profile**: Thông tin, lịch sử mua hàng, tổng chi tiêu
- **Phân loại**: Segment theo hành vi mua hàng
- **Ghi chú**: Notes nội bộ cho CSKH

### 5. Quản lý kho

- **Tồn kho**: Real-time inventory tracking
- **Cảnh báo**: Sản phẩm sắp hết hàng
- **Nhập/Xuất**: Stock adjustment với lý do

### 6. Khuyến mãi & Voucher

- **Tạo mã**: Percentage, fixed amount, free shipping
- **Điều kiện**: Min order, specific products/categories
- **Giới hạn**: Usage limits, date range

### 7. Đánh giá sản phẩm

- **Duyệt**: Approve/reject reviews
- **Phản hồi**: Reply to customer reviews
- **Báo cáo**: Spam/inappropriate content

### 8. Phân quyền

- **Roles**: Super Admin, Manager, Staff, Accountant
- **Permissions**: Granular access control
- **UI Adaptation**: Auto hide unauthorized features

### 9. Cài đặt

- **General**: Store info, currency, timezone
- **Payment**: Payment gateway configuration
- **Shipping**: Shipping methods and rates
- **Notifications**: Email/SMS templates

---

## 🛠️ Tech Stack

### Frontend

```
Framework:      Next.js 14 (App Router)
Language:       TypeScript 5.3+
UI Library:     shadcn/ui + Radix UI
Styling:        Tailwind CSS 3.4
Icons:          Lucide React
State:          TanStack Query + Zustand
Forms:          React Hook Form + Zod
Charts:         Recharts
Animations:     Framer Motion
```

### Backend API

```
Framework:      Express.js + TypeScript
Database:       PostgreSQL + Prisma ORM
Auth:           JWT (Access + Refresh tokens)
Validation:     Zod
URL:            http://localhost:4000/api
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.x
- npm >= 10.x
- Backend API running on `http://localhost:4000`

### 1. Install Dependencies

```bash
cd admin-dashboard
npm install
```

### 2. Environment Setup

File `.env.local` đã được tạo sẵn:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### 3. Start Dev Server

```bash
npm run dev
# or
npx next dev -p 3001
```

Dashboard sẽ chạy tại: **http://localhost:3001**

### 4. Login với Admin Account

```
📧 Email: admin@example.com
🔑 Password: AdminPass123
```

### 5. Test API Connection

Sử dụng file `test-api.http` với REST Client extension hoặc:

```bash
curl http://localhost:4000/api/health
```

📚 **Chi tiết kết nối**: Xem [CONNECT_BACKEND.md](./CONNECT_BACKEND.md)

---

### Development Tools

```
Package Manager: pnpm
Linter:         ESLint
Formatter:      Prettier
Testing:        Vitest + Testing Library
Git Hooks:      Husky
```

---

## 📁 Tài liệu

Hệ thống tài liệu đầy đủ giúp developers implement dashboard một cách hiệu quả:

1. **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)**
   - Color palette, typography, spacing
   - Component patterns (buttons, inputs, cards, tables)
   - Icon system, animations
   - Design tokens

2. **[SCREEN_DESIGN.md](./SCREEN_DESIGN.md)**
   - Detailed mockups cho từng màn hình
   - Layout specifications
   - Component hierarchy
   - Interaction patterns
   - Mobile responsive adaptations

3. **[ARCHITECTURE.md](./ARCHITECTURE.md)**
   - Frontend architecture
   - Project structure
   - State management strategy
   - API integration
   - Authentication flow
   - Performance optimization

4. **[COMPONENTS.md](./COMPONENTS.md)**
   - Component specifications
   - Props interfaces
   - Usage examples
   - Utility hooks
   - Helper functions

5. **[IMPLEMENTATION.md](./IMPLEMENTATION.md)** _(Xem dưới)_
   - Step-by-step implementation guide
   - Setup instructions
   - Development workflow
   - Deployment guide

---

## 🚀 Quick Start

### Prerequisites

```bash
Node.js >= 20.x
pnpm >= 8.x
PostgreSQL >= 14.x
```

### 1. Clone & Install

```bash
git clone <repository-url>
cd admin-dashboard
pnpm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your values
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Initialize shadcn/ui

```bash
pnpm dlx shadcn-ui@latest init
```

### 4. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📦 Project Structure

```
admin-dashboard/
├── docs/                      # Documentation files
│   ├── DESIGN_SYSTEM.md
│   ├── SCREEN_DESIGN.md
│   ├── ARCHITECTURE.md
│   ├── COMPONENTS.md
│   └── IMPLEMENTATION.md
├── public/                    # Static assets
│   ├── fonts/
│   └── images/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # Auth pages (login)
│   │   ├── (dashboard)/      # Protected dashboard pages
│   │   ├── layout.tsx        # Root layout
│   │   ├── providers.tsx     # Providers (React Query, Theme)
│   │   └── globals.css       # Global styles
│   ├── components/            # Reusable components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── layout/           # Layout components (Sidebar, Header)
│   │   ├── dashboard/        # Dashboard-specific components
│   │   ├── products/         # Product management components
│   │   ├── orders/           # Order management components
│   │   └── shared/           # Shared components (DataTable, etc.)
│   ├── hooks/                 # Custom React hooks
│   │   ├── use-auth.ts
│   │   ├── use-products.ts
│   │   └── use-orders.ts
│   ├── lib/                   # Utilities
│   │   ├── api.ts            # API client
│   │   ├── auth.ts           # Auth helpers
│   │   ├── utils.ts          # General utilities
│   │   └── validations.ts    # Zod schemas
│   ├── stores/                # Zustand stores
│   │   ├── sidebar-store.ts
│   │   └── user-store.ts
│   └── types/                 # TypeScript types
│       ├── api.ts
│       └── models.ts
├── .env.local                 # Environment variables (gitignored)
├── .env.example               # Environment template
├── components.json            # shadcn/ui configuration
├── next.config.js             # Next.js configuration
├── package.json
├── tailwind.config.ts         # Tailwind configuration
└── tsconfig.json              # TypeScript configuration
```

---

## 🎨 Design Highlights

### Color Scheme

- **Primary**: Blue (#2563EB) - Actions, links
- **Neutrals**: Gray scale - Text, backgrounds
- **Success**: Green (#10B981) - Completed, active
- **Warning**: Amber (#F59E0B) - Pending, alerts
- **Danger**: Red (#EF4444) - Errors, delete actions

### Typography

- **Font**: Inter (Google Fonts)
- **Sizes**: 12px - 30px (semantic scale)
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Components

- **Cards**: White background, subtle shadow, rounded corners
- **Tables**: Hover effects, sortable columns, action dropdowns
- **Forms**: Clear labels, inline validation, helpful errors
- **Charts**: Responsive, interactive tooltips, consistent colors

---

## 🔐 Security Features

1. **JWT Authentication**
   - Access token (15 min expiry)
   - Refresh token (7 days, HTTP-only cookie)
   - Automatic token refresh

2. **Role-Based Access Control (RBAC)**
   - Super Admin: Full access
   - Manager: All except system settings
   - Staff: View + limited edit
   - Accountant: Reports only

3. **Permission Checks**
   - Server-side: API endpoint guards
   - Client-side: UI visibility control

4. **Input Validation**
   - Zod schemas for all forms
   - Server-side re-validation
   - XSS prevention

---

## 📊 Performance Optimizations

1. **Code Splitting**
   - Route-based splitting (automatic in Next.js)
   - Dynamic imports for heavy components
   - Lazy loading for charts

2. **Data Fetching**
   - React Query caching (5 min stale time)
   - Background refetching
   - Optimistic updates

3. **Images**
   - Next.js Image component
   - Automatic WebP conversion
   - Responsive images

4. **Virtual Scrolling**
   - For tables with >100 rows
   - TanStack Virtual

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run in watch mode
pnpm test:watch
```

### Test Coverage Goals

- **Components**: 80%+
- **Hooks**: 90%+
- **Utils**: 95%+

---

## 🚢 Deployment

### Build for Production

```bash
pnpm build
```

### Deploy to Vercel

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel --prod
```

### Environment Variables (Production)

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_APP_URL=https://admin.yourdomain.com
```

---

## 📈 Roadmap

### Phase 1: Foundation (Week 1-2)

- [x] Design system & documentation
- [ ] Project setup with Next.js
- [ ] shadcn/ui components installation
- [ ] Authentication flow
- [ ] Basic layout (Sidebar + Header)

### Phase 2: Core Features (Week 3-4)

- [ ] Dashboard with KPIs & charts
- [ ] Products management (CRUD)
- [ ] Categories management (Tree view)
- [ ] Orders list & detail

### Phase 3: Advanced Features (Week 5-6)

- [ ] Customer management
- [ ] Inventory management
- [ ] Promotions & vouchers
- [ ] Reviews management

### Phase 4: Polish & Optimization (Week 7-8)

- [ ] User roles & permissions
- [ ] Settings page
- [ ] Mobile responsive refinement
- [ ] Performance optimization
- [ ] Testing & bug fixes

### Phase 5: Deployment (Week 9)

- [ ] Production build
- [ ] Deploy to Vercel
- [ ] Documentation finalization
- [ ] Handoff & training

---

## 🤝 Contributing

### Development Workflow

1. Create feature branch from `main`
2. Implement feature with tests
3. Run linter & formatter
4. Submit PR with description
5. Code review & approval
6. Merge to `main`

### Code Style

- Follow Airbnb TypeScript style guide
- Use ESLint + Prettier
- Write meaningful commit messages (Conventional Commits)

---

## 📝 License

MIT License - See [LICENSE](./LICENSE) file for details

---

## 👥 Team

- **UI/UX Designer**: [Your Name]
- **Frontend Architect**: [Your Name]
- **Backend Developer**: [Your Name]
- **QA Engineer**: [Your Name]

---

## 📞 Support

- **Email**: support@yourdomain.com
- **Documentation**: [Link to docs]
- **Issue Tracker**: [GitHub Issues link]

---

## 🙏 Acknowledgments

- **shadcn/ui**: Amazing component library
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Beautiful React charts
- **TanStack Query**: Powerful data synchronization

---

## 📸 Screenshots

### Dashboard

![Dashboard Screenshot](./docs/screenshots/dashboard.png)

### Products Management

![Products Screenshot](./docs/screenshots/products.png)

### Order Detail

![Order Detail Screenshot](./docs/screenshots/order-detail.png)

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
