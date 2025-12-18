# Admin Dashboard - Frontend Architecture

## 🏗️ Technology Stack

### Core Framework

```json
{
  "framework": "Next.js 14 (App Router)",
  "language": "TypeScript 5.3+",
  "runtime": "Node.js 20+",
  "package-manager": "pnpm"
}
```

**Why Next.js?**

- ✅ Server-side rendering cho SEO (nếu cần public pages)
- ✅ API routes tích hợp sẵn
- ✅ File-based routing
- ✅ Image optimization
- ✅ Built-in TypeScript support
- ✅ Fast Refresh development experience

### UI Framework

```json
{
  "library": "shadcn/ui + Radix UI",
  "styling": "Tailwind CSS 3.4",
  "icons": "lucide-react",
  "animations": "framer-motion"
}
```

### State Management

```json
{
  "server-state": "TanStack Query (React Query) v5",
  "client-state": "Zustand (for global UI state)",
  "forms": "React Hook Form + Zod"
}
```

**State Strategy:**

- **Server State**: React Query (products, orders, users từ API)
- **Client State**: Zustand (sidebar collapsed, theme, user preferences)
- **Form State**: React Hook Form (isolated form state)

### Data Fetching

```typescript
// React Query for server state
const { data, isLoading } = useQuery({
  queryKey: ["products"],
  queryFn: fetchProducts,
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Zustand for client state
const useSidebarStore = create((set) => ({
  isCollapsed: false,
  toggle: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
}));
```

### Form Handling

```typescript
// React Hook Form + Zod validation
const schema = z.object({
  name: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  price: z.number().min(0, "Giá phải lớn hơn 0"),
});

const form = useForm<ProductFormData>({
  resolver: zodResolver(schema),
});
```

---

## 📁 Project Structure

```
admin-dashboard/
├── public/
│   ├── fonts/
│   └── images/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth routes (login, register)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   │   ├── layout.tsx     # Main layout with sidebar
│   │   │   ├── page.tsx       # Dashboard home
│   │   │   ├── products/
│   │   │   │   ├── page.tsx              # Product list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx          # Add product
│   │   │   │   ├── [id]/
│   │   │   │   │   └── edit/
│   │   │   │   │       └── page.tsx      # Edit product
│   │   │   │   └── categories/
│   │   │   │       └── page.tsx          # Categories
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx              # Orders list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx          # Order detail
│   │   │   ├── customers/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── inventory/
│   │   │   │   └── page.tsx
│   │   │   ├── promotions/
│   │   │   │   └── page.tsx
│   │   │   ├── reviews/
│   │   │   │   └── page.tsx
│   │   │   ├── users/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   ├── api/               # API routes (if needed)
│   │   │   └── auth/
│   │   │       └── route.ts
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css
│   │   └── providers.tsx      # React Query, Theme providers
│   ├── components/            # Reusable components
│   │   ├── ui/               # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── table.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── layout/           # Layout components
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   └── page-header.tsx
│   │   ├── dashboard/        # Dashboard-specific
│   │   │   ├── kpi-card.tsx
│   │   │   ├── revenue-chart.tsx
│   │   │   ├── orders-table.tsx
│   │   │   └── ...
│   │   ├── products/         # Product-specific
│   │   │   ├── product-table.tsx
│   │   │   ├── product-form.tsx
│   │   │   ├── image-uploader.tsx
│   │   │   └── category-tree.tsx
│   │   ├── orders/           # Order-specific
│   │   │   ├── order-table.tsx
│   │   │   ├── order-timeline.tsx
│   │   │   ├── order-detail.tsx
│   │   │   └── status-badge.tsx
│   │   └── shared/           # Shared components
│   │       ├── data-table.tsx         # Generic table
│   │       ├── search-input.tsx
│   │       ├── date-range-picker.tsx
│   │       ├── file-uploader.tsx
│   │       ├── rich-text-editor.tsx
│   │       └── loading-skeleton.tsx
│   ├── lib/                  # Utilities
│   │   ├── api.ts           # API client setup
│   │   ├── auth.ts          # Auth helpers
│   │   ├── utils.ts         # General utilities
│   │   ├── constants.ts     # App constants
│   │   └── validations.ts   # Zod schemas
│   ├── hooks/               # Custom hooks
│   │   ├── use-auth.ts
│   │   ├── use-products.ts
│   │   ├── use-orders.ts
│   │   ├── use-customers.ts
│   │   ├── use-debounce.ts
│   │   └── use-permissions.ts
│   ├── stores/              # Zustand stores
│   │   ├── sidebar-store.ts
│   │   ├── theme-store.ts
│   │   └── user-store.ts
│   ├── types/               # TypeScript types
│   │   ├── api.ts          # API response types
│   │   ├── models.ts       # Domain models
│   │   └── index.ts
│   └── config/              # Configuration
│       ├── site.ts         # Site config
│       └── navigation.ts   # Navigation menu config
├── .env.local              # Environment variables
├── .eslintrc.json
├── .prettierrc
├── components.json         # shadcn/ui config
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔐 Authentication Flow

```typescript
// src/lib/auth.ts
export const authService = {
  login: async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("Login failed");

    const data = await response.json();
    // Store tokens
    localStorage.setItem("accessToken", data.accessToken);
    // Refresh token in httpOnly cookie (handled by backend)

    return data.user;
  },

  logout: async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("accessToken");
  },

  getAccessToken: () => localStorage.getItem("accessToken"),

  refreshAccessToken: async () => {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include", // Include httpOnly cookie
    });

    if (!response.ok) throw new Error("Refresh failed");

    const data = await response.json();
    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  },
};
```

### Protected Routes

```typescript
// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("refreshToken")?.value;

  // If no token and trying to access dashboard
  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If has token and trying to access login
  if (token && request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

---

## 🔌 API Integration

### API Client Setup

```typescript
// src/lib/api.ts
import axios from "axios";
import { authService } from "./auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Add access token
api.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const newToken = await authService.refreshAccessToken();

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        authService.logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

### React Query Setup

```typescript
// src/app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### API Hooks Example

```typescript
// src/hooks/use-products.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Product, ProductFilters } from "@/types/models";

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const { data } = await api.get<{ products: Product[] }>("/products", {
        params: filters,
      });
      return data.products;
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const { data } = await api.get<{ product: Product }>(`/products/${id}`);
      return data.product;
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Partial<Product>) => {
      const { data } = await api.post("/products", product);
      return data;
    },
    onSuccess: () => {
      // Invalidate products list to refetch
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...product
    }: Partial<Product> & { id: string }) => {
      const { data } = await api.put(`/products/${id}`, product);
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate both list and specific product
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", variables.id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
```

---

## 🎨 Component Patterns

### Generic Data Table

```typescript
// src/components/shared/data-table.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  data,
  columns,
  isLoading,
  onRowClick,
}: DataTableProps<T>) {
  if (isLoading) {
    return <TableSkeleton columns={columns.length} rows={10} />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key as string}>{column.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow
            key={index}
            onClick={() => onRowClick?.(row)}
            className="cursor-pointer hover:bg-gray-50"
          >
            {columns.map((column) => (
              <TableCell key={column.key as string}>
                {column.render ? column.render(row) : row[column.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### Form with React Hook Form

```typescript
// src/components/products/product-form.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function ProductForm({ onSubmit, defaultValues }) {
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên sản phẩm *</FormLabel>
              <Input {...field} placeholder="iPhone 17 256GB" />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá *</FormLabel>
              <Input {...field} type="number" placeholder="24990000" />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
        </Button>
      </form>
    </Form>
  );
}
```

---

## 🔒 Permission-Based Rendering

```typescript
// src/hooks/use-permissions.ts
import { useAuth } from "./use-auth";

