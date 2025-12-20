import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

// Add productCount to the Category type
export interface Category {
  id: string
  name: string
  slug: string
  isActive: boolean
  productCount?: number
}

// Get all categories
export function useCategories(filters?: { isActive?: boolean; search?: string }) {
  return useQuery<Category[]>({
    queryKey: ['categories', filters],
    queryFn: async () => {
      const { data } = await api.get('/categories', { params: filters })
      return data
    },
  })
}

// Get category tree (hierarchical)
export function useCategoryTree() {
  return useQuery<Category[]>({
    queryKey: ['categories', 'tree'],
    queryFn: async () => {
      const { data } = await api.get('/categories/tree')
      return data
    },
  })
}

// Get a single category by ID
export function useCategory(id: string) {
  return useQuery<Category>({
    queryKey: ['categories', id],
    queryFn: async () => {
      const { data } = await api.get(`/categories/${id}`)
      return data
    },
    enabled: !!id, // Only run query if id is available
  })
}

// Create a new category
export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Category, 'id' | 'productCount'>) => api.post('/categories', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

// Update a category
export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      api.patch(`/categories/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['categories', id] })
    },
  })
}

// Delete a category
export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

    queryKey: ['categories', 'tree'],
    queryFn: async () => {
      const { data } = await api.get('/categories/tree')
      return data
    },
  })
}

// Get a single category by ID
export function useCategory(id: string) {
  return useQuery<Category>({
    queryKey: ['categories', id],
    queryFn: async () => {
      const { data } = await api.get(`/categories/${id}`)
      return data
    },
    enabled: !!id, // Only run query if id is available
  })
}

// Create a new category
export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Category, 'id' | 'productCount'>) => api.post('/categories', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

// Update a category
export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      api.patch(`/categories/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['categories', id] })
    },
  })
}

// Delete a category
export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
