# Admin Dashboard - Screen Design Specification

## 📱 Screen Overview

1. [Layout Structure](#layout-structure)
2. [Dashboard (Trang tổng quan)](#1-dashboard)
3. [Products Management](#2-products-management)
4. [Orders Management](#3-orders-management)
5. [Customers Management](#4-customers-management)
6. [Inventory Management](#5-inventory-management)
7. [Promotions/Vouchers](#6-promotions)
8. [Reviews Management](#7-reviews)
9. [Users & Permissions](#8-users-permissions)
10. [Settings](#9-settings)

---

## Layout Structure

### Global Layout Components

```
┌─────────────────────────────────────────────────────────┐
│                    Header (64px)                        │
│  [☰] [Search............] [🔔3] [Admin ▾]              │
├─────┬───────────────────────────────────────────────────┤
│     │                                                   │
│ S   │              Main Content Area                    │
│ I   │                                                   │
│ D   │                                                   │
│ E   │                                                   │
│ B   │                                                   │
│ A   │                                                   │
│ R   │                                                   │
│     │                                                   │
│     │                                                   │
└─────┴───────────────────────────────────────────────────┘
```

### Header Component

```tsx
Header (z-10, sticky top-0)
├── Left Section
│   ├── Menu Toggle Button (mobile/tablet)
│   └── Logo (desktop only)
├── Middle Section
│   └── Global Search
│       ├── Icon: Search
│       ├── Placeholder: "Tìm kiếm đơn hàng, sản phẩm, khách hàng..."
│       └── Keyboard shortcut: Cmd+K
├── Right Section
│   ├── Notification Icon + Badge
│   │   └── Dropdown: Recent notifications
│   └── User Menu
│       ├── Avatar + Name
│       └── Dropdown
│           ├── Profile
│           ├── Settings
│           └── Logout
```

**Header Specifications:**

- Height: 64px
- Background: white
- Border bottom: 1px gray-200
- Shadow: sm on scroll
- Position: sticky

### Sidebar Component

```tsx
Sidebar (z-20)
├── Logo Section (64px height)
│   └── Logo + Brand Name
├── Navigation Menu
│   ├── Dashboard
│   ├── Products ▾
│   │   ├── All Products
│   │   ├── Add Product
│   │   ├── Categories
│   │   └── Brands
│   ├── Orders
│   ├── Customers
│   ├── Inventory
│   ├── Promotions
│   ├── Reviews
│   ├── Users & Roles
│   └── Settings
└── Footer Section
    └── Collapse/Expand Button
```

**Sidebar Specifications:**

- Width: 256px (expanded) / 64px (collapsed)
- Background: gray-900 (dark theme) hoặc white (light theme)
- Transition: width 200ms
- Mobile: Overlay + backdrop

**Menu Item States:**

```
Default:    text-gray-600 hover:bg-gray-100
Active:     bg-blue-50 text-blue-600 border-l-4 border-blue-600
Hover:      bg-gray-100
Icon size:  20px (lucide-react)
Text:       text-sm font-medium
```

---

## 1. Dashboard

### Layout Grid

```
┌──────────┬──────────┬──────────┬──────────┐
│  KPI 1   │  KPI 2   │  KPI 3   │  KPI 4   │ <- Row 1: KPI Cards
├──────────┴──────────┴──────────┴──────────┤
│                                            │
│          Revenue Chart (Line/Area)         │ <- Row 2: Main Chart
│                                            │
├─────────────────────┬──────────────────────┤
│                     │                      │
│  Order Status       │  Top Products        │ <- Row 3: Stats
│  (Pie Chart)        │  (Bar Chart)         │
│                     │                      │
├─────────────────────┴──────────────────────┤
│                                            │
│      Recent Orders (Table)                 │ <- Row 4: Data Table
│                                            │
└────────────────────────────────────────────┘
```

### Components

#### KPI Cards (Row 1)

```tsx
KPI Card Structure:
├── Icon (32px, colored background)
├── Label (text-sm text-gray-600)
├── Value (text-3xl font-bold text-gray-900)
├── Change Indicator
│   ├── Arrow Icon (up/down)
│   ├── Percentage (text-green-600 or text-red-600)
│   └── Comparison text (text-xs text-gray-500)
└── Loading Skeleton State
```

**4 KPI Cards:**

**Card 1: Revenue Today**

- Icon: TrendingUp (green bg)
- Label: "Doanh thu hôm nay"
- Value: "45.2M đ"
- Change: "+12.5% so với hôm qua"

**Card 2: New Orders**

- Icon: ShoppingCart (blue bg)
- Label: "Đơn hàng mới"
- Value: "28"
- Change: "+5 trong 1h qua"

**Card 3: Low Stock Products**

- Icon: AlertTriangle (amber bg)
- Label: "Sản phẩm sắp hết"
- Value: "7"
- Action: "Xem ngay" link

**Card 4: Total Customers**

- Icon: Users (purple bg)
- Label: "Tổng khách hàng"
- Value: "1,234"
- Change: "+23 tuần này"

#### Revenue Chart (Row 2)

```tsx
Chart Component:
├── Header
│   ├── Title: "Doanh thu"
│   ├── Time Range Selector
│   │   └── Tabs: [7 ngày] [30 ngày] [3 tháng] [1 năm]
│   └── Export Button
├── Chart Area (Recharts Area Chart)
│   ├── X-axis: Dates
│   ├── Y-axis: Revenue (formatted: 10M, 20M)
│   ├── Tooltip: Show exact value + date
│   └── Grid: Horizontal lines
└── Legend
    ├── Doanh thu (blue line)
    └── Đơn hàng (green line)
```

**Chart Specs:**

- Height: 400px
- Type: AreaChart (recharts)
- Colors: blue-500, green-500
- Tooltip: Custom with formatted currency
- Responsive: Mobile shows 7 points max

#### Statistics Row (Row 3)

**Left: Order Status Pie Chart**

```tsx
Pie Chart:
├── Title: "Trạng thái đơn hàng"
├── Chart (Recharts PieChart)
│   ├── Pending: amber-500
│   ├── Processing: blue-500
│   ├── Delivered: green-500
│   ├── Cancelled: red-500
│   └── Labels: Show percentage
└── Legend with counts
```

**Right: Top Products Bar Chart**

```tsx
Bar Chart:
├── Title: "Sản phẩm bán chạy"
├── Chart (Recharts BarChart)
│   ├── Y-axis: Product names (truncate if long)
│   ├── X-axis: Quantity sold
│   ├── Bars: blue-600
│   └── Show top 5 products
└── "Xem tất cả" link
```

#### Recent Orders Table (Row 4)

```tsx
Table:
├── Header
│   ├── Title: "Đơn hàng gần đây"
│   └── "Xem tất cả" button
├── Table Headers
│   ├── Mã đơn
│   ├── Khách hàng
│   ├── Sản phẩm
│   ├── Tổng tiền
│   ├── Trạng thái
│   └── Thao tác
├── Rows (show 10 latest)
│   ├── Order ID (monospace font, clickable)
│   ├── Customer name + avatar
│   ├── Product count (e.g., "3 sản phẩm")
│   ├── Total (formatted currency)
│   ├── Status Badge
│   └── Action: "Xem chi tiết" icon button
└── Empty State (if no orders)
```

**Status Badges:**

- PENDING: amber badge "Chờ xác nhận"
- PROCESSING: blue badge "Đang xử lý"
- DELIVERED: green badge "Đã giao"
- CANCELLED: red badge "Đã hủy"

---

## 2. Products Management

### 2.1 Product List Screen

```
┌────────────────────────────────────────────────────────┐
│  Quản lý sản phẩm                    [+ Thêm sản phẩm] │ <- Page Header
├────────────────────────────────────────────────────────┤
│ [Search.......] [Danh mục ▾] [Hãng ▾] [Giá ▾] [More▾] │ <- Filters
├────────────────────────────────────────────────────────┤
│ ☑ 124 sản phẩm      [Export] [Import]                  │ <- Toolbar
├─────┬──────────────────┬────────┬────────┬───────┬────┤
│ ☑   │ Sản phẩm         │ Giá    │ Tồn kho│ Status│ ⚙️  │ <- Table
├─────┼──────────────────┼────────┼────────┼───────┼────┤
│ ☑   │ [IMG] iPhone 17  │ 24.9M  │ 50     │ ✓ Active│ │
│ ☑   │ [IMG] MacBook... │ 44.9M  │ 20     │ ✓ Active│ │
│ ... │                  │        │        │       │    │
└─────┴──────────────────┴────────┴────────┴───────┴────┘
         Showing 1-20 of 124        [1][2][3]...[7] -> │ <- Pagination
```

#### Page Header

```tsx
Header:
├── Left
│   ├── Title: "Quản lý sản phẩm" (text-2xl font-bold)
│   └── Breadcrumb: Home > Products
└── Right
    └── Primary Button: "+ Thêm sản phẩm"
```

#### Filter Bar

```tsx
Filters (flex gap-3):
├── Search Input
│   ├── Icon: Search
│   ├── Placeholder: "Tìm theo tên, SKU..."
│   └── Debounce: 300ms
├── Category Select
│   ├── Label: "Danh mục"
│   └── Options: Fetch from API
├── Brand Select
│   ├── Label: "Hãng"
│   └── Options: Static list
├── Price Range Select
│   ├── Label: "Giá"
│   └── Options: < 10M, 10-20M, 20-50M, > 50M
└── More Filters (Dropdown)
    ├── Stock Status
    ├── Active/Inactive
    └── Sort by: Price, Name, Date
```

#### Toolbar (Bulk Actions)

```tsx
Toolbar (show when items selected):
├── Checkbox + Count: "☑ 12 sản phẩm đã chọn"
├── Actions
│   ├── Activate/Deactivate
│   ├── Delete
│   └── Change Category
└── Right Actions
    ├── Export Button (CSV/Excel)
    └── Import Button
```

#### Products Table

```tsx
Columns:
1. Checkbox (width: 40px)
2. Product (width: 40%)
   ├── Thumbnail (48x48px, rounded)
   ├── Name (font-medium)
   ├── SKU (text-xs text-gray-500)
   └── Category badge
3. Price (width: 15%)
   ├── Current price (font-semibold)
   └── List price (text-xs line-through)
4. Stock (width: 10%)
   ├── Quantity (font-medium)
   └── Warning if < 10
5. Status (width: 10%)
   └── Toggle switch (Active/Inactive)
6. Actions (width: 10%)
   └── Dropdown Menu
       ├── Edit
       ├── Duplicate
       ├── View
       └── Delete

Row Specs:
- Height: 72px
- Hover: bg-gray-50
- Image: object-cover, fallback icon
- Click row: Navigate to detail
```

#### Empty State

```tsx
Empty State (no products):
├── Icon: Package (large, gray)
├── Heading: "Chưa có sản phẩm nào"
├── Description: "Thêm sản phẩm đầu tiên để bắt đầu"
└── Button: "+ Thêm sản phẩm"
```

### 2.2 Add/Edit Product Screen

```
┌────────────────────────────────────────────────────────┐
│ ← Quay lại      Thêm sản phẩm mới         [Lưu nháp]  │
├─────────────────────────────────┬──────────────────────┤
│                                 │                      │
│  [Tab: Cơ bản]                  │   Product Preview    │
│  [Tab: Thuộc tính]              │                      │
│  [Tab: Hình ảnh]                │   ┌──────────────┐   │
│  [Tab: Mô tả]                   │   │   [Image]    │   │
│  [Tab: SEO]                     │   │              │   │
│                                 │   └──────────────┘   │
│  --- Form Fields ---            │   iPhone 17 256GB    │
│                                 │   24.990.000 đ       │
│                                 │   [✓ Còn hàng]       │
│                                 │                      │
└─────────────────────────────────┴──────────────────────┘
```

#### Layout Structure

```tsx
Layout:
├── Header (sticky)
│   ├── Back Button
│   ├── Title: "Thêm sản phẩm" / "Sửa sản phẩm"
│   └── Actions
│       ├── Save Draft (secondary)
│       └── Publish (primary)
├── Main Content (2 columns)
│   ├── Left (66% width)
│   │   └── Tab Content
│   └── Right (33% width)
│       └── Product Preview Card (sticky)
└── Footer (sticky, mobile only)
    └── Save buttons
```

#### Tab 1: Thông tin cơ bản

```tsx
Form Fields:
├── Product Name *
│   ├── Input: text
│   ├── Max length: 200
│   └── Auto-generate slug
├── Slug (URL-friendly)
│   ├── Input: text
│   ├── Prefix: /product/
│   └── Validation: lowercase, hyphens only
├── SKU
│   ├── Input: text
│   └── Auto-generate option
├── Brand *
│   └── Select: Apple, Samsung, Xiaomi, etc.
├── Category *
│   ├── Select: Hierarchical
│   └── Load from categories API
├── Price *
│   ├── Input: number
│   ├── Format: Currency (VND)
│   └── Min: 0
├── List Price (Original)
│   ├── Input: number
│   └── Show discount % if different
├── Stock Quantity *
│   ├── Input: number
│   └── Min: 0
├── Status
│   └── Radio: Active / Inactive
└── Featured Product
    └── Checkbox: "Hiển thị trên trang chủ"
```

#### Tab 2: Thuộc tính

```tsx
Attributes (Key-Value Pairs):
├── Header
│   ├── Title: "Thông số kỹ thuật"
│   └── "+ Thêm thuộc tính"
└── Attribute List (Dynamic)
    └── Item
        ├── Key Input (e.g., "Màn hình")
        ├── Value Input (e.g., "6.7 inch")
        ├── Drag Handle (reorder)
        └── Delete Button

Example Attributes:
- RAM: 8GB
- ROM: 256GB
- Màn hình: 6.7 inch OLED
- Camera: 48MP + 12MP
- Pin: 4500mAh
- Màu sắc: Titan tự nhiên

UI: Drag-and-drop ordering (dnd-kit)
```

#### Tab 3: Hình ảnh

```tsx
Image Upload:
├── Primary Image *
│   ├── Upload zone (drag & drop)
│   ├── Accepted: jpg, png, webp
│   ├── Max size: 5MB
│   ├── Recommended: 1200x1200px
│   └── Preview with edit/delete
├── Gallery Images
│   ├── Upload multiple (max 10)
│   ├── Drag to reorder
│   ├── Each image has:
│   │   ├── Thumbnail preview
│   │   ├── Set as primary button
│   │   └── Delete button
│   └── Upload progress indicators
└── Image Guidelines
    └── Info box: Best practices for product photos
```

**Upload Component:**

```tsx
Upload Zone:
├── Dropzone (border-dashed, border-2, hover effect)
├── Icon: Upload cloud
├── Text: "Kéo thả ảnh hoặc click để chọn"
├── Subtext: "JPG, PNG, WEBP (max 5MB)"
└── Progress bar (when uploading)
```

#### Tab 4: Mô tả

```tsx
Rich Text Editor:
├── Toolbar
│   ├── Bold, Italic, Underline
│   ├── Headings (H2, H3)
│   ├── Lists (bullet, numbered)
│   ├── Link
│   ├── Image
│   └── Code block
├── Editor Area (min-height: 400px)
└── Character count

Library: Tiptap or Lexical
Features:
- Markdown shortcuts
- Image upload inline
- Collaborative editing (future)
```

#### Tab 5: SEO (Optional)

```tsx
SEO Fields:
├── Meta Title
│   ├── Input: text
│   ├── Max: 60 chars
│   └── Preview snippet
├── Meta Description
│   ├── Textarea
│   ├── Max: 160 chars
│   └── Preview snippet
├── Focus Keyword
│   └── Input: text
└── Preview
    └── Google search result preview
```

#### Product Preview Card (Right Sidebar)

```tsx
Preview Card (sticky):
├── Image (large, aspect-ratio-1)
├── Product Name (text-lg font-semibold)
├── Price
│   ├── Current (text-2xl font-bold text-blue-600)
│   └── Original (line-through text-gray-500)
├── Stock Status
│   ├── Badge: "Còn hàng" (green)
│   └── Quantity: "50 sản phẩm"
├── Category
│   └── Badge: "Điện thoại"
└── Attributes (collapsed list)
    └── Show key specs
```

### 2.3 Categories Management

```
┌────────────────────────────────────────────────────────┐
│  Danh mục sản phẩm                  [+ Thêm danh mục]  │
├───────────────────────┬────────────────────────────────┤
│                       │                                │
│ Category Tree         │  Selected Category Detail      │
│                       │                                │
│ ▾ Điện thoại (45)     │  ┌─ Điện thoại ─────────────┐  │
│   ├─ iPhone (30)      │  │ Slug: phone              │  │
│   └─ Samsung (15)     │  │ Icon: 📱                 │  │
│ ▾ Laptop (25)         │  │ Products: 45             │  │
│   ├─ MacBook (15)     │  │ Status: Active           │  │
│   └─ Surface (10)     │  │                          │  │
│ ▸ Tablet (20)         │  │ [Edit] [Delete]          │  │
│                       │  └──────────────────────────┘  │
└───────────────────────┴────────────────────────────────┘
```

#### Tree View (Left Panel)

```tsx
Category Tree:
├── Tree Component (react-arborist or custom)
├── Node Structure
│   ├── Expand/Collapse icon
│   ├── Category icon (emoji or custom)
│   ├── Name
│   ├── Product count badge
│   └── Actions (hover)
│       ├── Add subcategory
│       ├── Edit
│       └── Delete
├── Features
│   ├── Drag-and-drop to reorder
│   ├── Drag to change parent
│   ├── Infinite nesting support
│   └── Search/filter categories
└── Empty State
    └── "Chưa có danh mục nào"
```

#### Category Detail (Right Panel)

```tsx
Detail Panel:
├── Header
│   ├── Category name (editable inline)
│   └── Status toggle
├── Fields
│   ├── Slug (read-only, auto-generated)
│   ├── Icon (emoji picker or icon selector)
│   ├── Description (textarea)
│   ├── Display Order (number)
│   ├── Parent Category (select)
│   └── Product Count (read-only)
├── Actions
│   ├── Save Changes (primary)
│   ├── Delete Category (danger)
│   └── View Products (link)
└── Warning
    └── "Xóa danh mục sẽ xóa cả danh mục con"
```

---

## 3. Orders Management

### 3.1 Orders List

```
┌────────────────────────────────────────────────────────┐
│  Đơn hàng                                              │
├────────────────────────────────────────────────────────┤
│ [Search] [Status ▾] [Date Range] [Payment ▾] [Export] │
├────────────────────────────────────────────────────────┤
│ [📊 Overview Cards]                                    │
│ ┌──────┬──────┬──────┬──────┐                         │
│ │ Chờ  │ Xử lý│ Giao │ Hủy  │                         │
│ │  12  │  45  │ 234  │  8   │                         │
│ └──────┴──────┴──────┴──────┘                         │
├──────┬────────────┬─────────┬──────────┬──────────────┤
│ ID   │ Khách hàng │ Sản phẩm│ Tổng tiền│ Status       │
├──────┼────────────┼─────────┼──────────┼──────────────┤
│ #1001│ Nguyễn A   │ 3 sp    │ 45.5M    │ [Chờ xác nhận]│
│ #1002│ Trần B     │ 1 sp    │ 24.9M    │ [Đang giao]  │
│ ...  │            │         │          │              │
└──────┴────────────┴─────────┴──────────┴──────────────┘
```

#### Status Overview Cards

```tsx
Cards (grid-cols-4):
├── Pending Card
│   ├── Icon: Clock
│   ├── Label: "Chờ xác nhận"
│   ├── Count: 12
│   └── Click: Filter by status
├── Processing Card
│   └── (similar structure)
├── Delivered Card
└── Cancelled Card
```

#### Orders Table

```tsx
Columns:
1. Order ID (width: 10%)
   ├── Format: #1001
   ├── Monospace font
   └── Clickable link
2. Customer (width: 20%)
   ├── Avatar (32px)
   ├── Name
   └── Email (text-xs)
3. Products (width: 20%)
   ├── Count: "3 sản phẩm"
   ├── Thumbnail previews (stacked)
   └── Hover: Show product names
4. Total (width: 15%)
   ├── Amount (font-semibold)
   └── Payment method icon
5. Status (width: 15%)
   ├── Status badge (colored)
   └── Time ago (text-xs)
6. Date (width: 10%)
   └── Format: DD/MM/YYYY
7. Actions (width: 10%)
   └── View Details button
```

### 3.2 Order Detail Screen

```
┌────────────────────────────────────────────────────────┐
│ ← Quay lại    Đơn hàng #1001              [In đơn]    │
├────────────────────────────────────────────────────────┤
│                                                        │
│ ┌─ Timeline ───────────────────────────────────────┐  │
│ │ ● Đặt hàng      ─●─ Xác nhận    ─○─ Giao hàng   │  │
│ │   12:30 18/12     14:00 18/12       Chưa giao    │  │
│ └──────────────────────────────────────────────────┘  │
│                                                        │
│ ┌─ Thông tin đơn hàng ─────────┬─ Khách hàng ──────┐ │
│ │ Mã đơn: #1001                │ Nguyễn Văn A      │ │
│ │ Ngày đặt: 18/12/2024 12:30   │ 0901234567        │ │
│ │ Thanh toán: COD              │ user@email.com    │ │
│ │ Ghi chú: Giao giờ hành chính │                   │ │
│ └──────────────────────────────┴───────────────────┘ │
│                                                        │
│ ┌─ Sản phẩm ──────────────────────────────────────┐  │
│ │ [IMG] iPhone 17 256GB              24.990.000 đ │  │
│ │       Màu: Titan | x1                           │  │
│ │                                                  │  │
│ │ [IMG] AirPods Pro 3                 5.990.000 đ │  │
│ │       x1                                         │  │
│ │                                                  │  │
│ │ ─────────────────────────────────────────────── │  │
│ │ Tạm tính:                          30.980.000 đ │  │
│ │ Giảm giá (SUMMER24):               -1.000.000 đ │  │
│ │ Phí vận chuyển:                        30.000 đ │  │
│ │ TỔNG CỘNG:                         30.010.000 đ │  │
│ └──────────────────────────────────────────────────┘ │
│                                                        │
│ ┌─ Địa chỉ giao hàng ──────────────────────────────┐ │
│ │ Nguyễn Văn A                                     │ │
│ │ 123 Đường ABC, Phường X, Quận Y, TP.HCM          │ │
│ │ SĐT: 0901234567                                  │ │
│ └──────────────────────────────────────────────────┘ │
│                                                        │
│ [Xác nhận đơn] [Hủy đơn] [In hóa đơn]               │
└────────────────────────────────────────────────────────┘
```

#### Timeline Component

```tsx
Timeline:
├── Steps (horizontal)
│   ├── Step 1: Đặt hàng
│   │   ├── Icon: Circle (filled)
│   │   ├── Label: "Đặt hàng"
│   │   ├── Time: "12:30 18/12"
│   │   └── Status: completed
│   ├── Step 2: Xác nhận
│   │   └── Status: completed
│   ├── Step 3: Đang giao
│   │   └── Status: current
│   └── Step 4: Hoàn thành
│       └── Status: pending
└── Line connector (colored based on progress)
```

#### Action Buttons

```tsx
Actions (based on status):
├── PENDING:
│   ├── Confirm Order (primary)
│   └── Cancel Order (danger)
├── PROCESSING:
│   ├── Mark as Delivered (primary)
│   └── Cancel Order (danger)
├── DELIVERED:
│   └── Issue Refund (secondary)
└── CANCELLED:
    └── View Reason (info)
```

---

## 4. Customers Management

```
┌────────────────────────────────────────────────────────┐
│  Khách hàng                                            │
├────────────────────────────────────────────────────────┤
│ [Search: Email, SĐT...] [Segment ▾] [Export]          │
├──────┬──────────────────┬──────────┬──────────┬───────┤
│Avatar│ Thông tin        │ Đơn hàng │ Tổng chi │ Ngày  │
├──────┼──────────────────┼──────────┼──────────┼───────┤
│ [AV] │ Nguyễn Văn A     │    12    │  45.5M   │18/12  │
│      │ nguyena@mail.com │          │          │       │
├──────┼──────────────────┼──────────┼──────────┼───────┤
│ [AV] │ Trần Thị B       │    5     │  12.3M   │17/12  │
│      │ tranb@mail.com   │          │          │       │
└──────┴──────────────────┴──────────┴──────────┴───────┘
```

### Customer Detail

```
┌────────────────────────────────────────────────────────┐
│ ← Quay lại    Nguyễn Văn A                             │
├──────────────────────────┬─────────────────────────────┤
│ [Avatar - 96px]          │ ┌─ Thống kê ─────────────┐ │
│                          │ │ Tổng đơn hàng: 12      │ │
│ Nguyễn Văn A             │ │ Tổng chi tiêu: 45.5M   │ │
│ nguyena@mail.com         │ │ Đơn trung bình: 3.8M   │ │
│ 0901234567               │ │ Khách hàng từ: 18/12   │ │
│                          │ └────────────────────────┘ │
│ [Edit Profile]           │                            │
├──────────────────────────┴─────────────────────────────┤
│ [Tab: Orders] [Tab: Addresses] [Tab: Notes]            │
├────────────────────────────────────────────────────────┤
│ Order History (Table)                                  │
│ ...                                                    │
└────────────────────────────────────────────────────────┘
```

---

## 5. Inventory Management

```
┌────────────────────────────────────────────────────────┐
│  Quản lý tồn kho                    [+ Nhập hàng]      │
├────────────────────────────────────────────────────────┤
│ [Alert Banner]                                         │
│ ⚠️  7 sản phẩm sắp hết hàng        [Xem ngay]         │
├────────────────────────────────────────────────────────┤
│ [Filters: Search, Category, Stock Level]               │
├──────────────────┬─────────┬─────────┬────────────────┤
│ Sản phẩm         │ Tồn kho │ Đã bán  │ Cập nhật       │
├──────────────────┼─────────┼─────────┼────────────────┤
│ iPhone 17 256GB  │   5     │   45    │ [+] [-] [Edit] │
│ (⚠️ Thấp)        │         │         │                │
├──────────────────┼─────────┼─────────┼────────────────┤
│ MacBook Air M4   │  25     │   15    │ [+] [-] [Edit] │
└──────────────────┴─────────┴─────────┴────────────────┘
```

### Stock Adjustment Modal

```tsx
Modal: Adjust Stock
├── Product Info
│   ├── Thumbnail
│   ├── Name
│   └── Current Stock: 5
├── Adjustment Type
│   ├── Radio: Increase / Decrease / Set exact
│   └── Amount Input
├── Reason (textarea)
│   └── "Nhập hàng mới", "Hàng hỏng", "Kiểm kho"
└── Actions
    ├── Cancel
    └── Save (primary)
```

---

## 6. Promotions

```
┌────────────────────────────────────────────────────────┐
│  Khuyến mãi & Voucher                [+ Tạo mã giảm giá]│
├────────────────────────────────────────────────────────┤
│ [Active] [Scheduled] [Expired]                         │
├────────────┬──────────────┬──────────┬─────────────────┤
│ Mã code    │ Loại         │ Giá trị  │ Trạng thái      │
├────────────┼──────────────┼──────────┼─────────────────┤
│ SUMMER24   │ Giảm giá %   │   10%    │ ● Active        │
│            │ Đơn từ 5M    │          │ 120/500 used    │
├────────────┼──────────────┼──────────┼─────────────────┤
│ FREESHIP   │ Miễn ship    │   30K    │ ⏰ Scheduled    │
│            │              │          │ Start: 20/12    │
└────────────┴──────────────┴──────────┴─────────────────┘
```

### Create Voucher Form

```tsx
Form:
├── Code *
│   ├── Input: UPPERCASE
│   └── Auto-generate button
├── Type *
│   ├── Percentage Discount
│   ├── Fixed Amount
│   └── Free Shipping
├── Value *
│   └── Input: number (% or VND)
├── Conditions
│   ├── Min Order Value
│   ├── Max Discount Amount
│   ├── Applicable Categories
│   └── Applicable Products
├── Usage Limits
│   ├── Total usage limit
│   └── Per customer limit
├── Date Range *
│   ├── Start Date & Time
│   └── End Date & Time
└── Status
    └── Toggle: Active/Inactive
```

---

## 7. Reviews Management

```
┌────────────────────────────────────────────────────────┐
│  Đánh giá sản phẩm                                     │
├────────────────────────────────────────────────────────┤
│ [Pending ⏳ 12] [Approved ✓] [Rejected ✗]             │
├────────────────────────────────────────────────────────┤
│ ┌─ Review Card ──────────────────────────────────────┐│
│ │ ⭐⭐⭐⭐⭐ 5.0                                        ││
│ │ Nguyễn Văn A  •  18/12/2024                        ││
│ │                                                     ││
│ │ "Sản phẩm tuyệt vời, giao hàng nhanh!"             ││
│ │                                                     ││
│ │ Sản phẩm: iPhone 17 256GB                          ││
│ │                                                     ││
│ │ [Approve] [Reject] [Reply]                         ││
│ └─────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────┘
```

---

## 8. Users & Permissions

```
┌────────────────────────────────────────────────────────┐
│  [Tab: Users] [Tab: Roles]                             │
├────────────────────────────────────────────────────────┤
│  Users List                            [+ Add User]    │
├──────────────┬──────────────┬──────────────┬──────────┤
│ User         │ Email        │ Role         │ Status   │
├──────────────┼──────────────┼──────────────┼──────────┤
│ [AV] Admin   │ admin@...    │ Super Admin  │ ● Active │
│ [AV] Staff A │ staff@...    │ Staff        │ ● Active │
└──────────────┴──────────────┴──────────────┴──────────┘
```

### Role Management

```tsx
Roles:
├── Super Admin
│   └── Permissions: ALL
├── Manager
│   └── Permissions: View all, Edit products, orders, customers
├── Staff
│   └── Permissions: View orders, Update order status
└── Accountant
    └── Permissions: View reports, Export data
```

---

## 9. Settings

```
┌────────────────────────────────────────────────────────┐
│  Cài đặt hệ thống                                      │
├────────────────────────────────────────────────────────┤
│ [General] [Payments] [Shipping] [Notifications]       │
├────────────────────────────────────────────────────────┤
│ General Settings                                       │
│                                                        │
│ Store Name: *                                          │
│ [Apple Store Vietnam________________]                  │
│                                                        │
│ Store Email: *                                         │
│ [support@applestore.vn_____________]                   │
│                                                        │
│ Currency:                                              │
│ [VND ▾]                                                │
│                                                        │
│ Timezone:                                              │
│ [Asia/Ho_Chi_Minh ▾]                                   │
│                                                        │
│ [Save Changes]                                         │
└────────────────────────────────────────────────────────┘
```

---

## 📱 Mobile Responsive Adaptations

### Mobile Layout (< 768px)

```
- Sidebar: Hidden, hamburger menu
- Tables: Transform to cards
- KPI Cards: Stack vertically
- Forms: Full width inputs
- Action buttons: Fixed bottom bar
```

### Example: Mobile Order Card

```tsx
Order Card (mobile):
├── Header
│   ├── Order ID + Status badge
│   └── Date
├── Customer Info
│   ├── Avatar + Name
│   └── Phone
├── Products
│   └── "3 sản phẩm" with thumbnails
├── Total Amount (large, bold)
└── Action Button (full width)
```

---

## 🎨 Interaction Patterns

### Loading States

- **Skeleton loaders** for tables and cards
- **Spinner** for button actions
- **Progress bar** for file uploads

### Success/Error Feedback

- **Toast notifications** (Sonner)
- **Inline validation** messages
- **Success animations** (Lottie)

### Confirmations

- **Modal dialogs** for destructive actions
- **Inline confirm** for reversible actions

---

## ⚡ Performance Optimizations

1. **Pagination**: 20 items per page
2. **Virtual scrolling**: Lists > 100 items
3. **Lazy loading**: Charts, images
4. **Debounce**: Search inputs (300ms)
5. **Caching**: React Query with stale-while-revalidate

---

This design specification provides a complete blueprint for implementing the admin dashboard. Next step would be to create the actual React components based on these specifications.
