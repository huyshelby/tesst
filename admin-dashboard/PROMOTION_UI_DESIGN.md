# Thiết kế UI/UX - Trang Quản Lý Khuyến Mãi

## 🎯 Tổng quan

Trang quản lý khuyến mãi/voucher cho phép admin tạo, chỉnh sửa và theo dõi các chương trình giảm giá.

---

## 📐 Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ [Header: Tiêu đề + Nút "Tạo khuyến mãi"]                    │
├─────────────────────────────────────────────────────────────┤
│ [Filter Bar Card]                                            │
│  - Search                                                    │
│  - Type dropdown                                             │
│  - Status dropdown                                           │
│  - Date range picker                                         │
│  - Reset button                                              │
├─────────────────────────────────────────────────────────────┤
│ [Statistics Cards Row]                                       │
│  - Total Active  - Total Usage  - Revenue Saved             │
├─────────────────────────────────────────────────────────────┤
│ [Promotions Table Card]                                      │
│  - Table with sorting                                        │
│  - Action buttons per row                                    │
│  - Pagination                                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Design Specifications

### 1. PAGE HEADER

**Layout:**

```
┌─────────────────────────────────────────────────────┐
│  Khuyến mãi                      [+ Tạo khuyến mãi] │
│  Quản lý các chương trình giảm giá                  │
└─────────────────────────────────────────────────────┘
```

**Specs:**

- **Title**: `text-3xl font-bold text-gray-900`
- **Description**: `text-gray-600 mt-1`
- **Button**: Primary button với icon Plus
- **Spacing**: `space-y-6` wrapper

---

### 2. FILTER BAR

**Layout:**

```
┌────────────────────────────────────────────────────────────┐
│ 🔍 Bộ lọc                                                   │
├────────────────────────────────────────────────────────────┤
│ [Search input]  [Loại ▼]  [Trạng thái ▼]  [Thời gian ▼] [×] │
└────────────────────────────────────────────────────────────┘
```

**Components:**

**Search Input:**

- Icon: `Search` (lucide-react)
- Placeholder: "Tìm theo mã hoặc tên chương trình..."
- Class: `pl-9` cho icon padding

**Type Dropdown (Loại giảm giá):**

- Options:
  - `all` - "Tất cả"
  - `PERCENTAGE` - "Giảm phần trăm (%)"
  - `FIXED_AMOUNT` - "Giảm cố định (VNĐ)"

**Status Dropdown (Trạng thái):**

- Options:
  - `all` - "Tất cả"
  - `ACTIVE` - "Đang chạy"
  - `EXPIRED` - "Hết hạn"
  - `PAUSED` - "Tạm dừng"

**Date Range Picker:**

- Format: DD/MM/YYYY - DD/MM/YYYY
- Icon: `Calendar`

**Reset Button:**

- Icon only: `X`
- Variant: Ghost
- Tooltip: "Xóa bộ lọc"

**Card Styling:**

- `bg-white rounded-lg shadow p-4 space-y-4`
- Grid: `grid-cols-1 md:grid-cols-5 gap-4`

---

### 3. STATISTICS CARDS

```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ 📊 Đang hoạt động │  │ 🎟️ Lượt sử dụng  │  │ 💰 Tiết kiệm     │
│                  │  │                  │  │                  │
│      12          │  │     8,542        │  │  125.5M VNĐ      │
│ campaigns        │  │  usages          │  │  saved           │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

**Specs:**

- Grid: `grid-cols-1 md:grid-cols-3 gap-4`
- Card: `bg-white rounded-lg shadow p-6`
- Icon size: `w-10 h-10`
- Number: `text-3xl font-bold text-gray-900`
- Label: `text-sm text-gray-600 mt-1`

**Icon Colors:**

- Active: `text-green-500`
- Usage: `text-blue-500`
- Revenue: `text-amber-500`

---

### 4. PROMOTIONS TABLE

**Columns:**

| Column           | Width | Content            | Sortable |
| ---------------- | ----- | ------------------ | -------- |
| Tên chương trình | 20%   | Text + Description | ✓        |
| Mã voucher       | 12%   | Code badge         | ✗        |
| Loại giảm        | 10%   | Badge              | ✓        |
| Giá trị          | 10%   | Number             | ✓        |
| Thời gian        | 15%   | Date range         | ✓        |
| Sử dụng          | 12%   | Progress bar       | ✓        |
| Trạng thái       | 10%   | Status badge       | ✓        |
| Hành động        | 11%   | Action buttons     | ✗        |

**Cell Details:**

**1. Tên chương trình:**

```tsx
<div>
  <div className="font-medium text-gray-900">Giảm giá cuối năm</div>
  <div className="text-sm text-gray-500">Áp dụng cho đơn từ 5M</div>
</div>
```

**2. Mã voucher:**

```tsx
<Badge variant="outline" className="font-mono">
  NEWYEAR2025
