# Product Components

## 📦 Components Overview

### ProductImageSection
**Tích hợp toàn bộ gallery hình ảnh sản phẩm**

```tsx
<ProductImageSection
  colorVariants={colorVariants}
  selectedColorIndex={selectedColorIndex}
  onColorChange={setSelectedColorIndex}
  discount={discount}
  storage={selectedStorage}
  isNew={product.badges?.includes("New")}
/>
```

**Props:**
- `colorVariants`: ColorVariant[] - Mảng biến thể màu sắc
- `selectedColorIndex`: number - Index màu sắc được chọn
- `onColorChange`: (index: number) => void - Callback khi đổi màu
- `discount?`: number - Phần trăm giảm giá
- `badge?`: string - Badge tùy chỉnh
- `storage?`: string - Dung lượng (hiển thị trên ảnh)
- `isNew?`: boolean - Có phải sản phẩm mới không

---

### ProductImageGallery
**Gallery chính với carousel, zoom hint, navigation**

```tsx
<ProductImageGallery
  images={images}
  selectedIndex={selectedIndex}
  onSelect={setSelectedIndex}
  onZoom={() => setIsZoomOpen(true)}
  discount={discount}
  storage={storage}
/>
```

**Features:**
- ✅ Carousel navigation (arrows + dots)
- ✅ Touch swipe support (mobile)
- ✅ Hover zoom effect
- ✅ Zoom hint + modal trigger
- ✅ Responsive design

---

### ProductImageThumbnails
**Thumbnail dọc bên trái (desktop only)**

```tsx
<ProductImageThumbnails
  images={images}
  selectedIndex={selectedIndex}
  onSelect={setSelectedIndex}
/>
```

**Features:**
- ✅ Desktop only (hidden on mobile)
- ✅ 80px × 80px size
- ✅ Active state with ring effect
- ✅ Angle label
- ✅ Hover scale effect

---

### ProductImageBadge
**Overlay badge tinh tế trên ảnh**

```tsx
<ProductImageBadge
  discount={12}
  isNew={true}
  storage="256GB"
  badge="Trả góp 0%"
/>
```

**Badge Types:**
- **Discount** (top-left): "-12%"
- **New** (top-right): "New"
- **Storage** (bottom-right): "256GB"
- **Custom** (bottom-left): "Trả góp 0%"

---

### ProductImageZoomModal
**Modal fullscreen với zoom + pan**

```tsx
<ProductImageZoomModal
  isOpen={isZoomOpen}
  images={images}
  selectedIndex={selectedIndex}
  onClose={() => setIsZoomOpen(false)}
  onSelectImage={setSelectedIndex}
/>
```

**Features:**
- ✅ Zoom: 1x → 3x (step 0.5)
- ✅ Drag to pan
- ✅ Navigation arrows
- ✅ Image counter
- ✅ Close button

---

## 🎨 Data Structures

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

## 🚀 Usage Example

```tsx
import { ProductImageSection } from '@/components/product/product-image-section';
import type { ColorVariant } from '@/hooks/use-product-images';

export default function ProductHero({ product }: { product: Product }) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

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
        // ... more angles
      ],
    },
    // ... more colors
  ];

  return (
    <ProductImageSection
      colorVariants={colorVariants}
      selectedColorIndex={selectedColorIndex}
      onColorChange={setSelectedColorIndex}
      discount={12}
      storage="256GB"
      isNew={true}
    />
  );
}
```

---

## 📱 Responsive Behavior

### Desktop (1024px+)
- Thumbnails visible (left side)
- Navigation arrows on hover
- Click to zoom modal

### Tablet (768px - 1023px)
- Thumbnails hidden
- Swipe to navigate
- Dot indicators

### Mobile (< 768px)
- Full width gallery
- Swipe to navigate
- Dot indicators
- Double-tap to zoom

---

## 🎬 Animations

### Gallery Image
- Fade in: 300ms
- Hover scale: 105%

### Thumbnail
- Hover scale: 105%
- Border transition: 200ms

### Zoom Modal
- Fade in: 200ms
- Zoom controls: smooth

---

## 🔧 Customization

### Change Colors

```tsx
const colorVariants: ColorVariant[] = [
  {
    value: "#FF0000",
    name: "Đỏ",
    images: [/* ... */],
  },
];
```

### Change Badge Style

Edit `ProductImageBadge` component:

```tsx
// Change badge colors
<div className="bg-purple-500">...</div>

// Change badge position
<div className="absolute top-6 left-6">...</div>
```

### Change Zoom Range

Edit `ProductImageZoomModal`:

```tsx
const maxZoom = 4; // Change from 3 to 4
const minZoom = 0.5; // Change from 1 to 0.5
```

---

## 🐛 Troubleshooting

### Images not loading
- Check image URLs are correct
- Verify Next.js Image optimization is enabled
- Check CORS headers if using external images

### Zoom not working
- Ensure `onZoom` callback is passed to ProductImageGallery
- Check ProductImageZoomModal is rendered

### Touch swipe not working
- Verify touch event handlers are attached
- Check mobile viewport meta tag

### Thumbnails not showing
- Verify `lg:` breakpoint is correct (1024px)
- Check CSS is loaded

---

## 📚 Related Files

```
phone-app/src/
├── components/product/
│   ├── product-hero.tsx
│   ├── product-image-section.tsx
│   ├── product-image-gallery.tsx
│   ├── product-image-thumbnails.tsx
│   ├── product-image-badge.tsx
│   ├── product-image-zoom-modal.tsx
│   ├── product-image-gallery.css
│   └── README.md (this file)
└── hooks/
    └── use-product-images.ts
```

---

## 📖 Documentation

- [Design Document](../../PRODUCT_DETAIL_PAGE_DESIGN.md)
- [UI Mockup](../../PRODUCT_DETAIL_UI_MOCKUP.md)

