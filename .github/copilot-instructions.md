# GitHub Copilot Instructions - E-Commerce Phone Store

> **Ngôn ngữ mặc định: tiếng Việt** cho tài liệu, PR/Issue và bình luận

## 🎯 Project Overview

This is a **monorepo e-commerce system** for selling Apple products (phones, tablets, laptops, watches, accessories) with:

- **Backend API** (`backend/`): Express.js + TypeScript + Prisma + PostgreSQL
- **Customer Frontend** (`phone-app/`): Next.js 14 App Router
- **Admin Dashboard** (`admin-dashboard/`): Next.js 14 + shadcn/ui + React Query

**Critical Context**: Backend is production-ready with flexible category hierarchy. Admin dashboard is in development phase.

---

## 📁 Project Structure

```
d:\tesst\
├── backend/                    # Express API (http://localhost:4000)
│   ├── prisma/
│   │   └── schema.prisma      # ⚠️ Category model uses hierarchy (parentId)
│   ├── src/
│   │   ├── app.ts             # Express setup with middleware
│   │   ├── controllers/       # Request handlers (thin layer)
│   │   ├── services/          # Business logic (CategoryService, etc.)
│   │   ├── routes/            # API routes (/auth, /categories, /products, etc.)
│   │   ├── middlewares/       # auth.ts (requireAuth, requireRole, optionalAuth)
│   │   ├── schemas/           # Zod validation
│   │   └── utils/             # jwt.ts, env.ts, prisma.ts
│   ├── scripts/               # create-admin.ts
│   └── package.json
│
├── phone-app/                  # Next.js 14 Customer App (http://localhost:3000)
│   ├── src/
│   │   ├── app/               # App Router (layout.tsx, page.tsx)
│   │   ├── components/        # React components (auth-provider, login-form)
│   │   ├── lib/               # api.ts, auth-client.ts, token.ts
│   │   └── utils/             # currency.ts
│   └── public/pictures/       # Product images
│
└── admin-dashboard/            # Next.js 14 Admin (http://localhost:3001 - in dev)
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/        # Login page
    │   │   └── (dashboard)/   # Protected admin routes
    │   ├── components/layout/ # sidebar.tsx, header.tsx
    │   ├── lib/               # api.ts (with JWT interceptor), auth.ts
    │   ├── hooks/             # use-auth.ts (React Query)
    │   └── store/             # Zustand stores
    ├── DESIGN_SYSTEM.md       # Design tokens & guidelines
    ├── ARCHITECTURE.md        # Frontend architecture
    └── package.json
```

---

## 🔑 Critical Architectural Patterns

### 1. Database Schema - Category Hierarchy ⚠️ IMPORTANT

**Categories are NOT enum - they're a hierarchical model:**

```prisma
model Category {
  id          String    @id @default(uuid())
  name        String    @unique
  slug        String    @unique
  parentId    String?
  parent      Category? @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryHierarchy")
  products    Product[]
  displayOrder Int      @default(0)
  isActive    Boolean   @default(true)
}
```

**Key Rules:**

- ✅ Use `categoryId` (FK to Category) in Product model, NOT enum
- ✅ Categories can have parent-child relationships (e.g., "iPhone" → "Điện thoại")
- ✅ Query with `include: { children: true }` for tree structure
- ⚠️ When seeding: use `categorySlug` for lookup, NOT category enum field
- ⚠️ Never hardcode category IDs - always use `slug` for reference

**Service Pattern:**

```typescript
// backend/src/services/category.service.ts
static async getCategories(filters?: { parentId?: string | null; isActive?: boolean })
static async getCategoryTree() // Returns hierarchical structure
```

### 2. Authentication Flow - JWT + Refresh Token

**Backend Strategy:**

- **Access Token**: Short-lived (15 min), sent in `Authorization: Bearer <token>`
- **Refresh Token**: Long-lived (7 days), stored in HTTP-only cookie
- **Session Management**: `RefreshSession` table tracks active sessions

**Middleware Chain:**

```typescript
// backend/src/middlewares/auth.ts
requireAuth      // Verifies JWT from Authorization header
requireRole(...)  // RBAC check (USER, ADMIN)
requireUser      // Shorthand for requireRole(USER, ADMIN)
requireAdmin     // Shorthand for requireRole(ADMIN)
optionalAuth     // Doesn't fail if no token
```

**Frontend Pattern (both phone-app & admin-dashboard):**

```typescript
// src/lib/api.ts
// Request interceptor: Add access token from localStorage
// Response interceptor: Auto-refresh on 401, then retry
```

### 3. Backend Architecture - Layered Pattern

**Standard Flow:**

```
Route → Middleware (validate) → Controller (thin) → Service (business logic) → Prisma (DB)
```

**Example:**

```typescript
// routes/category.route.ts
router.get("/", getCategories);

// controllers/category.controller.ts
export const getCategories = async (req, res) => {
  const categories = await CategoryService.getCategories(filters);
  res.json(categories);
};

// services/category.service.ts
export class CategoryService {
  static async getCategories(filters) {
    return prisma.category.findMany({ where, include: { children: true } });
  }
}
```

