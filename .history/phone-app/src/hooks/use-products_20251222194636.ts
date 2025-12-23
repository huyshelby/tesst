import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axios';
import type { Product } from './product-api';

export interface FetchProductsParams {
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'price' | 'name' | 'createdAt';
  order?: 'asc' | 'desc';
  limit?: number;
  page?: number;
}

export interface FetchProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Query keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: FetchProductsParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  slug: (slug: string) => [...productKeys.details(), 'slug', slug] as const,
};

// Fetch products with React Query
export function useProducts(params: FetchProductsParams = {}) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: async (): Promise<FetchProductsResponse> => {
      const query = new URLSearchParams();
      
      if (params.categorySlug) query.set('categorySlug', params.categorySlug);
      if (params.search) query.set('search', params.search);
      if (params.minPrice !== undefined) query.set('minPrice', params.minPrice.toString());
      if (params.maxPrice !== undefined) query.set('maxPrice', params.maxPrice.toString());
      if (params.inStock !== undefined) query.set('inStock', params.inStock.toString());
      if (params.sortBy) query.set('sortBy', params.sortBy);
      if (params.order) query.set('order', params.order);
      if (params.limit) query.set('limit', params.limit.toString());
      if (params.page) query.set('page', params.page.toString());

      const { data } = await api.get(`/products?${query.toString()}`);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Fetch single product by ID
export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async (): Promise<Product> => {
      const { data } = await api.get(`/products/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Fetch product by slug
export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: productKeys.slug(slug),
    queryFn: async (): Promise<Product> => {
      const { data } = await api.get(`/products/slug/${slug}`);
      return data;
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Prefetch products for better UX
export function usePrefetchProducts() {
  const queryClient = useQueryClient();

  return (params: FetchProductsParams) => {
    queryClient.prefetchQuery({
      queryKey: productKeys.list(params),
      queryFn: async (): Promise<FetchProductsResponse> => {
        const query = new URLSearchParams();
        
        if (params.categorySlug) query.set('categorySlug', params.categorySlug);
        if (params.limit) query.set('limit', params.limit.toString());
        if (params.sortBy) query.set('sortBy', params.sortBy);
        if (params.order) query.set('order', params.order);

        const { data } = await api.get(`/products?${query.toString()}`);
        return data;
      },
    });
  };
}
