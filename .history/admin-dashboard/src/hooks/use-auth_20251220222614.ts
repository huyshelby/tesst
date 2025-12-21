import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { User } from '@/types/models'

export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['user'],
    queryFn: async () => {
      const data = await authService.getCurrentUser()
      return (data as any)?.user ?? (data as any)
    },
    retry: false,
    enabled: typeof window !== 'undefined' && !!authService.getAccessToken(),
  })

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: async (userData) => {
      // Set user data directly in cache
      queryClient.setQueryData(['user'], userData)
      router.push('/')
      toast.success('Đăng nhập thành công')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Email hoặc mật khẩu không đúng')
    },
  })

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear()
      toast.success('Đã đăng xuất')
    },
  })

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
  }
}
