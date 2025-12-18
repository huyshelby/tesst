# Admin Dashboard - Component Library

## 📦 Component Specifications

This document provides detailed specifications for all reusable components in the admin dashboard.

---

## 1. Layout Components

### 1.1 Sidebar Component

**File:** `src/components/layout/sidebar.tsx`

```typescript
interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps);
```

**Features:**

- Collapsible (256px → 64px)
- Icon-only mode when collapsed
- Active route highlighting
- Nested menu support
- Mobile overlay
- Smooth transitions

**States:**

```typescript
type SidebarState = {
  isCollapsed: boolean;
  activeRoute: string;
  expandedMenus: string[];
};
```

**Example Usage:**

```tsx
<Sidebar isCollapsed={false} onToggle={() => toggleSidebar()} />
```

---

### 1.2 Header Component

**File:** `src/components/layout/header.tsx`

```typescript
interface HeaderProps {
  title?: string;
  searchable?: boolean;
  onSearch?: (query: string) => void;
}

export function Header({ title, searchable, onSearch }: HeaderProps);
```

**Sections:**

- Left: Menu toggle (mobile), Logo
- Center: Global search (Cmd+K)
- Right: Notifications, User menu

**Example:**

```tsx
<Header
  title="Dashboard"
  searchable
  onSearch={(query) => handleSearch(query)}
/>
```

---

### 1.3 Page Header

**File:** `src/components/layout/page-header.tsx`

```typescript
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
}

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
}: PageHeaderProps);
```

**Example:**

```tsx
<PageHeader
  title="Quản lý sản phẩm"
  description="Quản lý toàn bộ sản phẩm trong hệ thống"
  breadcrumbs={[
    { label: "Dashboard", href: "/dashboard" },
    { label: "Sản phẩm", href: "/dashboard/products" },
  ]}
  actions={<Button>+ Thêm sản phẩm</Button>}
/>
```

---

## 2. Data Display Components

### 2.1 Generic Data Table

**File:** `src/components/shared/data-table.tsx`

```typescript
interface Column<T> {
  key: keyof T;
  header: string;
  width?: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  selectable?: boolean;
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
}

export function DataTable<T>({
  data,
  columns,
  isLoading,
  selectable,
  onRowClick,
  onSelectionChange,
}: DataTableProps<T>);
```

**Features:**

- Generic type support
- Sortable columns
- Row selection (single/multiple)
- Custom cell rendering
- Loading skeleton
- Empty state
- Pagination
- Hover effects

**Example:**

```tsx
<DataTable
  data={products}
  columns={[
    {
      key: "name",
      header: "Tên sản phẩm",
      sortable: true,
      render: (product) => (
        <div className="flex items-center gap-3">
          <Image src={product.image} width={40} height={40} />
          <span>{product.name}</span>
        </div>
      ),
    },
    {
      key: "price",
      header: "Giá",
      render: (product) => formatCurrency(product.price),
    },
    {
      key: "stock",
      header: "Tồn kho",
      render: (product) => (
        <Badge variant={product.stock < 10 ? "warning" : "success"}>
          {product.stock}
        </Badge>
      ),
    },
  ]}
  selectable
  onRowClick={(product) => router.push(`/products/${product.id}`)}
  onSelectionChange={(selected) => setSelected(selected)}
/>
```

---

### 2.2 KPI Card

**File:** `src/components/dashboard/kpi-card.tsx`

```typescript
interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    type: "increase" | "decrease";
    label: string;
  };
  loading?: boolean;
  onClick?: () => void;
}

export function KPICard({
  title,
  value,
  icon,
  change,
  loading,
  onClick,
}: KPICardProps);
```

**Example:**

```tsx
<KPICard
  title="Doanh thu hôm nay"
  value="45.2M"
  icon={<TrendingUp className="w-6 h-6" />}
  change={{
    value: 12.5,
    type: "increase",
    label: "so với hôm qua",
  }}
  onClick={() => router.push("/dashboard/revenue")}
/>
```

---

### 2.3 Status Badge

**File:** `src/components/shared/status-badge.tsx`

```typescript
type BadgeVariant = "success" | "warning" | "danger" | "info" | "default";

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({ status, variant, size }: StatusBadgeProps);
```

**Variants:**

```tsx
<StatusBadge status="Active" variant="success" />
<StatusBadge status="Pending" variant="warning" />
<StatusBadge status="Cancelled" variant="danger" />
<StatusBadge status="Processing" variant="info" />
```

---

## 3. Form Components

### 3.1 Search Input

**File:** `src/components/shared/search-input.tsx`

```typescript
interface SearchInputProps {
  placeholder?: string;
  debounceMs?: number;
  onSearch: (query: string) => void;
  shortcut?: string; // e.g., "Cmd+K"
}

export function SearchInput({
  placeholder,
  debounceMs = 300,
  onSearch,
  shortcut,
}: SearchInputProps);
```

**Features:**

- Debounced input
- Clear button
- Loading indicator
- Keyboard shortcut display
- Global shortcut handler

