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

// Update payment status (Admin)
export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ orderId, paymentStatus, cryptoTxHash }: { 
      orderId: string
      paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
      cryptoTxHash?: string 
    }) => {
      const response = await api.put(`/orders/admin/${orderId}/payment`, { 
        paymentStatus,
        cryptoTxHash 
      })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders', variables.orderId] })
      toast.success('Cập nhật trạng thái thanh toán thành công')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể cập nhật trạng thái thanh toán')
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

// Delete order (Admin only)
export function useDeleteOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await api.delete(`/orders/admin/${orderId}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast.success('Đơn hàng đã được xóa thành công')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể xóa đơn hàng')
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