export function usePermissions() {
  const { user } = useAuth();

  const can = (permission: string) => {
    if (user?.role === "ADMIN") return true;
    return user?.permissions?.includes(permission) ?? false;
  };

  return { can };
}

// Usage in components
export function ProductActions({ product }) {
  const { can } = usePermissions();

  return (
    <div>
      <Button onClick={() => viewProduct(product.id)}>Xem</Button>

      {can("products.edit") && (
        <Button onClick={() => editProduct(product.id)}>Sửa</Button>
      )}

      {can("products.delete") && (
        <Button variant="destructive" onClick={() => deleteProduct(product.id)}>
          Xóa
        </Button>
      )}
    </div>
  );
}
```

---

## 🚀 Performance Optimization

### Code Splitting

```typescript
// Lazy load heavy components
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(
  () => import("@/components/shared/rich-text-editor"),
  {
    loading: () => <Skeleton className="h-[400px]" />,
    ssr: false, // Don't render on server
  }
);

const RevenueChart = dynamic(
  () => import("@/components/dashboard/revenue-chart"),
  {
    loading: () => <ChartSkeleton />,
  }
);
```

### Image Optimization

```typescript
import Image from "next/image";

<Image
  src={product.image}
  alt={product.name}
  width={200}
  height={200}
  className="rounded-lg"
  placeholder="blur"
  blurDataURL="/placeholder.jpg"
/>;
```

### Virtual Scrolling for Long Lists

```typescript
import { useVirtualizer } from "@tanstack/react-virtual";

export function ProductList({ products }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72, // Row height
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const product = products[virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <ProductRow product={product} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

---

## 📊 Charts Integration

```typescript
// src/components/dashboard/revenue-chart.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

export function RevenueChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
        <YAxis
          stroke="#6B7280"
          fontSize={12}
          tickFormatter={(value) => formatCurrency(value, true)}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;

            return (
              <div className="bg-white p-3 shadow-lg rounded-lg border">
                <p className="text-sm text-gray-600">
                  {payload[0].payload.date}
                </p>
                <p className="text-lg font-bold text-blue-600">
                  {formatCurrency(payload[0].value)}
                </p>
              </div>
            );
          }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#2563EB"
          strokeWidth={2}
          dot={{ fill: "#2563EB", strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

---

## 🧪 Testing Strategy

### Unit Tests (Vitest + Testing Library)

```typescript
// src/components/ui/button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText("Click me")).toBeDisabled();
  });
});
```

### Integration Tests

```typescript
// src/hooks/use-products.test.tsx
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProducts } from "./use-products";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useProducts", () => {
  it("fetches products successfully", async () => {
    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});
```

---

## 📦 Deployment

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Production
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
# NEXT_PUBLIC_APP_URL=https://admin.yourdomain.com
```

### Build & Deploy (Vercel)

```bash
# Install dependencies
pnpm install

# Build for production
pnpm build

# Start production server
pnpm start

# Or deploy to Vercel
vercel --prod
```

---

## 📚 Development Workflow

1. **Setup**

   ```bash
   npx create-next-app@latest admin-dashboard --typescript --tailwind --app
   cd admin-dashboard
   pnpm install
   pnpm dlx shadcn-ui@latest init
   ```

2. **Add Components**

   ```bash
   pnpm dlx shadcn-ui@latest add button input table dialog
   ```

3. **Development**

   ```bash
   pnpm dev
   ```

4. **Code Quality**
   ```bash
   pnpm lint
   pnpm format
   pnpm test
   ```

---

This architecture provides a solid, scalable foundation for building the admin dashboard with modern React patterns and best practices.