</Badge>
```

**3. Loại giảm:**

- `PERCENTAGE`: Badge màu tím (`bg-purple-100 text-purple-800`)
- `FIXED_AMOUNT`: Badge màu xanh dương (`bg-blue-100 text-blue-800`)

**4. Giá trị:**

- Percentage: "20%" (`text-purple-700 font-semibold`)
- Fixed: "50,000đ" (`text-blue-700 font-semibold`)

**5. Thời gian:**

```tsx
<div className="text-sm">
  <div>15/12/2024</div>
  <div className="text-gray-500">→ 15/01/2025</div>
</div>
```

**6. Sử dụng (Progress Bar):**

```tsx
<div className="space-y-1">
  <div className="flex justify-between text-xs">
    <span className="text-gray-600">45/100</span>
    <span className="text-gray-500">45%</span>
  </div>
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }} />
  </div>
</div>
```

**7. Trạng thái (Status Badges):**

| Status  | Badge Style                                         |
| ------- | --------------------------------------------------- |
| ACTIVE  | `bg-green-100 text-green-800` + icon `CheckCircle2` |
| EXPIRED | `bg-gray-100 text-gray-800` + icon `Clock`          |
| PAUSED  | `bg-amber-100 text-amber-800` + icon `PauseCircle`  |

```tsx
<Badge variant={getVariant(status)} className="gap-1">
  <Icon className="w-3 h-3" />
  {label}
</Badge>
```

**8. Hành động (Actions):**

```tsx
<div className="flex items-center gap-2">
  {status === 'ACTIVE' && (
    <Button variant="ghost" size="sm">
      <Pause className="w-4 h-4" />
    </Button>
  )}
  {status === 'PAUSED' && (
    <Button variant="ghost" size="sm">
      <Play className="w-4 h-4" />
    </Button>
  )}
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="sm">
        <MoreVertical className="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem>
        <Edit className="w-4 h-4 mr-2" />
        Chỉnh sửa
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Copy className="w-4 h-4 mr-2" />
        Nhân bản
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="text-red-600">
        <Trash2 className="w-4 h-4 mr-2" />
        Xóa
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>
```

**Table Styling:**

- Card wrapper: `bg-white rounded-lg shadow overflow-hidden`
- Header: `bg-gray-50`
- Row hover: `hover:bg-gray-50`
- Cell padding: `px-6 py-4`

---

### 5. EMPTY STATE

```
┌─────────────────────────────────────────┐
│                                         │
│           🎟️                            │
│                                         │
│     Chưa có khuyến mãi nào              │
│     Tạo chương trình đầu tiên           │
│                                         │
│     [+ Tạo khuyến mãi]                  │
│                                         │
└─────────────────────────────────────────┘
```

**Specs:**

- Container: `flex flex-col items-center justify-center py-12`
- Icon: `w-24 h-24 text-gray-300`
- Title: `text-xl font-semibold text-gray-900 mt-4`
- Description: `text-gray-500 mt-2`
- Button: Primary, margin top `mt-6`

---

### 6. LOADING STATE

**Skeleton for table:**

```tsx
<TableRow>
  <TableCell>
    <div className="h-4 bg-gray-200 rounded animate-pulse" />
  </TableCell>
  <TableCell>
    <div className="h-6 bg-gray-200 rounded animate-pulse w-24" />
  </TableCell>
  ...
</TableRow>
```

**Skeleton count:** 5 rows

---

## 🎭 Interaction Patterns

### 1. PAUSE/RESUME PROMOTION

**Flow:**

1. User clicks Pause icon button
2. Show confirmation dialog:

   ```
   Tạm dừng khuyến mãi?

   Khuyến mãi "Giảm giá cuối năm" sẽ không còn
   được áp dụng cho các đơn hàng mới.

   [Hủy]  [Tạm dừng]
   ```

3. On confirm:
   - Mutation: `pausePromotion(id)`
   - Toast: "Đã tạm dừng khuyến mãi"
   - Badge changes to PAUSED

**Resume flow:** Similar with Play icon

---

### 2. DELETE PROMOTION

**Confirmation Dialog:**

```
⚠️ Xóa khuyến mãi?

Bạn có chắc muốn xóa khuyến mãi "NEWYEAR2025"?
Hành động này không thể hoàn tác.

