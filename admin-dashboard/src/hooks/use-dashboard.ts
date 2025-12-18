import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export interface DashboardStats {
  revenue: {
    total: number
    change: number // Percentage change from previous period
    trend: 'up' | 'down' | 'neutral'
  }
  orders: {
    total: number
    pending: number
    processing: number
    delivered: number
    cancelled: number
    change: number
  }
  customers: {
    total: number
    active: number
    new: number
    change: number
  }
  products: {
    total: number
    active: number
    outOfStock: number
    lowStock: number
  }
}

export interface RevenueChartData {
  date: string
  revenue: number
  orders: number
}

export interface OrderStatusDistribution {
  status: string
  count: number
  percentage: number
  color: string
}

export interface RecentOrder {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  totalAmount: number
  status: string
  paymentStatus: string
  createdAt: string
}

export interface BestSellingProduct {
  id: string
  name: string
  slug: string
  image: string | null
  totalSold: number
  revenue: number
  category: string
}

// Get dashboard statistics
export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const { data } = await api.get('/admin/dashboard/stats')
      return data
    },
    refetchInterval: 60000, // Refetch every minute
  })
}

// Get revenue chart data
export function useRevenueChart(period: '7days' | '30days' | '12months' = '7days') {
  return useQuery<RevenueChartData[]>({
    queryKey: ['dashboard', 'revenue', period],
    queryFn: async () => {
      const { data } = await api.get('/admin/dashboard/revenue', {
        params: { period },
      })
      return data
    },
  })
}

// Get order status distribution
export function useOrderStatusDistribution() {
  return useQuery<OrderStatusDistribution[]>({
    queryKey: ['dashboard', 'order-status'],
    queryFn: async () => {
      const { data } = await api.get('/admin/dashboard/order-status')
      return data
    },
  })
}

// Get recent orders
export function useRecentOrders(limit: number = 10) {
  return useQuery<RecentOrder[]>({
    queryKey: ['dashboard', 'recent-orders', limit],
    queryFn: async () => {
      const { data } = await api.get('/admin/dashboard/recent-orders', {
        params: { limit },
      })
      return data
    },
  })
}

// Get best selling products
export function useBestSellingProducts(limit: number = 5) {
  return useQuery<BestSellingProduct[]>({
    queryKey: ['dashboard', 'best-selling', limit],
    queryFn: async () => {
      const { data } = await api.get('/admin/dashboard/best-selling', {
        params: { limit },
      })
      return data
    },
  })
}
