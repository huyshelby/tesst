'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { cn } from '@/lib/utils'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />

      <div className={cn('transition-all duration-200', isCollapsed ? 'ml-16' : 'ml-64')}>
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

