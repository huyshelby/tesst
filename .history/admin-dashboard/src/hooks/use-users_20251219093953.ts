import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { toast } from 'sonner'
import { User } from '@/types/models'

// Extended user type for admin management
export interface AdminUser extends User {
  isActive?: boolean
  lastLoginAt?: string
  totalOrders?: number
  totalSpent?: number
}

interface UserFilters {
  search?: string
  role?: 'USER' | 'ADMIN'
  isActive?: boolean
  page?: number
  limit?: number
}

interface CreateUserData {
  email: string
  password: string
  name: string
  role: 'USER' | 'ADMIN'
}

interface UpdateUserData {
  name?: string
  role?: 'USER' | 'ADMIN'
  isActive?: boolean
}

// Get all users with filters
export function useUsers(filters?: UserFilters) {
  return useQuery<AdminUser[]>({
    queryKey: ['admin-users', filters],
    queryFn: async () => {
      const { data } = await api.get('/admin/users', { params: filters })
      return data.data || []
    },
  })
}

// Get single user by ID
export function useUser(id: string) {
  return useQuery<AdminUser>({
    queryKey: ['admin-users', id],
    queryFn: async () => {
      const { data } = await api.get(`/admin/users/${id}`)
      return data
    },
    enabled: !!id,
  })
}

// Create new user (not implemented in backend yet)
export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateUserData) => {
      const response = await api.post('/admin/users', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('Đã tạo tài khoản thành công')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể tạo tài khoản')
    },
  })
}

// Update user (not implemented in backend yet)
export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserData }) => {
      const response = await api.put(`/admin/users/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('Đã cập nhật tài khoản')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể cập nhật tài khoản')
    },
  })
}

// Change user role
export function useChangeUserRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: 'USER' | 'ADMIN' }) => {
      const response = await api.put(`/admin/users/${id}/role`, { role })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('Đã thay đổi quyền người dùng')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể thay đổi quyền')
    },
  })
}

// Toggle user active status (not implemented in backend yet)
export function useToggleUserStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await api.patch(`/admin/users/${id}/status`, { isActive })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success(variables.isActive ? 'Đã kích hoạt tài khoản' : 'Đã khóa tài khoản')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể thay đổi trạng thái')
    },
  })
}

// Delete user
export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/users/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('Đã xóa tài khoản')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể xóa tài khoản')
    },
  })
}

// Get user statistics
export function useUserStats() {
  return useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const { data } = await api.get('/admin/stats')
      return {
        total: data.totalUsers || 0,
        admins: data.totalAdmins || 0,
        users: data.usersByRole?.user || 0,
        active: data.totalUsers - (data.blockedUsers || 0),
        blocked: data.blockedUsers || 0,
        newThisMonth: data.recentUsers || 0,
      }
    },
  })
}
