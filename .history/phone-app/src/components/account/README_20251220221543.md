# Account Dashboard Components

## Quick Reference

### Import Components

```typescript
import {
  AvatarUpload,
  AccountSkeleton,
  StatCard,
  MenuItem,
} from '@/components/account';
```

---

## 📦 Components

### 1. AvatarUpload

**Upload & display user avatar with hover interaction**

```tsx
import { AvatarUpload } from '@/components/account';

function MyComponent() {
  const handleUpload = async (file: File) => {
    // Your upload logic
    const formData = new FormData();
    formData.append('avatar', file);
    await uploadAvatar(formData);
  };

  return (
    <AvatarUpload 
      user={user} 
      onUpload={handleUpload}
      className="mx-auto"
    />
  );
}
```

**Props:**
- `user: { name?: string; email: string; avatar?: string }` - User data
- `onUpload?: (file: File) => Promise<void>` - Upload handler
- `className?: string` - Additional CSS classes

**Features:**
- Auto-generates initials if no avatar
- Validates file type & size (max 5MB)
- Shows preview before upload
- Loading state during upload
- Hover overlay with camera icon

---

### 2. AccountSkeleton

**Loading skeleton for account page**

```tsx
import { AccountSkeleton } from '@/components/account';

function AccountPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <AccountSkeleton />;
  }

  return <div>Account content...</div>;
}
```

**Props:** None

**Features:**
- Matches actual layout structure
- Pulse animation
- Prevents layout shift

---

### 3. StatCard

**Statistic card with empty state**

```tsx
import { StatCard } from '@/components/account';
import { Package } from 'lucide-react';

function Stats() {
  return (
    <StatCard
      icon={Package}
      label="Đơn hàng"
      value={orderCount}
      href="/account/orders"
      emptyMessage="Chưa có đơn"
      color="text-gray-900"
    />
  );
}
```

**Props:**
- `icon: LucideIcon` - Icon component from lucide-react
- `label: string` - Card label
- `value: number` - Stat value (0 shows empty state)
- `href: string` - Link destination
- `emptyMessage: string` - Message when value is 0
- `color?: string` - Icon/number color (default: gray-900)
- `className?: string` - Additional CSS

**Features:**
- Hover lift effect
- Empty state when value = 0
- Fully clickable card
- Responsive design

---

### 4. MenuItem

**Account menu list item**

```tsx
import { MenuItem } from '@/components/account';
import { Settings } from 'lucide-react';

function Menu() {
  return (
    <MenuItem
      icon={Settings}
      title="Cài đặt tài khoản"
      description="Thông tin cá nhân & bảo mật"
      href="/account/settings"
      badge="Sắp có"
      disabled={true}
    />
  );
}
```

**Props:**
- `icon: LucideIcon` - Icon component
- `title: string` - Menu item title
- `description: string` - Description text
- `href: string` - Link destination
- `badge?: string` - Badge text (optional)
- `disabled?: boolean` - Disable interaction (default: false)

**Features:**
- Hover background change
- Icon scale animation
- Chevron animation on hover
- Badge for upcoming features
- Disabled state

---

## 🎨 Design Tokens

All components follow the Apple-like minimal design system:

### Colors
```css
Text: #1C1C1E (primary), #48484A (secondary), #8E8E93 (tertiary)
Background: #FFFFFF (card), #F5F5F7 (page)
Border: #E5E5EA, #D1D1D6
```

### Typography
```css
Headings: font-weight 600, tracking -0.02em
Body: 15px (base), 14px (small)
```

### Spacing
```css
Gap: 16px (standard)
Padding: 24px (card), 16px (mobile)
```

### Animation
```css
Duration: 200-300ms
Easing: cubic-bezier(0.4, 0, 0.2, 1)
```

---

## 📱 Responsive Behavior

### Desktop (≥768px)
- Stat cards: 4 columns
- Full padding & spacing
- Larger typography

### Mobile (<768px)
- Stat cards: 2×2 grid
- Reduced padding
- Smaller typography
- Center-aligned avatar

---

## ♿ Accessibility

All components include:
- ✅ Keyboard navigation
- ✅ Focus visible states
- ✅ ARIA labels where needed
- ✅ Min touch target: 48px
- ✅ Proper semantic HTML

---

## 🎯 Usage Examples

### Complete Account Page

```tsx
"use client";

import { useAuth } from '@/lib/auth-client';
import {
  AvatarUpload,
  AccountSkeleton,
  StatCard,
  MenuItem,
} from '@/components/account';
import { Package, Heart, MapPin, Settings } from 'lucide-react';

export default function AccountPage() {
  const { user, loading } = useAuth();

  if (loading) return <AccountSkeleton />;
  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#F5F5F7] py-12">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Header */}
        <section className="bg-white rounded-2xl p-8 mb-6">
          <div className="flex gap-6">
            <AvatarUpload user={user} onUpload={handleUpload} />
            <div>
              <h1 className="text-3xl font-semibold">{user.name}</h1>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Package}
            label="Đơn hàng"
            value={stats.orders}
            href="/account/orders"
            emptyMessage="Chưa có đơn"
          />
          {/* More stats... */}
        </section>

        {/* Menu */}
        <section className="bg-white rounded-2xl overflow-hidden">
          <div className="divide-y">
            <MenuItem
              icon={Settings}
              title="Cài đặt"
              description="Quản lý tài khoản"
              href="/account/settings"
            />
            {/* More items... */}
          </div>
        </section>
      </div>
    </main>
  );
}
```

---

## 🔧 Customization

### Override Styles

All components accept `className` prop:

```tsx
<StatCard
  {...props}
  className="custom-shadow hover:scale-105"
/>
```

### Custom Colors

Pass custom color via `color` prop:

```tsx
<StatCard
  icon={Heart}
  color="text-red-500"
  {...props}
/>
```

---

## 📚 Related Documentation

- [Main Account Dashboard Design](../../../ACCOUNT_DASHBOARD_DESIGN.md)
- [Custom CSS Classes](../../app/account/account.css)
- [Design System Guide](../../../DESIGN_SYSTEM.md)
