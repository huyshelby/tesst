# Admin Dashboard Design System

## 🎨 Design Philosophy

**Nguyên tắc thiết kế:**

- **Clarity First**: Mọi thông tin phải rõ ràng, dễ đọc
- **Action-Oriented**: Prioritize các thao tác phổ biến nhất
- **Data-Dense**: Hiển thị nhiều thông tin trong không gian hợp lý
- **Consistent**: Sử dụng patterns nhất quán trong toàn bộ hệ thống

---

## 🎯 Color Palette

### Primary Colors

```
Primary Blue: #2563EB (Tailwind blue-600)
  - Buttons, links, active states

Primary Dark: #1E40AF (Tailwind blue-700)
  - Hover states, emphasis
```

### Neutral Colors

```
Gray-50:  #F9FAFB - Background
Gray-100: #F3F4F6 - Hover backgrounds
Gray-200: #E5E7EB - Borders
Gray-400: #9CA3AF - Disabled text
Gray-600: #4B5563 - Secondary text
Gray-900: #111827 - Primary text
```

### Semantic Colors

```
Success: #10B981 (green-500) - Completed, Active
Warning: #F59E0B (amber-500) - Pending, Low stock
Danger:  #EF4444 (red-500)   - Cancelled, Error
Info:    #3B82F6 (blue-500)  - Processing
```

---

## 📐 Layout Grid

### Breakpoints

```
sm:  640px  - Tablet portrait
md:  768px  - Tablet landscape
lg:  1024px - Desktop
xl:  1280px - Large desktop
2xl: 1536px - Extra large
```

### Sidebar

```
Expanded:  256px (w-64)
Collapsed: 64px  (w-16)
Mobile:    Hidden (overlay when open)
```

### Content Area

```
Max width: 1400px
Padding:   24px (p-6)
Gap:       24px (gap-6)
```

---

## 🔤 Typography

### Font Family

```
Font: Inter (Google Fonts)
Fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

### Font Sizes

```
text-xs:   12px - Labels, badges
text-sm:   14px - Body text, table cells
text-base: 16px - Default
text-lg:   18px - Card titles
text-xl:   20px - Page headings
text-2xl:  24px - Section headings
text-3xl:  30px - Dashboard KPIs
```

### Font Weights

```
font-normal:  400 - Body text
font-medium:  500 - Emphasis, labels
font-semibold: 600 - Buttons, headings
font-bold:    700 - Numbers, KPIs
```

---

## 🧩 Component Patterns

### 1. Cards

```
Base Card:
- Background: white
- Border: 1px solid gray-200
- Border radius: 8px (rounded-lg)
- Padding: 24px (p-6)
- Shadow: sm (shadow-sm)
- Hover: shadow-md transition
```

### 2. Buttons

**Primary Button**

```
Background: blue-600
Text: white
Padding: px-4 py-2
Border radius: 6px
Font: font-medium text-sm
Hover: blue-700
Active: blue-800
```

**Secondary Button**

```
Background: white
Border: 1px gray-300
Text: gray-700
Hover: gray-50
```

**Danger Button**

```
Background: red-600
Text: white
Hover: red-700
```

### 3. Input Fields

```
Height: 40px (h-10)
Border: 1px gray-300
Border radius: 6px
Padding: px-3
Focus: ring-2 ring-blue-500/20, border-blue-500
Placeholder: text-gray-400
```

### 4. Tables

```
Header:
- Background: gray-50
- Text: text-sm font-semibold text-gray-700
- Padding: px-6 py-3

Row:
- Border bottom: 1px gray-200
- Padding: px-6 py-4
- Hover: gray-50
- Text: text-sm text-gray-900

Actions:
- Icon buttons: w-8 h-8
- Spacing: gap-2
```

### 5. Badges/Status

```
Size: px-2.5 py-0.5
Font: text-xs font-medium
Border radius: rounded-full

Variants:
- Success: bg-green-100 text-green-800
- Warning: bg-amber-100 text-amber-800
- Danger:  bg-red-100 text-red-800
- Info:    bg-blue-100 text-blue-800
- Default: bg-gray-100 text-gray-800
```

---

## 🎭 Icon System

**Icon Library:** Lucide React (tree-shakeable, modern)

### Common Icons

```
Navigation:
- LayoutDashboard (Dashboard)
- Package (Products)
- ShoppingCart (Orders)
- Users (Customers)
- Warehouse (Inventory)
- Tag (Promotions)
- Star (Reviews)
- Shield (Permissions)
- Settings (Settings)

Actions:
- Plus (Add)
- Pencil (Edit)
- Trash2 (Delete)
- Eye (View)
- Download (Export)
- Upload (Import)
- Search (Search)
- Filter (Filter)
- X (Close)
- Check (Confirm)

