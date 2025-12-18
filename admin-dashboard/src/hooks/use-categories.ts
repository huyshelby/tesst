import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Category } from '@/types/models'

// Get all categories
export function useCategories(filters?: { isActive?: boolean }) {
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