[Hủy]  [Xóa]
```

**After delete:**

- Toast: "Đã xóa khuyến mãi"
- Invalidate query to refetch list

---

### 3. DUPLICATE PROMOTION

**Flow:**

1. Click "Nhân bản" in dropdown
2. Navigate to `/promotions/new?clone={id}`
3. Pre-fill form with data (except code - auto generate new)
4. Code suffix: "\_COPY"

---

### 4. FILTER INTERACTIONS

**Search:**

- Debounce: 300ms
- Search in: name, code

**Dropdowns:**

- Immediate filter on change
- Show count in dropdown options

**Date Range:**

- Component: Popover with Calendar (shadcn)
- Clear button inside popover

**Reset:**

- Clear all filters at once
- Smooth animation

---

## 🎨 Color Coding

### Promotion Types

```typescript
const typeColors = {
  PERCENTAGE: {
    badge: 'bg-purple-100 text-purple-800',
    text: 'text-purple-700',
    icon: 'Percent',
  },
  FIXED_AMOUNT: {
    badge: 'bg-blue-100 text-blue-800',
    text: 'text-blue-700',
    icon: 'DollarSign',
  },
}
```

### Status Colors

```typescript
const statusColors = {
  ACTIVE: {
    badge: 'bg-green-100 text-green-800',
    icon: CheckCircle2,
    label: 'Đang chạy',
  },
  EXPIRED: {
    badge: 'bg-gray-100 text-gray-800',
    icon: Clock,
    label: 'Hết hạn',
  },
  PAUSED: {
    badge: 'bg-amber-100 text-amber-800',
    icon: PauseCircle,
    label: 'Tạm dừng',
  },
}
```

---

## 📱 Responsive Behavior

### Desktop (≥1024px)

- Full table with all columns
- Statistics cards in 3-column grid
- Filter bar in single row (5 columns)

### Tablet (768px - 1023px)

- Hide progress bar column
- Statistics cards in 3-column grid
- Filter bar wraps to 2 rows

### Mobile (<768px)

- Switch to card list view (instead of table)
- Statistics in single column
- Filter bar: stack vertically
- Actions: Swipe or tap to reveal

---

## 🔍 Search & Filter Logic

**Search matches:**

```typescript
const matchesSearch = (promo: Promotion, query: string) => {
  const q = query.toLowerCase()
  return promo.name.toLowerCase().includes(q) || promo.code.toLowerCase().includes(q)
}
```

**Date range filter:**

```typescript
const matchesDateRange = (promo: Promotion, start: Date, end: Date) => {
  const promoStart = new Date(promo.startDate)
  return promoStart >= start && promoStart <= end
}
```

**Combined filters:**

- AND logic between different filter types
- Real-time filtering on client side (if using mock data)
- Server-side filtering when connected to API

---

## ♿ Accessibility

- **Keyboard navigation:** Full support for Tab, Enter, Escape
- **Screen readers:**
  - ARIA labels for icon buttons
  - Status announcements for loading/error states
- **Focus management:** Trap focus in dialogs
- **Color contrast:** WCAG AA compliance (4.5:1 minimum)

---

## 🧪 Component Checklist

- [x] Page header with title + action button
- [x] Filter bar with search + dropdowns
- [x] Statistics cards
- [x] Data table with sorting
- [x] Status badges with icons
- [x] Progress bar for usage
- [x] Action dropdown menu
- [x] Pause/Resume buttons
- [x] Delete confirmation dialog
- [x] Empty state
- [x] Loading skeletons
- [x] Toast notifications
- [x] Responsive layout

---

## 📦 Required shadcn/ui Components

```bash
npx shadcn@latest add table
npx shadcn@latest add badge
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add select
npx shadcn@latest add dropdown-menu
npx shadcn@latest add dialog
npx shadcn@latest add alert-dialog
npx shadcn@latest add popover
npx shadcn@latest add calendar
npx shadcn@latest add progress
```

---

## 🎯 Implementation Priority

1. **Phase 1 (MVP):**
   - Basic table with mock data
   - Status badges
   - Search + type/status filters
   - View/Edit actions

2. **Phase 2:**
   - Statistics cards
   - Date range filter
   - Progress bars
   - Pause/Resume functionality

3. **Phase 3:**
   - Duplicate feature
   - Bulk actions
   - Advanced sorting
   - Export to CSV

---

## 📊 Data Flow

```
User Action → Component State → React Query Hook → API Call
                                       ↓
                              Optimistic Update
                                       ↓
                              Invalidate Cache → Refetch
```

**Mutations:**

- `useCreatePromotion`
- `useUpdatePromotion`
- `usePausePromotion`
- `useResumePromotion`
- `useDeletePromotion`

**Queries:**

- `usePromotions({ filters })` - List with filters
- `usePromotionStats()` - Statistics for cards

---

## 🎨 Visual Hierarchy

1. **Primary focus:** Create button + Search
2. **Secondary:** Status badges, action buttons
3. **Tertiary:** Statistics, descriptions

**Typography scale:**

- Page title: `text-3xl`
- Card title: `text-xl`
- Table header: `text-sm font-semibold`
- Body text: `text-sm`
- Descriptions: `text-sm text-gray-500`

---

## ✅ Success Criteria

- [ ] User can view all promotions at a glance
- [ ] User can quickly find promotions using filters
- [ ] Status is immediately clear via color-coded badges
- [ ] Usage progress is visualized clearly
- [ ] Actions are easily accessible but not cluttering
- [ ] Confirmation dialogs prevent accidental deletions
- [ ] Loading states provide feedback
- [ ] Responsive design works on all devices
- [ ] Accessible to keyboard and screen reader users

---

**Design version:** 1.0  
**Last updated:** 18/12/2024  
**Designer:** AI Assistant  
**Status:** Ready for implementation