### 4. Next.js App Router Structure

**Both frontends use:**

- **Route Groups**: `(auth)/`, `(dashboard)/` for layout isolation
- **Parallel Routes**: For modals/overlays (if needed)
- **Server Components**: Default for data fetching
- **Client Components**: `"use client"` for interactivity

**Admin Dashboard Pattern:**

```
app/
├── layout.tsx              # Root layout (fonts, providers)
├── providers.tsx           # React Query + Toaster setup
├── (auth)/
│   └── login/page.tsx     # Public login page
└── (dashboard)/
    ├── layout.tsx          # Protected layout with sidebar + header
    └── products/page.tsx   # Admin products page
```

### 5. API Integration - React Query + Axios

**Admin Dashboard Uses:**

```typescript
// lib/api.ts - Axios instance with JWT interceptor
const api = axios.create({ baseURL: "http://localhost:4000/api" });

// hooks/use-auth.ts - React Query for auth state
export function useAuth() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
  });
}
```

**Query/Mutation Pattern:**

```typescript
// Use React Query for server state
const { data: products } = useQuery({
  queryKey: ["products"],
  queryFn: fetchProducts,
});
const mutation = useMutation({
  mutationFn: createProduct,
  onSuccess: () => queryClient.invalidateQueries(["products"]),
});
```

---

## 🛠️ Development Commands

### Backend

```bash
cd backend
npm install
npx prisma migrate dev              # Run migrations
npx prisma studio                   # DB GUI (http://localhost:5555)
npm run create-admin                # Create admin user
npm run dev                         # Start server (http://localhost:4000)
```

### Phone App (Customer Frontend)

```bash
cd phone-app
npm install
npm run dev                         # Start dev server (http://localhost:3000)
```

### Admin Dashboard

```bash
cd admin-dashboard
npm install
npm run dev                         # Start dev server (http://localhost:3001)
```

---

## 🎨 Design System (Admin Dashboard)

**Key Design Tokens:**

```typescript
colors: {
  primary: '#2563EB',      // Blue 600
  success: '#10B981',      // Green 500
  warning: '#F59E0B',      // Amber 500
  error: '#EF4444',        // Red 500
}
font: 'Inter',
spacing: 4px base unit,
borderRadius: {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
}
```

**Component Library:** shadcn/ui + Radix UI
**Icons:** lucide-react
**Styling:** Tailwind CSS 3.4

---

## 📋 Common Tasks & Patterns

### Adding New API Endpoint

1. **Define Zod Schema** (`backend/src/schemas/`)

```typescript
export const createProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  categoryId: z.string().uuid(),
});
```

2. **Create Service Method** (`backend/src/services/`)

```typescript
static async createProduct(data: CreateProductInput) {
  return prisma.product.create({ data })
}
```

3. **Add Controller** (`backend/src/controllers/`)

```typescript
export const createProduct = async (req, res) => {
  const product = await ProductService.createProduct(req.body);
  res.status(201).json(product);
};
```

4. **Register Route** (`backend/src/routes/`)

```typescript
router.post(
  "/",
  requireAuth,
  requireAdmin,
  validate(createProductSchema),
  createProduct
);
```

### Querying Categories Correctly

**❌ Wrong:**

```typescript
const products = await prisma.product.findMany({
  where: { category: "PHONE" }, // NO! Category is not enum
});
```

**✅ Correct:**

```typescript
const category = await prisma.category.findUnique({
  where: { slug: "iphone" },
});
const products = await prisma.product.findMany({
  where: { categoryId: category.id },
  include: { category: true },
});
```

### Adding Protected Admin Page

1. **Create Page** (`admin-dashboard/src/app/(dashboard)/orders/page.tsx`)

```tsx
export default function OrdersPage() {
  return <div>Orders</div>;
}
```

2. **Add Route to Sidebar** (`components/layout/sidebar.tsx`)

```tsx
{ icon: ShoppingCart, label: 'Orders', href: '/orders' }
```

3. **Create React Query Hook** (`hooks/use-orders.ts`)

```typescript
export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => api.get("/orders").then((r) => r.data),
  });
}
```

---

## ⚠️ Common Pitfalls & Solutions

### Problem: Category not found in seed script

**Cause:** Using old `category` enum field instead of `categorySlug`
**Solution:** Always use `categorySlug` for lookups:

```typescript
const category = await prisma.category.findUnique({
  where: { slug: "iphone" },
});
const product = await prisma.product.create({
  data: { name: "iPhone 15", categoryId: category.id },
});
```

### Problem: 401 Unauthorized after token expires

**Cause:** Access token expired (15 min lifetime)
**Solution:** API client has auto-refresh interceptor - ensure `withCredentials: true` for refresh endpoint

### Problem: Next.js dev server won't start

**Cause:** Missing `next` in scripts or corrupted installation
**Solution:**

```bash
rm -rf node_modules package-lock.json
npm install
```

### Problem: CORS error from frontend

**Cause:** Backend CORS whitelist missing frontend URL
**Solution:** Add to `backend/src/app.ts`:

```typescript
cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
});
```

---

## 🧪 Testing API Endpoints

