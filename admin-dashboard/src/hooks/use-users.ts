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

// Mock data for users management
const mockUsers: AdminUser[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'ADMIN',
    isActive: true,
    lastLoginAt: '2024-12-18T10:30:00Z',
    totalOrders: 0,
    totalSpent: 0,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-12-18T10:30:00Z',
  },
  {
    id: '2',
    email: 'user1@example.com',
    name: 'Nguyễn Văn A',
    role: 'USER',
    isActive: true,
    lastLoginAt: '2024-12-17T15:20:00Z',
    totalOrders: 12,
    totalSpent: 45000000,
    createdAt: '2024-03-20T14:00:00Z',
    updatedAt: '2024-12-17T15:20:00Z',
  },
  {
    id: '3',
    email: 'user2@example.com',
    name: 'Trần Thị B',
    role: 'USER',
    isActive: true,
    lastLoginAt: '2024-12-16T09:00:00Z',
    totalOrders: 8,
    totalSpent: 32000000,
    createdAt: '2024-05-10T11:30:00Z',
    updatedAt: '2024-12-16T09:00:00Z',
  },
  {
    id: '4',
    email: 'manager@example.com',
    name: 'Lê Văn C',
    role: 'ADMIN',
    isActive: true,
    lastLoginAt: '2024-12-18T08:45:00Z',
    totalOrders: 0,
    totalSpent: 0,
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-12-18T08:45:00Z',
  },
  {
    id: '5',
    email: 'user3@example.com',
    name: 'Phạm Thị D',
    role: 'USER',
    isActive: true,
    lastLoginAt: '2024-12-15T16:30:00Z',
    totalOrders: 25,
    totalSpent: 89000000,
    createdAt: '2024-02-15T09:00:00Z',
    updatedAt: '2024-12-15T16:30:00Z',
  },
  {
    id: '6',
    email: 'blocked@example.com',
    name: 'Hoàng Văn E',
    role: 'USER',
    isActive: false,
    lastLoginAt: '2024-11-20T14:00:00Z',
    totalOrders: 3,
    totalSpent: 15000000,
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2024-11-25T10:00:00Z',
  },
  {
    id: '7',
    email: 'user4@example.com',
    name: 'Vũ Thị F',
    role: 'USER',
    isActive: true,
    lastLoginAt: '2024-12-18T07:15:00Z',
    totalOrders: 15,
    totalSpent: 52000000,
    createdAt: '2024-04-10T13:00:00Z',
    updatedAt: '2024-12-18T07:15:00Z',
  },
  {
    id: '8',
    email: 'newuser@example.com',
    name: 'Đỗ Văn G',
    role: 'USER',
    isActive: true,
    lastLoginAt: '2024-12-18T11:00:00Z',
    totalOrders: 1,
    totalSpent: 25000000,
    createdAt: '2024-12-10T10:00:00Z',
    updatedAt: '2024-12-18T11:00:00Z',
  },
]

// Get all users with filters
export function useUsers(filters?: UserFilters) {
  return useQuery<AdminUser[]>({
    queryKey: ['admin-users', filters],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      let filtered = [...mockUsers]

      if (filters?.search) {
        const query = filters.search.toLowerCase()
        filtered = filtered.filter(
          (u) => u.name?.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
        )
      }

      if (filters?.role) {
        filtered = filtered.filter((u) => u.role === filters.role)
      }

      if (filters?.isActive !== undefined) {
        filtered = filtered.filter((u) => u.isActive === filters.isActive)
      }

      // Sort by created date (newest first)
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      return filtered
    },
  })
}

// Get single user by ID
export function useUser(id: string) {
  return useQuery<AdminUser>({
    queryKey: ['admin-users', id],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const user = mockUsers.find((u) => u.id === id)
      if (!user) throw new Error('User not found')
      return user
    },
    enabled: !!id,
  })
}

// Create new user
export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateUserData) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      // TODO: Call API
      console.log('Create user:', data)
      return {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('Đã tạo tài khoản thành công')
    },
    onError: () => {
      toast.error('Không thể tạo tài khoản')
    },
  })
}

// Update user
export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserData }) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      // TODO: Call API
      console.log('Update user:', id, data)
      return { id, ...data }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('Đã cập nhật tài khoản')
    },
    onError: () => {
      toast.error('Không thể cập nhật tài khoản')
    },
  })
}

// Change user role
export function useChangeUserRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: 'USER' | 'ADMIN' }) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      // TODO: Call API
      console.log('Change user role:', id, role)
      return { id, role }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('Đã thay đổi quyền người dùng')
    },
    onError: () => {
      toast.error('Không thể thay đổi quyền')
    },
  })
}

// Toggle user active status
export function useToggleUserStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      // TODO: Call API
      console.log('Toggle user status:', id, isActive)
      return { id, isActive }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success(variables.isActive ? 'Đã kích hoạt tài khoản' : 'Đã khóa tài khoản')
    },
    onError: () => {
      toast.error('Không thể thay đổi trạng thái')
    },
  })
}

// Delete user
export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      // TODO: Call API
      console.log('Delete user:', id)
      return { id }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('Đã xóa tài khoản')
    },
    onError: () => {
      toast.error('Không thể xóa tài khoản')
    },
  })
}

// Get user statistics
export function useUserStats() {
  return useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))

      const total = mockUsers.length
      const admins = mockUsers.filter((u) => u.role === 'ADMIN').length
      const users = mockUsers.filter((u) => u.role === 'USER').length
      const active = mockUsers.filter((u) => u.isActive !== false).length
      const blocked = mockUsers.filter((u) => u.isActive === false).length

      // New users this month
      const now = new Date()
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const newThisMonth = mockUsers.filter((u) => new Date(u.createdAt) >= firstDayOfMonth).length

      return {
        total,
        admins,
        users,
        active,
        blocked,
        newThisMonth,
      }
    },
  })
}
