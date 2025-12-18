# 🎨 Product Management UI/UX Design - Admin Dashboard

## 📋 Tổng quan

Thiết kế giao diện quản lý sản phẩm cho Admin Dashboard website bán điện thoại, phong cách hiện đại, tối giản, chuyên nghiệp.

---

## 🎯 Design Principles

### Màu sắc chủ đạo

- **Primary**: Blue 600 (#2563EB) - Buttons, links, active states
- **Background**: Gray 50 (#F9FAFB)
- **Success**: Green 500 (#10B981) - Hoạt động
- **Warning**: Amber 500 (#F59E0B) - Tồn kho thấp
- **Danger**: Red 500 (#EF4444) - Xóa, lỗi

### Typography

- **Font**: Inter
- **Heading**: 3xl (1.875rem) - Bold - Gray 900
- **Subheading**: lg (1.125rem) - Semibold - Gray 700
- **Body**: sm (0.875rem) - Regular - Gray 600

---

## 📐 Layout Structure

```
┌─────────────────────────────────────────┐
│ Header: Title + Action Button          │
├─────────────────────────────────────────┤
│ Filter Bar: Search + Dropdowns          │
├─────────────────────────────────────────┤
│ [Optional] Bulk Action Bar              │
├─────────────────────────────────────────┤
│                                         │
│         Data Table                      │
│         (Main Content)                  │
│                                         │
└─────────────────────────────────────────┘
```

---

## 1️⃣ TRANG DANH SÁCH SẢN PHẨM

### 📍 File: `/products/page.tsx`

### A. Header Section

```tsx
<div className="flex items-center justify-between">
  <div>
    <h1>Sản phẩm</h1>
    <p className="text-gray-600">Quản lý danh sách sản phẩm</p>
  </div>
  <Button>+ Thêm sản phẩm</Button>
</div>
```

**Visual:**

- Tiêu đề: Text-3xl, font-bold, text-gray-900
- Subtitle: Text-sm, text-gray-600
- Button: Primary blue, gap-2 với icon Plus

---

### B. Filter Bar

```tsx
<div className="bg-white rounded-lg shadow p-4">
  <div className="grid grid-cols-4 gap-4">
    <Input icon={Search} placeholder="Tìm theo tên hoặc SKU..." />
    <Select placeholder="Tất cả danh mục" />
    <Select placeholder="Tất cả thương hiệu" />
    <Select placeholder="Tất cả trạng thái" />
  </div>
</div>
```

**Features:**

- ✅ Real-time search (debounced)
- ✅ Multi-filter: Category, Brand, Status
- ✅ Reset button hiện khi có filter active
- ✅ Active filter badges

**Visual:**

- Background: White với shadow subtle
- Inputs: Border gray-200, focus:ring-2 blue-600
- Icon trong input: absolute left-3, text-gray-400

---

### C. Data Table

#### Cột bảng:

| Cột         | Width | Align  | Type            |
| ----------- | ----- | ------ | --------------- |
| Checkbox    | 48px  | Center | Selection       |
| Ảnh         | 80px  | Left   | Image thumbnail |
| Sản phẩm    | Auto  | Left   | Name + SKU      |
| Thương hiệu | 150px | Left   | Text            |
| Danh mục    | 150px | Left   | Text            |
| Giá         | 150px | Right  | Currency        |
| Tồn kho     | 100px | Center | Number          |
| Trạng thái  | 120px | Center | Badge           |
| Hành động   | 96px  | Center | Actions         |

#### Row Design:

```tsx
<TableRow className="hover:bg-gray-50 cursor-pointer">
  <TableCell>
    <Checkbox />
  </TableCell>
  <TableCell>
    <div className="w-12 h-12 bg-gray-100 rounded">
      <img src={image} />
    </div>
  </TableCell>
  <TableCell>
    <div className="font-semibold">{name}</div>
    <div className="text-sm text-gray-500">SKU: {slug}</div>
  </TableCell>
  {/* ... */}
  <TableCell>
    <Badge variant={isActive ? 'default' : 'secondary'}>
      {isActive ? 'Hoạt động' : 'Tạm ngưng'}
    </Badge>
  </TableCell>
</TableRow>
```

**Interactions:**

- ✅ Hover: bg-gray-50 transition
- ✅ Click row → Navigate to edit page
- ✅ Click checkbox → Toggle selection
- ✅ Click edit icon → Edit page

**Color Logic:**

- Tồn kho > 10: text-green-600
- Tồn kho 1-10: text-amber-600
- Tồn kho = 0: text-red-600

---

### D. Bulk Actions Bar

```tsx
{
  selectedIds.length > 0 && (
    <div className="bg-blue-50 border border-blue-200 p-4">
      <span>Đã chọn {selectedIds.length} sản phẩm</span>
      <Button variant="destructive">Xóa đã chọn</Button>
    </div>
  )
}
```

**Visual:**

- Background: Blue-50 với border blue-200
- Text: Blue-900, font-medium
- Button: Destructive variant (red)

---

### E. Empty State

```tsx
<div className="text-center py-12">
  <Package className="w-12 h-12 text-gray-400 mx-auto" />
  <h3>Chưa có sản phẩm nào</h3>
  <p className="text-gray-600">Bắt đầu bằng cách thêm sản phẩm đầu tiên</p>
  <Button>+ Thêm sản phẩm</Button>
</div>
```

---

## 2️⃣ TRANG THÊM/SỬA SẢN PHẨM

### 📍 Files:

- `/products/new/page.tsx`
- `/products/[id]/edit/page.tsx`

### A. Header với Breadcrumb

```tsx
<div className="flex items-center justify-between">
  <div className="flex items-center gap-4">
    <Button variant="ghost" onClick={back}>
      <ArrowLeft />
    </Button>
    <div>
      <h1>Thêm sản phẩm mới</h1>
      <p className="text-gray-600">Điền đầy đủ thông tin</p>
    </div>
  </div>
  <div className="flex gap-2">
    <Button variant="destructive">Xóa</Button> {/* Edit only */}
    <Button variant="outline">Hủy</Button>
    <Button>Lưu sản phẩm</Button>
  </div>
</div>
```

---

### B. Tabs Navigation

```tsx
<Tabs defaultValue="basic">
  <TabsList className="grid grid-cols-4">
    <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
    <TabsTrigger value="specs">Thuộc tính</TabsTrigger>
    <TabsTrigger value="images">Hình ảnh</TabsTrigger>
    <TabsTrigger value="description">Mô tả</TabsTrigger>
  </TabsList>
</Tabs>
```

**Visual:**

- Active tab: bg-white, text-blue-600, border-bottom-2 blue-600
- Inactive: text-gray-600, hover:text-gray-900

---

### C. TAB 1 - Thông tin cơ bản

#### Layout: 2-column grid

```tsx
<Card>
  <CardHeader>
    <CardTitle>Thông tin cơ bản</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-2 gap-6">
      <FormField name="name" className="col-span-2" />
      <FormField name="slug" />
      <FormField name="brand" />
      <FormField name="categoryId" />
      <FormField name="stock" />
      <FormField name="price" />
      <FormField name="listPrice" />
      <FormField name="isActive" />
    </div>
  </CardContent>
</Card>
```

**Fields:**

1. **Tên sản phẩm** (Required) - Input, full width
2. **SKU/Slug** - Input, auto-generate từ tên
3. **Thương hiệu** (Required) - Select dropdown
4. **Danh mục** (Required) - Select dropdown
5. **Tồn kho** (Required) - Number input
6. **Giá bán** (Required) - Number input + "VNĐ" suffix
7. **Giá gốc** (Optional) - Number input
8. **Trạng thái** - Switch toggle

**Validation:**

- Required fields có dấu `*` đỏ
- Error message hiển thị dưới input: text-red-600, text-xs
- Success: border-green-500

---

### D. TAB 2 - Thuộc tính kỹ thuật

#### Layout: 2-column grid

```tsx
<div className="grid grid-cols-2 gap-6">
  <Input label="RAM" placeholder="8GB" />
  <Input label="ROM" placeholder="256GB" />
  <Input label="Màn hình" placeholder='6.7" Super Retina XDR' />
  <Input label="Camera" placeholder="48MP + 12MP" />
  <Input label="CPU" placeholder="Apple A17 Pro" />
  <Input label="Pin" placeholder="4422 mAh" />
  <Input label="Màu sắc" className="col-span-2" />
</div>
```

**Visual:**

- Label: text-sm, font-medium, mb-2
- Input: Standard with placeholder
- Store as JSON in `specs` field

---

### E. TAB 3 - Hình ảnh

#### Main Image Upload

```tsx
;<FormField name="image">
  <Input placeholder="/pictures/iphone-15-pro-max.jpg" />
</FormField>

{
  /* Preview */
}
;<div className="w-32 h-32 bg-white border rounded">
  <img src={image} />
</div>
```

#### Drag & Drop Zone

```tsx
<div className="border-2 border-dashed rounded-lg p-12 bg-gray-50">
  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
  <p>Kéo thả file hoặc click để upload</p>
  <p className="text-sm">JPG, PNG, WebP (max 5MB)</p>
  <Button variant="outline">Chọn file</Button>
</div>
```

**Visual:**

- Border: border-gray-300, dashed
- Hover: bg-gray-100, border-blue-500
- Icon: w-12, text-gray-400

---

### F. TAB 4 - Mô tả

```tsx
<Textarea placeholder="Nhập mô tả chi tiết về sản phẩm..." className="min-h-[300px] resize-none" />
```

**Features:**

- ✅ Large text area (300px min-height)
- ✅ Fixed height, no resize
- ✅ Markdown support (future enhancement)
- ✅ Character counter: 5000 max

---

## 🎨 Component Library

### Buttons

```tsx
<Button>Primary</Button>
<Button variant="outline">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost">Ghost</Button>
<Button size="sm">Small</Button>
<Button size="icon"><Icon /></Button>
```

### Badges

```tsx
<Badge>Default (Blue)</Badge>
<Badge variant="secondary">Secondary (Gray)</Badge>
<Badge variant="success">Success (Green)</Badge>
<Badge variant="destructive">Destructive (Red)</Badge>
```

### Form Elements

```tsx
<Input placeholder="..." />
<Select><SelectItem value="...">...</SelectItem></Select>
<Textarea rows={5} />
<Switch checked={value} onCheckedChange={onChange} />
<Checkbox checked={value} />
```

---

## 📱 Responsive Breakpoints

| Screen  | Width          | Grid Columns       |
| ------- | -------------- | ------------------ |
| Mobile  | < 768px        | 1 column           |
| Tablet  | 768px - 1024px | 2 columns          |
| Desktop | > 1024px       | 4 columns (filter) |

**Mobile adjustments:**

- Filter bar: Stack vertically
- Table: Scroll horizontal
- Form: Single column
- Hide sidebar (hamburger menu)

---

## ⚡ Loading & Error States

### Loading Skeleton

```tsx
<div className="space-y-6">
  <div className="h-8 bg-gray-200 rounded animate-pulse w-48" />
  <div className="h-64 bg-gray-200 rounded animate-pulse" />
</div>
```

### Error State

```tsx
<div className="text-center py-12">
  <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
  <h3 className="text-lg font-semibold">Có lỗi xảy ra</h3>
  <p className="text-gray-600">{error.message}</p>
  <Button onClick={retry}>Thử lại</Button>
</div>
```

---

## 🔔 Notifications (Toast)

```tsx
// Success
toast.success('Tạo sản phẩm thành công')

// Error
toast.error('Không thể xóa sản phẩm')

// Loading
toast.loading('Đang xử lý...')
```

**Position:** Top-right
**Duration:** 3 seconds
**Style:** White background, shadow-lg

---

## ✅ Accessibility

- ✅ All inputs have labels
- ✅ Buttons have aria-labels
- ✅ Keyboard navigation support
- ✅ Focus visible states
- ✅ Proper heading hierarchy
- ✅ Alt text for images
- ✅ Form validation messages

---

## 🚀 Animation & Transitions

```css
/* Hover effects */
.hover\:bg-gray-50 {
  transition: background-color 150ms ease-in-out;
}

/* Modal enter/exit */
.dialog-overlay {
  animation: fadeIn 200ms;
}
.dialog-content {
  animation: slideUp 300ms;
}

/* Skeleton pulse */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

---

## 📊 Performance Optimizations

1. **Lazy load images** - Chỉ load khi visible
2. **Virtual scrolling** - Cho danh sách > 100 items
3. **Debounce search** - 300ms delay
4. **Optimistic updates** - UI update ngay lập tức
5. **Prefetch routes** - Hover trên links

---

## 🎯 Key UX Principles Implemented

✅ **Clarity First** - Thông tin rõ ràng, dễ đọc
✅ **Action-Oriented** - CTA nổi bật, dễ thấy
✅ **Data-Dense** - Hiển thị nhiều info trong table
✅ **Consistent** - Patterns nhất quán toàn dashboard
✅ **Feedback** - Instant feedback cho mọi action
✅ **Forgiving** - Confirm trước khi xóa
✅ **Progressive Disclosure** - Tabs cho form phức tạp

---

## 📸 Screenshots Reference

### 1. Products List Page

- Clean table với alternating row colors
- Inline actions (edit icon)
- Status badges với semantic colors
- Empty state với illustration

### 2. Product Form

- Tabs navigation ở top
- Two-column layout cho form
- Inline validation messages
- Preview cho images
- Action buttons ở header

---

## 🔧 Implementation Stack

- **Framework**: Next.js 14 App Router
- **UI Library**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS 3.4
- **Forms**: React Hook Form + Zod
- **State**: React Query (TanStack Query)
- **Icons**: Lucide React

---

## 📝 Notes

- Design system tuân theo Material Design 3 principles
- Color palette compatible với WCAG AA contrast ratio
- Font Inter tối ưu cho readability
- Component reusable cho các trang khác (Orders, Customers, etc.)

---

**Designed & Implemented by:** GitHub Copilot
**Date:** December 18, 2025
**Version:** 1.0.0