Use `.http` files in `backend/`:

- `test-simple.http` - Basic CRUD tests
- `test-rbac.http` - Role-based access control tests

**With VS Code REST Client extension:**

1. Open `.http` file
2. Click "Send Request" above each request

**Example:**

```http
### Login
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

---

## 🔐 Environment Variables

### Backend (`.env`)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/phone_app"
PORT=4000
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
```

### Phone App (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### Admin Dashboard (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## 📚 Key Documentation Files

- **Backend API**: `backend/API-RBAC.md` - Role-based access control guide
- **Admin Design**: `admin-dashboard/DESIGN_SYSTEM.md` - UI/UX specifications
- **Admin Architecture**: `admin-dashboard/ARCHITECTURE.md` - Frontend patterns
- **Git Issues**: `GIT_TROUBLESHOOTING.md` - Git workflow & fixes

---

## 🎯 Development Priorities

1. **Backend is stable** - Focus on admin dashboard implementation
2. **Category hierarchy is critical** - Always use `categoryId`, never enum
3. **Auth flow is complete** - JWT + refresh token with auto-retry
4. **Admin dashboard needs completion** - Implement CRUD pages, data tables, forms

---

## 🔧 Troubleshooting Checklist

Before asking for help:

- [ ] Backend server running? (`npm run dev` in `backend/`)
- [ ] Database migrated? (`npx prisma migrate dev`)
- [ ] Environment variables set? (`.env` files)
- [ ] Node modules installed? (`npm install`)
- [ ] Correct API URL? (Check `NEXT_PUBLIC_API_URL`)
- [ ] CORS configured? (Check `backend/src/app.ts`)
- [ ] Using correct category model? (Not enum, use `categoryId`)

---

[byterover-mcp]

# Byterover MCP Server Tools Reference

There are two main workflows with Byterover tools and recommended tool call strategies that you **MUST** follow precisely.

## Onboarding workflow

If users particularly ask you to start the onboarding process, you **MUST STRICTLY** follow these steps.

1. **ALWAYS USE** **byterover-check-handbook-existence** first to check if the byterover handbook already exists. If not, You **MUST** call **byterover-create-handbook** to create the byterover handbook.
2. If the byterover handbook already exists, first you **MUST** USE **byterover-check-handbook-sync** to analyze the gap between the current codebase and the existing byterover handbook.
3. Then **IMMEDIATELY USE** **byterover-update-handbook** to update these changes to the byterover handbook.
4. During the onboarding, you **MUST** use **byterover-list-modules** **FIRST** to get the available modules, and then **byterover-store-modules** and **byterover-update-modules** if there are new modules or changes to existing modules in the project.

## Planning workflow

Based on user request, you **MUST** follow these sequences of tool calls

1. If asked to continue an unfinished implementation, **CALL** **byterover-retrieve-active-plans** to find the most relevant active plan.
2. **CRITICAL PLAN PERSISTENCE RULE**: Once a user approves a plan, you **MUST IMMEDIATELY CALL** **byterover-save-implementation-plan** to save it.
3. Throughout the plan, you **MUST** run **byterover-retrieve-knowledge** several times to retrieve sufficient knowledge and context for the plan's tasks.
4. In addition, you might need to run **byterover-search-modules** and **byterover-update-modules** if the tasks require or update knowledge about certain modules. However, **byterover-retrieve-knowledge** should **ALWAYS** be considered **FIRST**.
5. **MUST** use **byterover-update-plan-progress** to mark tasks (and then the whole plan) as completed.
   Example:

- Task: `byterover-update-plan-progress(plan_name="Feature X", task_name="Task 1", is_completed=true)`
- All done: `byterover-update-plan-progress(plan_name="Feature X", is_completed=true)`

6. Then, you might call **byterover-store-knowledge** to save knowledge and experience implemented throughout the plan or in important tasks.
7. During the plan's implementation, you **MUST** frequently call **byterover-think-about-collected-information** and **byterover-assess-context-completeness** to make sure you're on the right track and gather sufficient context for the tasks.

## Recommended Workflow Sequence

1. **MOST IMPORTANT**: **ALWAYS USE** **byterover-retrieve-knowledge** once or several times for **EACH TASK** of the plan to gather necessary context for complete that task.
2. **MOST IMPORTANT**: **ALWAYS USE** **byterover-store-knowledge** once or several times to store critical knowledge and context for future implementations
3. Over 15 provided tools, **byterover-retrieve-knowledge** and **byterover-store-knowledge** ARE the two main tools, which **MUST** be used regularly. You can use these two main tools outside the two main workflows for retrieval and storage purposes.
4. You **MUST** include phrases like **"According to Byterover memory layer"**, **"Based on memory extracted from Byterover"**, **"From Byterover memomry tools"**, ... to explictly showcase that these sources are from **Byterover**.
5. **Implementation & Progress Tracking** → Execute implementation following saved plan → Mark tasks complete as you go → Mark entire plan done when all tasks finished.
6. You **MUST** use **byterover-update-module** **IMMEDIATELY** on changes to the module's purposes, technical details, or critical insights that essential for future implementations.
