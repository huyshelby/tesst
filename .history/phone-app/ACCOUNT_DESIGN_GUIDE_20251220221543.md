# 🎨 Phone App - Account Dashboard Design Guide

> **Apple-like Minimal Design System for E-commerce Tech Store**

---

## 📐 Visual Hierarchy

### Level 1: Page Background
```
Background: #F5F5F7 (Apple Light Gray)
Purpose: Premium, không chói mắt, tách biệt sections
```

### Level 2: Card Containers
```
Background: #FFFFFF
Border Radius: 24px (2xl)
Shadow: Very subtle (0 1px 3px rgba(0,0,0,0.04))
Padding: 32px (desktop), 24px (mobile)
```

### Level 3: Interactive Elements
```
Hover State: Background #F5F5F7, transform translateY(-2px)
Active State: Scale(0.98)
Transition: 200-300ms cubic-bezier(0.4, 0, 0.2, 1)
```

---

## 🎯 Component Anatomy

### 1. User Profile Header

```
┌─────────────────────────────────────────────────────┐
│ ┌────┐                                              │
│ │    │  Nguyễn Văn A                    [Đăng xuất]│
│ │ 📸 │  ng****@example.com                          │
│ │    │  ● Khách hàng  ● Đã xác thực                │
│ └────┘                                              │
└─────────────────────────────────────────────────────┘
```

**Specs:**
- Avatar: 96×96px, rounded-full, gradient bg
- Name: 40px (32px mobile), font-weight 600, tracking -0.02em
- Email: 15px, gray-500, masked format
- Badges: rounded-full pills, 14px, border 1px
- Spacing: 24px gaps

### 2. Quick Stats Grid

```
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│   📦    │ │   🚚    │ │   ❤️     │ │   📍    │
│         │ │         │ │         │ │         │
│   12    │ │   3     │ │ Chưa có │ │Thêm đc  │
│         │ │         │ │         │ │         │
│Đơn hàng │ │Đang giao│ │Yêu thích│ │ Địa chỉ │
└─────────┘ └─────────┘ └─────────┘ └─────────┘
```

**Specs:**
- Card: 160px min-height, padding 24px
- Icon: 40px, strokeWidth 1.5
- Number: 40px (4xl), font-weight 600
- Empty: gray-50 rounded-full pill
- Label: 14px, gray-600, bottom
- Grid: 4 cols desktop, 2×2 mobile
- Gap: 16px

### 3. Menu List Items

```
┌─────────────────────────────────────────────────────┐
│ ┌────┐                                              │
│ │ 📦 │  Đơn hàng của tôi                         ›  │
│ └────┘  Theo dõi và quản lý đơn hàng                │
├─────────────────────────────────────────────────────┤
│ ┌────┐                                              │
│ │ 📍 │  Địa chỉ giao hàng            [Sắp có]      │
│ └────┘  Quản lý địa chỉ nhận hàng                   │
└─────────────────────────────────────────────────────┘
```

**Specs:**
- Min-height: 88px (mobile-friendly)
- Icon container: 48×48px, bg gray-50, rounded-xl
- Title: 15px, font-weight 600
- Description: 14px, gray-500
- Badge: amber-50 pill, 12px
- Chevron: gray-300 → gray-600 on hover
- Hover: bg gray-50, icon scale 1.05

### 4. Support Section

```
┌─────────────────────────────────────────────────────┐
│ [Dark Gradient Background]                          │
│                                                     │
│ Cần hỗ trợ?                   [Chat] [☎️ 1900 1234]│
│ Đội ngũ luôn sẵn sàng 24/7                         │
└─────────────────────────────────────────────────────┘
```

**Specs:**
- Background: gradient from-gray-800 to-gray-900
- Padding: 32px
- Border radius: 24px
- Buttons: white/10 bg, white/20 border, backdrop-blur
- Text: white (title), gray-300 (description)

---

## 🎨 Color System

### Primary Palette
```css
/* Text Colors */
--primary-text:    #1C1C1E  /* Apple Dark Gray - Headings */
--secondary-text:  #48484A  /* Medium Gray - Body */
--tertiary-text:   #8E8E93  /* Light Gray - Labels */

/* Background Colors */
--bg-page:         #F5F5F7  /* Page background */
--bg-card:         #FFFFFF  /* Cards, modals */
--bg-hover:        #F5F5F7  /* Hover states */
--bg-active:       #E5E5EA  /* Active/pressed */

/* Border Colors */
--border-light:    #E5E5EA  /* Subtle borders */
--border-medium:   #D1D1D6  /* Visible borders */
```

