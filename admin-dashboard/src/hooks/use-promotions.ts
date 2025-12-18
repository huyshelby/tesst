import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Promotion } from '@/types/models'

// Mock data for promotions (since backend doesn't have this yet)
const mockPromotions: Promotion[] = [
  {
    id: '1',
    name: 'Giảm giá cuối năm',
    code: 'NEWYEAR2025',
    type: 'PERCENTAGE',
    value: 20,
    minOrderAmount: 5000000,
    maxDiscount: 1000000,
    startDate: '2024-12-15T00:00:00Z',
    endDate: '2025-01-15T23:59:59Z',
    usageLimit: 100,
    usageCount: 45,
    status: 'ACTIVE',
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-18T15:30:00Z',
  },
  {
    id: '2',
    name: 'Freeship đơn 3 triệu',
    code: 'FREESHIP3M',
    type: 'FIXED_AMOUNT',
    value: 50000,
    minOrderAmount: 3000000,
    startDate: '2024-12-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    usageLimit: 500,
    usageCount: 389,
    status: 'ACTIVE',
    createdAt: '2024-11-25T10:00:00Z',
    updatedAt: '2024-12-18T12:00:00Z',
  },
  {
    id: '3',
    name: 'Black Friday 2024',
    code: 'BLACKFRIDAY',
    type: 'PERCENTAGE',
    value: 30,
    minOrderAmount: 10000000,
    maxDiscount: 3000000,
    startDate: '2024-11-20T00:00:00Z',
    endDate: '2024-11-30T23:59:59Z',
    usageLimit: 200,
    usageCount: 200,
    status: 'EXPIRED',
    createdAt: '2024-11-15T10:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Voucher Tết 2025',
    code: 'TET2025',
    type: 'PERCENTAGE',
    value: 15,
    minOrderAmount: 2000000,
    startDate: '2025-01-20T00:00:00Z',
    endDate: '2025-02-10T23:59:59Z',
    usageLimit: 300,
    usageCount: 0,
    status: 'PAUSED',
    createdAt: '2024-12-10T10:00:00Z',
    updatedAt: '2024-12-15T14:00:00Z',
  },
]

interface GetPromotionsParams {
  search?: string
  type?: 'PERCENTAGE' | 'FIXED_AMOUNT'
  status?: 'ACTIVE' | 'EXPIRED' | 'PAUSED'
  startDate?: string
  endDate?: string
}

// Get all promotions with filters
export function usePromotions(params?: GetPromotionsParams) {
  return useQuery({
    queryKey: ['promotions', params],
    queryFn: async () => {
      // Mock filtering
      let filtered = [...mockPromotions]

      if (params?.search) {
        const search = params.search.toLowerCase()
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(search) ||
            p.code.toLowerCase().includes(search)
        )
      }

      if (params?.type) {
        filtered = filtered.filter((p) => p.type === params.type)
      }

      if (params?.status) {
        filtered = filtered.filter((p) => p.status === params.status)
      }

      // Sort by createdAt desc
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )

      return {
        promotions: filtered,
        total: filtered.length,
      }
    },
  })
}

// Get single promotion
export function usePromotion(id: string) {
  return useQuery({
    queryKey: ['promotions', id],
    queryFn: async () => {
      const promotion = mockPromotions.find((p) => p.id === id)
      if (!promotion) throw new Error('Promotion not found')
      return promotion
    },
    enabled: !!id,
  })
}

// Create promotion
export function useCreatePromotion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<Promotion, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      const newPromotion: Promotion = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        usageCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      mockPromotions.push(newPromotion)
      return newPromotion
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] })
    },
  })
}

// Update promotion
export function useUpdatePromotion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Partial<Omit<Promotion, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>>
    }) => {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      const index = mockPromotions.findIndex((p) => p.id === id)
      if (index === -1) throw new Error('Promotion not found')
      
      mockPromotions[index] = {
        ...mockPromotions[index],
        ...data,
        updatedAt: new Date().toISOString(),
      }
      return mockPromotions[index]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] })
    },
  })
}

// Update promotion status
export function useUpdatePromotionStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string
      status: 'ACTIVE' | 'PAUSED'
    }) => {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 300))
      const index = mockPromotions.findIndex((p) => p.id === id)
      if (index === -1) throw new Error('Promotion not found')
      
      mockPromotions[index].status = status
      mockPromotions[index].updatedAt = new Date().toISOString()
      return mockPromotions[index]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] })
    },
  })
}

// Delete promotion
export function useDeletePromotion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 300))
      const index = mockPromotions.findIndex((p) => p.id === id)
      if (index === -1) throw new Error('Promotion not found')
      mockPromotions.splice(index, 1)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] })
    },
  })
}
