import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Customer } from '@/types/models'

interface GetCustomersParams {
  page?: number
  limit?: number
  search?: string
  role?: 'USER' | 'ADMIN'
}

interface GetCustomersResponse {
  data: Customer[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface UpdateRoleParams {
  userId: string
  role: 'USER' | 'ADMIN'
}

// Get all customers (admin only)
export function useCustomers(params?: GetCustomersParams) {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: async () => {
      const response = await api.get<GetCustomersResponse>('/admin/users', {
        params,
      })
      return response.data
    },
  })
}

// Get single customer by ID
export function useCustomer(userId: string) {
  return useQuery({
    queryKey: ['customers', userId],
    queryFn: async () => {
      const response = await api.get<Customer>(`/admin/users/${userId}`)
      return response.data
    },
    enabled: !!userId,
  })
}

// Get customer with orders
export function useCustomerWithOrders(userId: string) {
  return useQuery({
    queryKey: ['customers', userId, 'orders'],
    queryFn: async () => {
      const [customerRes, ordersRes] = await Promise.all([
        api.get<Customer>(`/admin/users/${userId}`),
        api.get(`/orders/admin`, { params: { userId } }),
      ])

      const customer = customerRes.data
      const orders = ordersRes.data.orders || []

      return {
        ...customer,
        orders,
        totalOrders: orders.length,
        totalSpent: orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0),
      }
    },
    enabled: !!userId,
  })
}

// Update customer role
export function useUpdateCustomerRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, role }: UpdateRoleParams) => {
      const response = await api.put(`/admin/users/${userId}/role`, { role })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

// Delete customer
export function useDeleteCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string) => {
      await api.delete(`/admin/users/${userId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

// Revoke customer sessions (force logout)
export function useRevokeCustomerSessions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string) => {
      await api.post(`/admin/users/${userId}/revoke-sessions`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

// Get customer stats
export function useCustomerStats() {
  return useQuery({
    queryKey: ['customers', 'stats'],
    queryFn: async () => {
      const response = await api.get('/admin/stats')
      return response.data
    },
  })
}
