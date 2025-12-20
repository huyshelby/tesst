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
