# 🚀 Quick Start - Account Dashboard

## Cài đặt & Chạy

### 1. Start Development Server

```bash
cd phone-app
npm install
npm run dev
```

Truy cập: http://localhost:3000/account

---

## 📦 Files Created

```
phone-app/
├── src/
│   ├── app/
│   │   └── account/
│   │       ├── page.tsx              # ✨ Main account page (REDESIGNED)
│   │       ├── account.css           # 🎨 Custom design system
│   │       └── layout.tsx            # (existing)
│   │
│   └── components/
│       └── account/
│           ├── index.ts              # 📤 Barrel export
│           ├── avatar-upload.tsx     # 🖼️ Avatar with upload
│           ├── account-skeleton.tsx  # ⏳ Loading state
│           ├── stat-card.tsx         # 📊 Stat cards
│           ├── menu-item.tsx         # 📋 Menu list item
│           ├── empty-state.tsx       # 📭 Empty state
│           ├── toast.tsx             # 🔔 Toast notification
│           └── README.md             # 📚 Component docs
│
├── ACCOUNT_DASHBOARD_DESIGN.md       # 📄 Implementation summary
└── ACCOUNT_DESIGN_GUIDE.md          # 🎨 Complete design guide
```

---

## 🎯 What's New?

### ✨ Key Improvements

1. **Apple-like Minimal Design**
   - Clean, spacious layout
   - Subtle shadows
   - Premium feel

2. **Avatar Upload**
   - Hover to reveal upload button
   - File validation (type & size)
   - Preview before upload
   - Loading state

3. **Smart Empty States**
   - Helpful messages when value = 0
   - CTAs to guide users
   - Never show naked "0"

4. **Enhanced UX**
   - Skeleton loading (no flash)
   - Smooth animations
   - Mobile-optimized
   - Accessibility-first

---

## 💻 Usage

### Import Components

```tsx
import {
  AvatarUpload,
  AccountSkeleton,
  StatCard,
  MenuItem,
  EmptyState,
  Toast,
} from '@/components/account';
```

### Basic Example

```tsx
"use client";

import { useAuth } from '@/lib/auth-client';
import { AccountSkeleton, StatCard } from '@/components/account';
import { Package } from 'lucide-react';

export default function AccountPage() {
  const { user, loading } = useAuth();

  if (loading) return <AccountSkeleton />;
  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#F5F5F7] py-12">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Your content */}
        <StatCard
          icon={Package}
          label="Đơn hàng"
          value={orderCount}
          href="/account/orders"
          emptyMessage="Chưa có đơn"
        />
      </div>
    </main>
  );
}
```

---

## 🎨 Customization

### Override Styles

```tsx
<StatCard
  {...props}
  className="shadow-2xl hover:scale-110"
/>
```

### Custom Colors

```tsx
<StatCard
  icon={Heart}
  color="text-red-500"  // Custom color
  {...props}
/>
```

### Custom Empty State

```tsx
import { EmptyState } from '@/components/account';
import { ShoppingBag } from 'lucide-react';

<EmptyState
  icon={ShoppingBag}
  title="Chưa có đơn hàng"
  description="Bắt đầu mua sắm ngay để trải nghiệm dịch vụ tốt nhất"
  actionLabel="Mua sắm ngay"
  actionHref="/products"
/>
```

---

## 🔌 Backend Integration

### Connect Stats API

Update `page.tsx`:

```typescript
// Thay mock data
const stats = {
  orders: 0,
  shipping: 0,
  wishlist: 0,
  addresses: 0,
};

// Bằng real API calls
const [stats, setStats] = useState({
  orders: 0,
  shipping: 0,
  wishlist: 0,
  addresses: 0,
});

useEffect(() => {
  async function loadStats() {
    const [orders, shipping, wishlist, addresses] = await Promise.all([
      fetchOrdersCount(),
      fetchShippingCount(),
      fetchWishlistCount(),
      fetchAddressesCount(),
    ]);
    
    setStats({ orders, shipping, wishlist, addresses });
  }
  
  loadStats();
}, []);
```

### Implement Avatar Upload

