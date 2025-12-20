import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { toast } from 'sonner'
import type { Order } from '@/types/models'

interface OrderFilters {
  status?: string
  search?: string
  startDate?: string
  endDate?: string
  paymentMethod?: string
  page?: number
  limit?: number
}

interface UpdateOrderStatusData {
  status: 'CONFIRMED' | 'PROCESSING' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED'
}

// Get all orders (Admin only)
export function useOrders(filters?: OrderFilters) {
  return useQuery<{ orders: Order[]; pagination: any }>({
    queryKey: ['orders', filters],
    queryFn: async () => {
      const { data } = await api.get('/orders/admin/all', { params: filters })
      return data
    },
  })
}

// Get single order by ID
export function useOrder(orderId: string) {
  return useQuery<Order>({
    queryKey: ['orders', orderId],
    queryFn: async () => {
      const { data } = await api.get(`/orders/${orderId}`)
      return data
    },
    enabled: !!orderId,
  })
}

// Update order status (Admin)
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED' }) => {
      const response = await api.put(`/orders/admin/${orderId}/status`, { status })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders', variables.orderId] })
      toast.success('Cập nhật trạng thái thành công')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể cập nhật trạng thái')
    },
  })
}

// Cancel order
export function useCancelOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await api.post(`/orders/${orderId}/cancel`)
      return response.data
    },
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders', orderId] })
      toast.success('Đã hủy đơn hàng')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể hủy đơn hàng')
    },
  })
}

// Get order statistics
export function useOrderStats() {
  return useQuery({
    queryKey: ['orders', 'stats'],
    queryFn: async () => {
      const { data } = await api.get('/orders/admin/stats')
      return data
    },
  })
}