### Accent Colors (Minimal Use)
```css
--accent-blue:     #007AFF  /* iOS Blue - Links, primary actions */
--accent-green:    #34C759  /* iOS Green - Success states */
--accent-red:      #FF3B30  /* iOS Red - Errors */
--accent-amber:    #FF9500  /* iOS Orange - Warnings */
```

### Status Colors
```css
/* Success */
--success-bg:      #ECFDF5
--success-border:  #A7F3D0
--success-text:    #059669

/* Error */
--error-bg:        #FEF2F2
--error-border:    #FECACA
--error-text:      #DC2626

/* Warning */
--warning-bg:      #FFFBEB
--warning-border:  #FDE68A
--warning-text:    #D97706
```

---

## 📏 Typography Scale

### Desktop
```
Hero:     40px / 600 / -0.02em  (User name)
H2:       24px / 600 / -0.02em  (Section titles)
H3:       20px / 600 / -0.02em  (Card titles)
Body L:   17px / 400 / 0        (Important text)
Body:     15px / 400 / 0        (Standard text)
Body S:   14px / 400 / 0        (Secondary text)
Caption:  12px / 500 / 0.01em   (Labels, badges)
```

### Mobile Adjustments
```
Hero:     32px  (↓ 8px)
H2:       20px  (↓ 4px)
H3:       18px  (↓ 2px)
```

### Font Stack
```css
font-family: 
  'Inter',
  -apple-system,
  BlinkMacSystemFont,
  'SF Pro Display',
  'Segoe UI',
  sans-serif;
```

---

## 📐 Spacing System

### Base Unit: 4px

```
xs:   8px   (0.5rem)   /* Tight gaps */
sm:   12px  (0.75rem)  /* Small gaps */
md:   16px  (1rem)     /* Standard gaps */
lg:   24px  (1.5rem)   /* Section gaps */
xl:   32px  (2rem)     /* Large gaps */
2xl:  48px  (3rem)     /* Extra large gaps */
3xl:  64px  (4rem)     /* Hero spacing */
```

### Component Spacing
```
Card padding:       32px (desktop), 24px (mobile)
Grid gap:           16px
Menu item padding:  24px vertical, 24px horizontal
Button padding:     10px vertical, 20px horizontal
```

---

## 🔲 Border Radius

```css
--radius-sm:   6px    /* Small elements (badges) */
--radius-md:   8px    /* Standard (inputs) */
--radius-lg:   12px   /* Cards (stat cards) */
--radius-xl:   16px   /* Large cards */
--radius-2xl:  24px   /* Hero cards */
--radius-full: 9999px /* Pills, buttons */
```

---

## 🌈 Shadows (Subtle)

```css
/* Very subtle - Default cards */
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.04);

/* Subtle - Hover state */
--shadow-md: 0 4px 12px 0 rgba(0, 0, 0, 0.08);

/* Medium - Elevated cards */
--shadow-lg: 0 8px 24px 0 rgba(0, 0, 0, 0.12);

/* Large - Modals, overlays */
--shadow-xl: 0 20px 40px 0 rgba(0, 0, 0, 0.16);
```

**Rule:** Đổ bóng rất nhẹ, tránh harsh shadows

---

## ✨ Animations

### Transitions
```css
/* Default - Most interactions */
transition: all 0.2s ease;

/* Smooth - Premium feel */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Fast - Immediate feedback */
transition: all 0.15s ease-out;
```

### Hover Effects
```css
/* Lift Effect (Cards) */
transform: translateY(-4px);
box-shadow: 0 8px 24px rgba(0,0,0,0.12);

/* Scale (Icons) */
transform: scale(1.05);

/* Slide (Chevron) */
transform: translateX(4px);
```

### Loading States
```css
/* Pulse (Skeleton) */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Spin (Uploading) */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
sm:  640px   /* Small tablets */
md:  768px   /* Tablets */
lg:  1024px  /* Laptops */
xl:  1280px  /* Desktops */
2xl: 1536px  /* Large screens */
```