```typescript
const handleAvatarUpload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const res = await fetchApi('/user/avatar', {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData
      },
      body: formData,
    });
    
    if (!res.ok) {
      throw new Error('Upload failed');
    }
    
    const data = await res.json();
    
    // Update user state
    // Show success toast
    console.log('Avatar uploaded:', data);
    
  } catch (error) {
    console.error('Upload error:', error);
    // Show error toast
    throw error;
  }
};
```

### Add Toast Notifications

```tsx
import { useState } from 'react';
import { Toast } from '@/components/account';

function AccountPage() {
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleUpload = async (file: File) => {
    try {
      await uploadAvatar(file);
      setToast({
        type: 'success',
        message: 'Ảnh đại diện đã được cập nhật!',
      });
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Không thể tải ảnh lên. Vui lòng thử lại.',
      });
    }
    
    // Auto dismiss after 3s
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <>
      {/* Your page content */}
      
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <Toast type={toast.type} message={toast.message} />
        </div>
      )}
    </>
  );
}
```

---

## 🎯 TODO: Next Features

### High Priority
- [ ] Connect orders API
- [ ] Implement avatar upload endpoint
- [ ] Add toast notification system
- [ ] Create "Sắp có" pages (wishlist, addresses, etc.)

### Medium Priority
- [ ] Profile edit modal
- [ ] Email verification
- [ ] Order history timeline
- [ ] Dark mode toggle

### Low Priority
- [ ] Achievement badges
- [ ] Referral program
- [ ] Loyalty points
- [ ] Activity log

---

## 🐛 Troubleshooting

### Avatar Upload Not Working

**Problem:** Upload button doesn't appear on hover

**Solution:**
```css
/* Check if hover is disabled */
@media (hover: none) {
  /* Show button by default on touch devices */
}
```

### Stats Show 0 Even With Data

**Problem:** Real data not loading

**Solution:**
```typescript
// Debug API calls
console.log('Stats API response:', statsData);

// Check auth state
console.log('User authenticated:', !!user);
```

### Layout Jumps on Load

**Problem:** Content shifts when loading completes

**Solution:**
```typescript
// Always use skeleton with same dimensions
if (loading) return <AccountSkeleton />;
```

---

## 📚 Documentation

- **Full Design Guide:** [ACCOUNT_DESIGN_GUIDE.md](./ACCOUNT_DESIGN_GUIDE.md)
- **Implementation Summary:** [ACCOUNT_DASHBOARD_DESIGN.md](./ACCOUNT_DASHBOARD_DESIGN.md)
- **Component Docs:** [src/components/account/README.md](./src/components/account/README.md)

---

## 🎨 Design Tokens (Quick Ref)

```css
/* Colors */
--primary-text: #1C1C1E
--page-bg: #F5F5F7
--card-bg: #FFFFFF

/* Spacing */
--gap-sm: 12px
--gap-md: 16px
--gap-lg: 24px

/* Radius */
--radius-xl: 16px
--radius-2xl: 24px
--radius-full: 9999px

/* Shadows */
--shadow-sm: 0 1px 3px rgba(0,0,0,0.04)
--shadow-md: 0 4px 12px rgba(0,0,0,0.08)
--shadow-lg: 0 8px 24px rgba(0,0,0,0.12)
```

---

## ✅ Testing Checklist

Before shipping:

- [ ] Test on Chrome, Safari, Firefox, Edge
- [ ] Test on iOS Safari, Chrome Mobile
- [ ] Test keyboard navigation (Tab, Enter, Space)
- [ ] Test screen reader (NVDA, VoiceOver)
- [ ] Test with slow 3G connection
- [ ] Test with very long user names
- [ ] Test all empty states
- [ ] Test all error states
- [ ] Test responsive breakpoints
- [ ] Run Lighthouse audit (target: 90+)

---

## 🚀 Deployment

```bash
# Build for production
npm run build

# Start production server
npm start

# Or deploy to Vercel
vercel --prod
```

---

## 💡 Tips

1. **Always use skeleton loading** - Never show blank content
2. **Empty states are UX gold** - Guide users what to do
3. **Animations should be subtle** - Less is more
4. **Touch targets ≥ 48px** - Mobile-friendly
5. **Test with real data** - Edge cases reveal bugs

---

**Need help? Check the docs or raise an issue!**

Happy coding! 🎉
