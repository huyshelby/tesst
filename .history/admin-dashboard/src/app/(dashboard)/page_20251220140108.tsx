'use client'

import { useEffect, useState } from 'react'
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, AlertCircle } from 'lucide-react'
import { useDashboardStats } from '@/hooks/use-dashboard'
import { StatCard } from '@/components/dashboard/stat-card'
import dynamic from 'next/dynamic'
import { RecentOrdersTable } from '@/components/dashboard/recent-orders-table'
import { BestSellingProducts } from '@/components/dashboard/best-selling-products'
import { RevenueBreakdown } from '@/components/dashboard/revenue-breakdown'
import { formatCurrencyCompactVN } from '@/lib/utils'

const RevenueChart = dynamic(() => import('@/components/dashboard/revenue-chart').then(m => m.RevenueChart), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 h-80 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  ),
})

const OrderStatusChart = dynamic(
  () => import('@/components/dashboard/order-status-chart').then(m => m.OrderStatusChart),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 h-80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    ),
  }
)

export default function DashboardPage() {
  const { data: stats, isLoading, error } = useDashboardStats()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Tổng quan hoạt động kinh doanh của bạn</p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="text-red-800 font-medium">Không thể tải dữ liệu</h3>
            <p className="text-red-700 text-sm">
              Vui lòng kiểm tra kết nối backend hoặc thử lại sau.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Doanh thu (30 ngày)"
          value={stats ? formatCurrencyCompactVN(stats.revenue.total) : '0đ'}
          change={stats?.revenue.change}
          trend={stats?.revenue.trend}
          icon={DollarSign}
          iconColor="text-green-600"
          loading={isLoading}
        />
        <StatCard
          title="Đơn hàng (30 ngày)"
          value={stats?.orders.total || 0}
          change={stats?.orders.change}
          trend={stats?.orders.change && stats.orders.change > 0 ? 'up' : 'down'}
          icon={ShoppingCart}
          iconColor="text-blue-600"
          subtitle={`${stats?.orders.pending || 0} chờ xử lý`}
          loading={isLoading}
        />
        <StatCard
          title="Khách hàng"
          value={stats?.customers.total || 0}
          change={stats?.customers.change}
          trend={stats?.customers.change && stats.customers.change > 0 ? 'up' : 'down'}
          icon={Users}
          iconColor="text-purple-600"
          subtitle={`${stats?.customers.new || 0} khách mới`}
          loading={isLoading}
        />
        <StatCard
          title="Sản phẩm"
          value={stats?.products.total || 0}
          icon={Package}
          iconColor="text-orange-600"
          subtitle={`${stats?.products.lowStock || 0} sắp hết`}
          loading={isLoading}
        />
      </div>

      {/* Revenue Breakdown */}
      {stats && (
        <RevenueBreakdown revenue={stats.revenue} loading={isLoading} />
      )}

      {/* Quick Alerts */}
      {stats && (stats.products.outOfStock > 0 || stats.products.lowStock > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-amber-800 font-medium">Cảnh báo tồn kho</h3>
            <p className="text-amber-700 text-sm mt-1">
              {stats.products.outOfStock > 0 && (
                <span className="font-medium">{stats.products.outOfStock} sản phẩm hết hàng</span>
              )}
              {stats.products.outOfStock > 0 && stats.products.lowStock > 0 && ', '}
              {stats.products.lowStock > 0 && (
                <span className="font-medium">{stats.products.lowStock} sản phẩm sắp hết hàng</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />
        <OrderStatusChart />
      </div>

      {/* Tables Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrdersTable />
        </div>
        <div>
          <BestSellingProducts />
        </div>
      </div>

      {/* System Status Footer */}
      <div className="grid gap-4 md:grid-cols-3 pt-4 border-t border-gray-200">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-900">Backend API</span>
          </div>
          <p className="text-xs text-green-700">http://localhost:4000</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-900">Admin Dashboard</span>
          </div>
          <p className="text-xs text-green-700">http://localhost:3001</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-900">Database</span>
          </div>
          <p className="text-xs text-green-700">PostgreSQL Connected</p>
        </div>
      </div>
    </div>
  )
}