### Responsive Patterns

**Stats Grid:**
```
Mobile:  2×2 grid
Tablet:  4 columns
Desktop: 4 columns
```

**Typography:**
```
Mobile:  Smaller sizes, tighter line-height
Desktop: Full sizes, comfortable reading
```

**Spacing:**
```
Mobile:  16px padding, 12px gaps
Desktop: 32px padding, 16px gaps
```

---

## ♿ Accessibility Guidelines

### Touch Targets
```
Minimum: 44×44px (Apple HIG)
Recommended: 48×48px (Material Design)
Account Menu: 88px min-height (extra comfortable)
```

### Color Contrast
```
AA Standard (Normal text): 4.5:1
AA Standard (Large text):  3:1
AAA Standard:              7:1

Used ratios:
- #1C1C1E on #FFFFFF: 15.5:1 ✅
- #8E8E93 on #FFFFFF: 4.6:1 ✅
```

### Focus States
```css
outline: 2px solid #007AFF;
outline-offset: 2px;
border-radius: inherit;
```

### Keyboard Navigation
```
Tab:       Next focusable
Shift+Tab: Previous focusable
Enter:     Activate link/button
Space:     Toggle button
Esc:       Close modal/dismiss
```

---

## 🎯 Design Principles

### 1. **Minimal First**
- Nhiều khoảng trắng (whitespace)
- Không gradient mạnh
- Màu sắc tinh tế
- Typography rõ ràng

### 2. **Premium Feel**
- Đổ bóng nhẹ, tinh tế
- Bo góc mềm mại
- Animations mượt mà
- High-quality imagery

### 3. **User-Centric**
- Empty states hữu ích
- Loading states rõ ràng
- Error messages thân thiện
- Feedback tức thì

### 4. **Performance**
- Hardware-accelerated animations
- Lazy loading images
- Optimized fonts
- Minimal reflows

### 5. **Consistency**
- Unified spacing system
- Consistent iconography
- Predictable interactions
- Semantic naming

---

## 🔧 Implementation Checklist

### Must Have ✅
- [x] Responsive design (mobile-first)
- [x] Loading states (skeleton)
- [x] Empty states (helpful)
- [x] Hover states (all interactive)
- [x] Focus states (keyboard nav)
- [x] Error handling (graceful)
- [x] Type safety (TypeScript)
- [x] Accessibility (WCAG AA)

### Nice to Have 🎁
- [ ] Dark mode support
- [ ] Reduced motion respect
- [ ] RTL support
- [ ] Offline states
- [ ] Success animations
- [ ] Haptic feedback (mobile)

---

## 📊 Performance Metrics

### Target Metrics
```
First Contentful Paint:  < 1.8s
Largest Contentful Paint: < 2.5s
Time to Interactive:      < 3.8s
Cumulative Layout Shift:  < 0.1
First Input Delay:        < 100ms
```

### Optimization Strategies
```
✅ Use next/image for avatars
✅ Lazy load off-screen content
✅ Debounce hover animations
✅ Use CSS transforms (GPU)
✅ Minimize bundle size
✅ Code splitting by route
```

---

## 🎨 Brand Guidelines

### Voice & Tone
```
✅ Friendly, approachable
✅ Professional, trustworthy
✅ Helpful, encouraging
❌ Technical jargon
❌ Overly formal
❌ Condescending
```

### Messaging Examples
```
Empty State:
❌ "No data available"
✅ "Bạn chưa có đơn hàng nào"

Error:
❌ "Upload failed"
✅ "Không thể tải ảnh lên. Vui lòng thử lại"

Success:
❌ "Success"
✅ "Ảnh đại diện đã được cập nhật!"
```

---

## 🚀 Next Steps

1. **Integration:**
   - Connect real API endpoints
   - Implement avatar upload
   - Add toast notifications
   - Setup analytics tracking

2. **Enhancement:**
   - Add more empty states
   - Implement dark mode
   - Add micro-interactions
   - Optimize images

3. **Testing:**
   - Cross-browser testing
   - Accessibility audit
   - Performance testing
   - User acceptance testing

---

**Designed with ❤️ for premium tech e-commerce experience**
