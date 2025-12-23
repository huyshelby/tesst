# Product Gallery - Quick Start Guide

## 🚀 Bắt Đầu Nhanh

### 1. **Cấu Trúc File Mới**

```
phone-app/
├── src/
│   ├── components/product/
│   │   ├── product-image-section.tsx ✨ NEW
│   │   ├── product-image-gallery.tsx ✨ NEW
│   │   ├── product-image-thumbnails.tsx ✨ NEW
│   │   ├── product-image-badge.tsx ✨ NEW
│   │   ├── product-image-zoom-modal.tsx ✨ NEW
│   │   ├── product-image-gallery.css ✨ NEW
│   │   ├── product-hero.tsx 🔄 UPDATED
│   │   └── README.md ✨ NEW
│   └── hooks/
│       └── use-product-images.ts ✨ NEW
├── PRODUCT_DETAIL_PAGE_DESIGN.md ✨ NEW
├── PRODUCT_DETAIL_UI_MOCKUP.md ✨ NEW
└── PRODUCT_GALLERY_IMPLEMENTATION.md ✨ NEW
```

---

## 📋 Checklist Sử Dụng

### ✅ Đã Hoàn Thành

- [x] Gallery carousel (5 góc)
- [x] Thumbnail navigation (desktop)
- [x] Touch swipe (mobile)
- [x] Zoom modal (fullscreen)
- [x] Color variant switching
- [x] Overlay badges
- [x] Responsive design
- [x] Animations
- [x] Documentation

### 📝 Cần Làm

- [ ] Thêm hình ảnh thực tế (thay thế mock images)
- [ ] Test trên các trình duyệt khác nhau
- [ ] Test trên mobile devices
- [ ] Optimize hình ảnh (WebP, lazy load)
- [ ] Thêm keyboard navigation
- [ ] Thêm ARIA labels

---

## 🎯 Cách Sử Dụng

### Bước 1: Import Component

```tsx
import { ProductImageSection } from '@/components/product/product-image-section';
import type { ColorVariant } from '@/hooks/use-product-images';
```

### Bước 2: Định Nghĩa Color Variants

```tsx
const colorVariants: ColorVariant[] = [
  {
    value: "#000000",
    name: "Đen",
    images: [
      {
        angle: "front",
        label: "Mặt trước",
        url: "/images/iphone-black-front.jpg",
      },
      {
        angle: "back",
        label: "Mặt sau",
        url: "/images/iphone-black-back.jpg",
      },
      {
        angle: "side",
        label: "Cạnh bên",
        url: "/images/iphone-black-side.jpg",
      },
      {
        angle: "camera",
        label: "Cụm camera",
        url: "/images/iphone-black-camera.jpg",
      },
      {
        angle: "lifestyle",
        label: "Lifestyle",
        url: "/images/iphone-black-lifestyle.jpg",
      },
    ],
  },
  // ... thêm màu sắc khác
];
```

### Bước 3: Render Component

```tsx
<ProductImageSection
  colorVariants={colorVariants}
  selectedColorIndex={selectedColorIndex}
  onColorChange={setSelectedColorIndex}
  discount={12}
  storage="256GB"
  isNew={true}
/>
```

---

## 🎨 Tùy Chỉnh

### Thay Đổi Màu Sắc Badge

**File:** `src/components/product/product-image-badge.tsx`

```tsx
// Discount badge
<div className="bg-red-500">...</div>

// New badge
<div className="bg-green-500">...</div>

// Storage badge
<div className="bg-black/70">...</div>

// Custom badge
<div className="bg-blue-500">...</div>
```

### Thay Đổi Kích Thước Thumbnail

**File:** `src/components/product/product-image-thumbnails.tsx`

```tsx
// Từ 80px thành 100px
className="w-25 h-25" // Tailwind: w-[100px] h-[100px]
```

### Thay Đổi Phạm Vi Zoom

**File:** `src/components/product/product-image-zoom-modal.tsx`

