import { useQuery } from '@tanstack/react-query';
import api from './axios';

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children?: Category[];
  displayOrder: number;
  isActive: boolean;
}

// Query keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters?: { parentId?: string | null; isActive?: boolean }) => 
    [...categoryKeys.lists(), filters] as const,
  tree: () => [...categoryKeys.all, 'tree'] as const,
};

// Fetch categories
export function useCategories(params?: { 
  parentId?: string | null; 
  isActive?: boolean 
}) {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: async (): Promise<Category[]> => {
      const query = new URLSearchParams();
      
      if (params?.parentId !== undefined) {
        query.set('parentId', params.parentId === null ? 'null' : params.parentId);
      }
      if (params?.isActive !== undefined) {
        query.set('isActive', params.isActive.toString());
      }

      const { data } = await api.get(`/categories${query.size ? `?${query}` : ''}`);
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - categories change rarely
  });
}

// Fetch category tree
export function useCategoryTree() {
  return useQuery({
    queryKey: categoryKeys.tree(),
    queryFn: async (): Promise<Category[]> => {
      const { data } = await api.get('/categories/tree');
      return data;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}