Status:
- AlertCircle (Warning)
- CheckCircle (Success)
- XCircle (Error)
- Clock (Pending)
```

---

## 📊 Data Visualization

### Charts

**Library:** Recharts (React-friendly, customizable)

**Chart Types:**

1. Line Chart - Revenue over time
2. Bar Chart - Product comparison
3. Pie Chart - Order status distribution
4. Area Chart - Traffic trends

**Chart Colors:**

```
Primary:   #2563EB
Secondary: #10B981
Tertiary:  #F59E0B
Accent:    #8B5CF6
```

---

## 🔔 Notifications/Toasts

**Library:** Sonner (Modern toast notifications)

**Positions:**

- Top right (default)
- Duration: 3000ms (auto-dismiss)

**Types:**

```
Success: Checkmark icon + green accent
Error:   X icon + red accent
Warning: Alert icon + amber accent
Info:    Info icon + blue accent
```

---

## 📱 Responsive Behavior

### Mobile (< 768px)

- Sidebar: Hidden by default, overlay on open
- Tables: Horizontal scroll or card layout
- Forms: Full width, stacked inputs
- KPI cards: 1 column

### Tablet (768px - 1024px)

- Sidebar: Can collapse to icons only
- Tables: Visible with fewer columns
- KPI cards: 2 columns
- Content: max-w-full

### Desktop (> 1024px)

- Sidebar: Expanded by default
- Tables: All columns visible
- KPI cards: 4 columns
- Content: Optimal spacing

---

## ⚡ Animation & Transitions

### Standard Transitions

```
Duration: 200ms (duration-200)
Easing: ease-in-out
Properties: all, colors, transform, opacity
```

### Micro-interactions

```
Button hover: scale-105 + shadow
Card hover: shadow-lg
Sidebar toggle: width transition
Menu open: slide-down with fade
Modal: fade + scale
```

---

## 🎯 Spacing System (Tailwind)

```
1  = 4px   - Tight spacing
2  = 8px   - Close elements
3  = 12px  - Default gap
4  = 16px  - Component padding
6  = 24px  - Section spacing
8  = 32px  - Large gaps
12 = 48px  - Section separation
```

---

## 📋 Form Patterns

### Form Layout

```
Label above input (vertical)
Error messages below input
Helper text: text-xs text-gray-500
Required indicator: red asterisk
```

### Validation States

```
Default: gray-300 border
Focus:   blue-500 border + ring
Error:   red-500 border + red text
Success: green-500 border
Disabled: gray-100 bg + gray-400 text
```

---

## 🔐 Permission-Based UI

### Role Visibility

```
Super Admin: All features
Manager:     All except system settings
Staff:       View only + limited edit
```

### UI States

```
Hidden:   display: none (không đủ quyền)
Disabled: Visible nhưng không thao tác được
Read-only: Xem được nhưng không chỉnh sửa
```

---

## 📦 Component Library Choice

**Recommended:** shadcn/ui + Tailwind CSS

**Lý do:**

- ✅ Copy-paste components (không lock-in)
- ✅ Full customization
- ✅ TypeScript native
- ✅ Accessibility built-in (Radix UI)
- ✅ Modern, clean design
- ✅ Tree-shakeable (small bundle)

**Alternative:** Ant Design

- Pros: Feature-rich, production-ready
- Cons: Larger bundle, harder customization

---

## 🚀 Performance Guidelines

### Loading States

```
Skeleton screens for tables/cards
Spinner for button actions
Progress bar for file uploads
Suspense boundaries for lazy routes
```

### Optimization

```
- Image optimization (Next.js Image)
- Code splitting per route
- Lazy load charts
- Virtual scrolling for long lists (react-window)
- Debounce search inputs (300ms)
```

---

## 📝 Accessibility

### WCAG 2.1 AA Compliance

```
- Color contrast: 4.5:1 minimum
- Keyboard navigation: All interactive elements
- ARIA labels: For icon buttons
- Focus indicators: Visible outline
- Screen reader: Semantic HTML
```

### Interactive Elements

```
- Min touch target: 44x44px
- Hover states: All clickable items
- Loading states: aria-busy
- Error messages: aria-invalid + aria-describedby
```

---

## 🎨 Design Tokens (CSS Variables)

```css
:root {
  /* Colors */
  --color-primary: 37 99 235; /* blue-600 */
  --color-success: 16 185 129; /* green-500 */
  --color-warning: 245 158 11; /* amber-500 */
  --color-danger: 239 68 68; /* red-500 */

  /* Spacing */
  --spacing-xs: 0.5rem; /* 8px */
  --spacing-sm: 1rem; /* 16px */
  --spacing-md: 1.5rem; /* 24px */
  --spacing-lg: 2rem; /* 32px */

  /* Border Radius */
  --radius-sm: 0.375rem; /* 6px */
  --radius-md: 0.5rem; /* 8px */
  --radius-lg: 0.75rem; /* 12px */

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

---

## 📚 Documentation

### Component Documentation

Mỗi component cần document:

- Props interface
- Usage examples
- Variants
- Accessibility notes

### Style Guide

- Naming conventions (BEM hoặc utility-first)
- File structure
- Import order
- Comment guidelines
