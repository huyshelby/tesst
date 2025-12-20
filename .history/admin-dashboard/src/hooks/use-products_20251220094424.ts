import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { toast } from 'sonner'
import type { Product } from '@/types/models'

interface ProductFilters {
  search?: string
  categoryId?: string
  brand?: string
  isActive?: boolean
  minPrice?: number
  maxPrice?: number
}

interface ProductFormData {
  name: string
  slug?: string
  description?: string
  price: number
  listPrice?: number
  image: string
  images?: string[]
  brand: string
  stock: number
  categoryId: string
  specs?: Record<string, any>
  isActive?: boolean
}

// Get all products with filters
export function useProducts(filters?: ProductFilters) {
  return useQuery<Product[]>({
    queryKey: ['products', filters],
    queryFn: async ({ signal }) => {
      const { data } = await api.get('/products', { params: filters, signal })
      // Backend returns { products, pagination }
      return data.products || []
    },
    keepPreviousData: true,
  })
}

// Get single product by ID
export function useProduct(id: string, options?: { enabled?: boolean }) {
  return useQuery<Product>({
    queryKey: ['products', id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`)
      return data
    },
    enabled: options?.enabled !== undefined ? options.enabled : !!id,
  })
}

// Create product
export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ProductFormData) => {
      const response = await api.post('/products', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Tạo sản phẩm thành công')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể tạo sản phẩm')
    },
  })
}

// Update product
export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProductFormData> }) => {
      const response = await api.put(`/products/${id}`, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] })
      toast.success('Cập nhật sản phẩm thành công')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể cập nhật sản phẩm')
    },
  })
}

// Delete product
export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Xóa sản phẩm thành công')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể xóa sản phẩm')
    },
  })
}

// Bulk delete products
export function useBulkDeleteProducts() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => api.delete(`/products/${id}`)))
    },
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success(`Đã xóa ${ids.length} sản phẩm`)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể xóa sản phẩm')
    },
  })
}
