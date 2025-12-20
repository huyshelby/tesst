'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Warehouse,
  Tag,
  Star,
  Shield,
  Settings,
  ChevronLeft,
  DollarSign,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: DollarSign, label: 'Tài chính', href: '/financial' },
  { icon: Package, label: 'Sản phẩm', href: '/products' },
  { icon: ShoppingCart, label: 'Đơn hàng', href: '/orders' },
  { icon: Users, label: 'Khách hàng', href: '/customers' },
  { icon: Warehouse, label: 'Kho hàng', href: '/inventory' },
  { icon: Tag, label: 'Khuyến mãi', href: '/promotions' },
  { icon: Star, label: 'Đánh giá', href: '/reviews' },
  { icon: Shield, label: 'Phân quyền', href: '/users' },
  { icon: Settings, label: 'Cài đặt', href: '/settings' },
]

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-20 h-screen bg-white border-r border-gray-200 transition-all duration-200',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!isCollapsed && <span className="text-xl font-bold text-gray-900">Admin</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn('ml-auto', isCollapsed && 'mx-auto')}
        >
          <ChevronLeft
            className={cn('w-5 h-5 transition-transform', isCollapsed && 'rotate-180')}
          />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-100',
                isCollapsed && 'justify-center'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