**Example:**

```tsx
<SearchInput
  placeholder="Tìm kiếm sản phẩm..."
  debounceMs={300}
  onSearch={(query) => fetchProducts({ search: query })}
  shortcut="Cmd+K"
/>
```

---

### 3.2 File Uploader

**File:** `src/components/shared/file-uploader.tsx`

```typescript
interface FileUploaderProps {
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
  multiple?: boolean;
  value?: File[];
  onChange: (files: File[]) => void;
  onError?: (error: string) => void;
}

export function FileUploader({
  accept = "image/*",
  maxSize = 5,
  maxFiles = 10,
  multiple = false,
  value,
  onChange,
  onError,
}: FileUploaderProps);
```

**Features:**

- Drag & drop
- File preview
- Progress indicator
- Validation (size, type)
- Multiple files
- Reorder (drag-and-drop)

**Example:**

```tsx
<FileUploader
  accept="image/jpeg,image/png,image/webp"
  maxSize={5}
  maxFiles={10}
  multiple
  value={images}
  onChange={(files) => setImages(files)}
  onError={(error) => toast.error(error)}
/>
```

---

### 3.3 Rich Text Editor

**File:** `src/components/shared/rich-text-editor.tsx`

```typescript
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  minHeight = 400,
}: RichTextEditorProps);
```

**Library:** Tiptap

**Features:**

- Bold, Italic, Underline
- Headings (H1-H6)
- Lists (bullet, ordered)
- Links
- Images
- Code blocks
- Markdown shortcuts

**Example:**

```tsx
<RichTextEditor
  value={description}
  onChange={(value) => setDescription(value)}
  placeholder="Nhập mô tả sản phẩm..."
  minHeight={400}
/>
```

---

### 3.4 Date Range Picker

**File:** `src/components/shared/date-range-picker.tsx`

```typescript
interface DateRange {
  from: Date;
  to: Date;
}

interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange) => void;
  presets?: DateRangePreset[];
}

export function DateRangePicker({
  value,
  onChange,
  presets,
}: DateRangePickerProps);
```

**Presets:**

- Hôm nay
- 7 ngày qua
- 30 ngày qua
- Tháng này
- Tháng trước
- Custom range

**Example:**

```tsx
<DateRangePicker
  value={dateRange}
  onChange={(range) => setDateRange(range)}
  presets={[
    { label: "Hôm nay", getDates: () => ({ from: today, to: today }) },
    {
      label: "7 ngày qua",
      getDates: () => ({ from: sevenDaysAgo, to: today }),
    },
  ]}
/>
```

---

## 4. Charts Components

### 4.1 Revenue Chart

**File:** `src/components/dashboard/revenue-chart.tsx`

```typescript
interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

interface RevenueChartProps {
  data: RevenueData[];
  isLoading?: boolean;
  timeRange: "7d" | "30d" | "3m" | "1y";
  onTimeRangeChange: (range: string) => void;
}

export function RevenueChart({
  data,
  isLoading,
  timeRange,
  onTimeRangeChange,
}: RevenueChartProps);
```

**Chart Type:** Area Chart (Recharts)

**Example:**

```tsx
<RevenueChart
  data={revenueData}
  isLoading={isLoading}
  timeRange={timeRange}
  onTimeRangeChange={(range) => setTimeRange(range)}
/>
```

---

### 4.2 Order Status Pie Chart

**File:** `src/components/dashboard/order-status-chart.tsx`

```typescript
interface OrderStatusData {
  status: string;
  count: number;
  color: string;
}

interface OrderStatusChartProps {
  data: OrderStatusData[];
  isLoading?: boolean;
}

export function OrderStatusChart({ data, isLoading }: OrderStatusChartProps);
```

**Example:**

```tsx
<OrderStatusChart
  data={[
    { status: "Pending", count: 12, color: "#F59E0B" },
    { status: "Processing", count: 45, color: "#3B82F6" },
    { status: "Delivered", count: 234, color: "#10B981" },
    { status: "Cancelled", count: 8, color: "#EF4444" },
  ]}
/>
```

---

## 5. Product Components

### 5.1 Product Table

**File:** `src/components/products/product-table.tsx`

```typescript
interface ProductTableProps {
  products: Product[];
  isLoading?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export function ProductTable({
  products,
  isLoading,
  selectedIds,
  onSelectionChange,
  onEdit,
  onDelete,
}: ProductTableProps);
```

**Features:**

- Product thumbnail
- Price with discount
- Stock status indicator
- Category badge
- Quick actions (edit, delete, view)
- Bulk actions

---

### 5.2 Product Form

**File:** `src/components/products/product-form.tsx`

```typescript
interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel?: () => void;
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps);
```

**Tabs:**

1. Thông tin cơ bản
2. Thuộc tính
3. Hình ảnh
4. Mô tả
5. SEO

**Validation:** Zod schema

---

### 5.3 Category Tree

**File:** `src/components/products/category-tree.tsx`