```tsx
const maxZoom = 4; // Từ 3 thành 4
const minZoom = 0.5; // Từ 1 thành 0.5
```

### Thêm Góc Nhìn Mới

**File:** `src/components/product/product-hero.tsx`

```tsx
images: [
  { angle: "front", label: "Mặt trước", url: "..." },
  { angle: "back", label: "Mặt sau", url: "..." },
  { angle: "side", label: "Cạnh bên", url: "..." },
  { angle: "camera", label: "Cụm camera", url: "..." },
  { angle: "lifestyle", label: "Lifestyle", url: "..." },
  { angle: "unboxing", label: "Unboxing", url: "..." }, // ✨ NEW
]
```

---

## 🧪 Testing

### Test Gallery Navigation

```bash
# Desktop
1. Hover over gallery → arrows appear
2. Click arrows → image changes
3. Click thumbnail → image changes
4. Hover thumbnail → scale effect

# Mobile
1. Swipe left/right → image changes
2. Click dots → image changes
3. Tap image → zoom modal opens
```

### Test Color Switching

```bash
1. Click color swatch
2. Gallery images update
3. Angle stays same
4. Smooth transition
```

### Test Zoom Modal

```bash
1. Click gallery image
2. Modal opens fullscreen
3. Zoom in/out with buttons
4. Drag to pan
5. Click arrows to navigate
6. Click X to close
```

---

## 📱 Responsive Testing

### Desktop (1024px+)
```
✓ Thumbnails visible
✓ Navigation arrows
✓ Hover effects
✓ Click zoom
```

### Tablet (768px - 1023px)
```
✓ Thumbnails hidden
✓ Swipe navigation
✓ Dot indicators
✓ Click zoom
```

### Mobile (< 768px)
```
✓ Full width gallery
✓ Swipe navigation
✓ Dot indicators
✓ Tap zoom
```

---

## 🐛 Troubleshooting

### Images không hiển thị
```
1. Kiểm tra URL hình ảnh
2. Kiểm tra CORS headers
3. Kiểm tra Next.js Image optimization
```

### Zoom không hoạt động
```
1. Kiểm tra onZoom callback
2. Kiểm tra ProductImageZoomModal render
3. Kiểm tra isZoomOpen state
```

### Swipe không hoạt động
```
1. Kiểm tra touch event handlers
2. Kiểm tra mobile viewport meta tag
3. Kiểm tra browser support
```

### Thumbnails không hiển thị
```
1. Kiểm tra lg: breakpoint (1024px)
2. Kiểm tra CSS loaded
3. Kiểm tra display: hidden
```

---

## 📚 Tài Liệu

| File | Mô Tả |
|------|-------|
| [PRODUCT_DETAIL_PAGE_DESIGN.md](./PRODUCT_DETAIL_PAGE_DESIGN.md) | Design system, architecture, animations |
| [PRODUCT_DETAIL_UI_MOCKUP.md](./PRODUCT_DETAIL_UI_MOCKUP.md) | Wireframes, layouts, interactions |
| [PRODUCT_GALLERY_IMPLEMENTATION.md](./PRODUCT_GALLERY_IMPLEMENTATION.md) | Implementation summary, features, next steps |
| [src/components/product/README.md](./src/components/product/README.md) | Component usage, props, examples |

---

## 💡 Tips

1. **Hình ảnh**: Sử dụng tỷ lệ 1:1, >= 2000px, studio lighting
2. **Performance**: Lazy load images, optimize format (WebP)
3. **Accessibility**: Thêm ARIA labels, keyboard navigation
4. **Testing**: Test trên desktop, tablet, mobile
5. **Customization**: Dễ dàng thay đổi màu sắc, kích thước, animations

---

## 🎉 Hoàn Thành!

Gallery hình ảnh sản phẩm đã sẵn sàng sử dụng. Chỉ cần:

1. ✅ Thêm hình ảnh thực tế
2. ✅ Test trên các thiết bị
3. ✅ Deploy!

Chúc bạn thành công! 🚀

