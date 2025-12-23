# Product Detail Page - Premium Image Gallery Design

## 🎯 Tổng Quan

Thiết kế giao diện trang chi tiết sản phẩm (Product Detail Page) cho website e-commerce bán smartphone cao cấp, với gallery hình ảnh đa góc nhìn theo phong cách Apple.

---

## 📐 Kiến Trúc Component

### Component Hierarchy

```
ProductHero
├── ProductImageSection (tích hợp toàn bộ gallery)
│   ├── ProductImageGallery (gallery chính)
│   │   ├── ProductImageBadge (overlay badge)
│   │   └── Navigation (arrows + dots)
│   ├── ProductImageThumbnails (thumbnail dọc - desktop)
│   └── ProductImageZoomModal (zoom + fullscreen)
└── Product Info (giá, tùy chọn, CTA)
```

---

## 🖼️ Khu Vực Hình Ảnh - Chi Tiết

### 1. **Gallery Chính (ProductImageGallery)**

**Desktop:**
- Ảnh chính lớn: aspect-square, bg-gradient (gray-50 → gray-100)
- Rounded corners: 2xl (16px)
- Hover effect: scale-105 (zoom nhẹ)
- Navigation arrows: xuất hiện khi hover
- Zoom hint: "Click để phóng to"

**Mobile:**
- Full width, responsive
- Swipe gesture: left/right để chuyển ảnh
- Indicator dots: dạng dot, active dot rộng hơn
- Swipe hint: "Vuốt để xem"

### 2. **Thumbnail Dọc (ProductImageThumbnails)**

**Desktop Only:**
- Vị trí: bên trái gallery
- Size: 80px × 80px
- Border: 2px, active = blue-500 + ring
- Label: angle name (Mặt trước, Mặt sau, etc.)
- Hover: border-gray-400, scale-105

**Mobile:**
- Hidden (display: none)

### 3. **Overlay Badge (ProductImageBadge)**

**Vị trí & Kiểu:**
- **Discount** (top-left): "-12%" → red-500, rounded-full
- **New** (top-right): "New" → green-500, rounded-full
- **Storage** (bottom-right): "256GB" → black/70, rounded-full
- **Custom Badge** (bottom-left): "Trả góp 0%" → blue-500, rounded-full

**Styling:**
- Backdrop blur: blur-sm
- Shadow: shadow-lg
- Font: text-xs/sm, font-medium/semibold
- Padding: px-3 py-1.5

### 4. **Zoom Modal (ProductImageZoomModal)**

**Features:**
- Full screen modal: fixed inset-0, bg-black/95
- Zoom controls: 1x → 3x (step 0.5)
- Drag to pan: mouse down/move/up
- Navigation: prev/next arrows
- Image counter: "1 / 5"
- Close button: top-right

**Controls Bar:**
- Position: bottom-6, centered
- Buttons: ZoomOut, Zoom%, ZoomIn
- Background: black/60, backdrop-blur-sm
- Disabled state: opacity-50

---

## 🎨 Phong Cách Thiết Kế

### Color Palette

```
Primary:
- Blue-500: #3b82f6 (active state, primary action)
- Gray-50: #f9fafb (background)
- Gray-100: #f3f4f6 (gradient)
- Gray-900: #111827 (text)

Semantic:
- Red-500: #ef4444 (discount)
- Green-500: #22c55e (new, benefits)
- Black/70: rgba(0,0,0,0.7) (storage badge)
```

### Typography

```
- Title: text-2xl/3xl, font-bold
- Label: text-sm, font-semibold
- Badge: text-xs/sm, font-medium/semibold
- Hint: text-xs, font-medium
```

### Spacing

```
- Gallery gap: gap-4
- Color selector gap: gap-3
- Thumbnail gap: gap-3
- Padding: p-8 (image), p-2 (thumbnail)
```

### Animations

```
- Hover scale: scale-105 (300ms)
- Border transition: 200ms
- Fade in: 300ms
- Zoom modal: 200ms
```

---

## 📱 Responsive Design

### Desktop (lg: 1024px+)

```
Layout: 2 columns
├── Left: Thumbnails (80px) + Gallery
└── Right: Product Info

Thumbnails: Visible, vertical
Navigation: Arrows on hover
Zoom: Click to open modal
```

### Tablet (md: 768px - 1023px)

```
Layout: 1 column (stacked)
Gallery: Full width
Thumbnails: Hidden
Navigation: Swipe + dots
```

### Mobile (< 768px)

```
Layout: 1 column
Gallery: Full width, responsive
Thumbnails: Hidden
Navigation: Swipe + dots
Zoom: Double-tap + modal
```

---

## 🔄 Tương Tác Màu Sắc

### Khi Người Dùng Chọn Màu Sắc

1. **Đổi gallery ảnh** → tất cả 5 góc thay đổi theo màu
2. **Giữ góc nhìn hiện tại** → nếu đang xem "Mặt sau", vẫn xem "Mặt sau" của màu mới
3. **Smooth transition** → fade in 300ms

### Implementation

```typescript
const handleColorChange = (index: number) => {
  setSelectedColorIndex(index);
  // selectedAngleIndex giữ nguyên
};
```

---

## 🎬 Animation Details

### Gallery Image Transition

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Thumbnail Hover

```css
transition: all 0.2s ease-out;
transform: scale(1.05);
```

### Zoom Modal

```css
animation: fadeIn 0.2s ease-out;
```

---

## 📊 Data Structure

### ColorVariant

```typescript
interface ColorVariant {
  value: string;        // "#000000"
  name: string;         // "Đen"
  images: ImageVariant[];
}
```

### ImageVariant

```typescript
interface ImageVariant {
  angle: 'front' | 'back' | 'side' | 'camera' | 'lifestyle';
  label: string;        // "Mặt trước"
  url: string;          // image URL
}
```

---

## 🚀 Implementation Checklist

- [x] ProductImageGallery component
- [x] ProductImageThumbnails component
- [x] ProductImageBadge component
- [x] ProductImageZoomModal component
- [x] ProductImageSection (tích hợp)
- [x] useProductImages hook
- [x] ProductHero integration
- [x] CSS animations
- [ ] Test responsive design
- [ ] Test zoom functionality
- [ ] Test color variant switching
- [ ] Test touch swipe (mobile)

---

## 📝 Notes

- **Image Requirements**: 1:1 ratio, >= 2000px, studio lighting
- **Performance**: Use Next.js Image component with optimization
- **Accessibility**: ARIA labels, keyboard navigation
- **Browser Support**: Modern browsers (Chrome, Safari, Firefox, Edge)

---

## 🔗 Related Files

```
phone-app/src/
├── components/product/
│   ├── product-hero.tsx (updated)
│   ├── product-image-section.tsx (new)
│   ├── product-image-gallery.tsx (new)
│   ├── product-image-thumbnails.tsx (new)
│   ├── product-image-badge.tsx (new)
│   ├── product-image-zoom-modal.tsx (new)
│   └── product-image-gallery.css (new)
└── hooks/
    └── use-product-images.ts (new)
```