```typescript
interface CategoryTreeProps {
  categories: Category[];
  selectedId?: string;
  onSelect: (category: Category) => void;
  onAdd?: (parentId?: string) => void;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
}

export function CategoryTree({
  categories,
  selectedId,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
}: CategoryTreeProps);
```

**Features:**

- Hierarchical tree view
- Expand/collapse nodes
- Drag-and-drop reorder
- Inline add/edit
- Product count badges

---

## 6. Order Components

### 6.1 Order Table

**File:** `src/components/orders/order-table.tsx`

```typescript
interface OrderTableProps {
  orders: Order[];
  isLoading?: boolean;
  onRowClick?: (order: Order) => void;
}

export function OrderTable({ orders, isLoading, onRowClick }: OrderTableProps);
```

**Columns:**

- Order ID (clickable)
- Customer (avatar + name)
- Products (count + thumbnails)
- Total amount
- Status badge
- Date
- Actions

---

### 6.2 Order Timeline

**File:** `src/components/orders/order-timeline.tsx`

```typescript
interface OrderTimelineProps {
  order: Order;
}

export function OrderTimeline({ order }: OrderTimelineProps);
```

**Steps:**

1. Đặt hàng
2. Xác nhận
3. Đang giao
4. Hoàn thành

**States:**

- Completed (filled circle, blue)
- Current (filled circle, blue, pulsing)
- Pending (empty circle, gray)

---

### 6.3 Order Detail Card

**File:** `src/components/orders/order-detail-card.tsx`

```typescript
interface OrderDetailCardProps {
  order: Order;
  onStatusChange?: (status: OrderStatus) => void;
  onPrint?: () => void;
}

export function OrderDetailCard({
  order,
  onStatusChange,
  onPrint,
}: OrderDetailCardProps);
```

**Sections:**

- Timeline
- Order info (ID, date, payment)
- Customer info
- Products list
- Pricing breakdown
- Shipping address
- Action buttons

---

## 7. Loading & Empty States

### 7.1 Table Skeleton

**File:** `src/components/shared/table-skeleton.tsx`

```typescript
interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

export function TableSkeleton({ columns, rows = 10 }: TableSkeletonProps);
```

---

### 7.2 Empty State

**File:** `src/components/shared/empty-state.tsx`

```typescript
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps);
```

**Example:**

```tsx
<EmptyState
  icon={<Package className="w-12 h-12 text-gray-400" />}
  title="Chưa có sản phẩm nào"
  description="Thêm sản phẩm đầu tiên để bắt đầu bán hàng"
  action={{
    label: "+ Thêm sản phẩm",
    onClick: () => router.push("/products/new"),
  }}
/>
```

---

## 8. Feedback Components

### 8.1 Confirm Dialog

**File:** `src/components/shared/confirm-dialog.tsx`

```typescript
interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  onConfirm: () => void | Promise<void>;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  variant = "default",
  onConfirm,
}: ConfirmDialogProps);
```

**Example:**

```tsx
<ConfirmDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Xóa sản phẩm"
  description="Bạn có chắc muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
  confirmLabel="Xóa"
  variant="danger"
  onConfirm={async () => {
    await deleteProduct(product.id);
    toast.success("Đã xóa sản phẩm");
  }}
/>
```

---

## 9. Utility Hooks

### 9.1 useDebounce

```typescript
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
```

---

### 9.2 usePermissions

```typescript
export function usePermissions() {
  const { user } = useAuth();

  const can = (permission: string): boolean => {
    if (user?.role === "ADMIN") return true;
    return user?.permissions?.includes(permission) ?? false;
  };

  return { can, role: user?.role };
}
```

---

### 9.3 usePagination

```typescript
interface UsePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
}

export function usePagination({
  totalItems,
  itemsPerPage,
  initialPage = 1,
}: UsePaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const previousPage = () => goToPage(currentPage - 1);

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    previousPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
}
```

---

## 10. Utility Functions

### 10.1 Format Currency

```typescript
export function formatCurrency(amount: number, short: boolean = false): string {
  if (short && amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M`;
  }

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Examples:
// formatCurrency(24990000) => "24.990.000 ₫"
// formatCurrency(24990000, true) => "25.0M"
```

---

### 10.2 Format Date

```typescript
export function formatDate(
  date: string | Date,
  format: "short" | "long" | "relative" = "short"
): string {
  const d = typeof date === "string" ? new Date(date) : date;

  if (format === "relative") {
    const diff = Date.now() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Hôm nay";
    if (days === 1) return "Hôm qua";
    if (days < 7) return `${days} ngày trước`;
    if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
    return `${Math.floor(days / 30)} tháng trước`;
  }

  if (format === "long") {
    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(d);
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

// Examples:
// formatDate('2024-12-18') => "18/12/2024"
// formatDate('2024-12-18', 'long') => "Thứ Tư, 18 tháng 12, 2024 lúc 14:30"
// formatDate('2024-12-17', 'relative') => "Hôm qua"
```

---

This component library provides all the building blocks needed to implement the admin dashboard efficiently with consistent patterns and reusable components.
