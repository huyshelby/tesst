import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Review } from '@/types/review'
import { toast } from 'sonner'

// Mock data for reviews
const mockReviews: Review[] = [
  {
    id: '1',
    productId: 'p1',
    productName: 'iPhone 15 Pro Max 256GB',
    productImage: '/pictures/iphone-15-pro-max.jpg',
    userId: 'u1',
    userName: 'Nguyễn Văn A',
    userEmail: 'user1@example.com',
    rating: 5,
    title: 'Sản phẩm tuyệt vời!',
    content:
      'Máy đẹp, chạy mượt, pin trâu. Camera chụp ảnh rất đẹp, đặc biệt là chế độ chụp đêm. Rất hài lòng với sản phẩm này.',
    images: ['/pictures/review1.jpg'],
    status: 'APPROVED',
    adminReply: 'Cảm ơn bạn đã đánh giá! Chúc bạn sử dụng sản phẩm vui vẻ.',
    adminReplyAt: '2024-12-17T10:00:00Z',
    helpful: 25,
    reported: 0,
    verified: true,
    createdAt: '2024-12-16T14:30:00Z',
    updatedAt: '2024-12-17T10:00:00Z',
  },
  {
    id: '2',
    productId: 'p2',
    productName: 'Samsung Galaxy S24 Ultra',
    productImage: '/pictures/samsung-s24-ultra.jpg',
    userId: 'u2',
    userName: 'Trần Thị B',
    userEmail: 'user2@example.com',
    rating: 4,
    title: 'Tốt nhưng còn một số hạn chế',
    content:
      'Màn hình đẹp, hiệu năng mạnh. Tuy nhiên máy hơi nóng khi chơi game. Nhìn chung vẫn đáng mua.',
    status: 'APPROVED',
    helpful: 18,
    reported: 0,
    verified: true,
    createdAt: '2024-12-15T16:20:00Z',
    updatedAt: '2024-12-15T16:20:00Z',
  },
  {
    id: '3',
    productId: 'p3',
    productName: 'MacBook Pro 14" M3',
    productImage: '/pictures/macbook-pro-14.jpg',
    userId: 'u3',
    userName: 'Lê Văn C',
    userEmail: 'user3@example.com',
    rating: 5,
    title: 'Máy làm việc hoàn hảo',
    content:
      'Hiệu năng vượt trội, pin cực kỳ trâu. Render video nhanh, code mượt mà. Đáng đồng tiền bát gạo!',
    images: ['/pictures/review2.jpg', '/pictures/review3.jpg'],
    status: 'APPROVED',
    adminReply: 'Cảm ơn bạn! MacBook M3 thực sự là lựa chọn tuyệt vời cho developer.',
    adminReplyAt: '2024-12-17T09:00:00Z',
    helpful: 42,
    reported: 0,
    verified: true,
    createdAt: '2024-12-14T11:15:00Z',
    updatedAt: '2024-12-17T09:00:00Z',
  },
  {
    id: '4',
    productId: 'p1',
    productName: 'iPhone 15 Pro Max 256GB',
    productImage: '/pictures/iphone-15-pro-max.jpg',
    userId: 'u4',
    userName: 'Phạm Thị D',
    userEmail: 'user4@example.com',
    rating: 2,
    title: 'Không như kỳ vọng',
    content:
      'Giá cao nhưng pin không được tốt. Hơi nặng so với các dòng trước. Chưa thực sự hài lòng.',
    status: 'PENDING',
    helpful: 5,
    reported: 2,
    verified: false,
    createdAt: '2024-12-18T08:00:00Z',
    updatedAt: '2024-12-18T08:00:00Z',
  },
  {
    id: '5',
    productId: 'p4',
    productName: 'iPad Air M2',
    productImage: '/pictures/ipad-air-m2.jpg',
    userId: 'u5',
    userName: 'Hoàng Văn E',
    userEmail: 'user5@example.com',
    rating: 1,
    title: 'Sản phẩm kém chất lượng',
    content:
      'Máy bị lỗi màn hình sau 1 tuần sử dụng. Dịch vụ khách hàng kém. Không khuyến khích mua.',
    status: 'REJECTED',
    helpful: 3,
    reported: 8,
    verified: false,
    createdAt: '2024-12-17T15:30:00Z',
    updatedAt: '2024-12-17T18:00:00Z',
  },
  {
    id: '6',
    productId: 'p5',
    productName: 'AirPods Pro 2',
    productImage: '/pictures/airpods-pro-2.jpg',
    userId: 'u6',
    userName: 'Vũ Thị F',
    userEmail: 'user6@example.com',
    rating: 5,
    title: 'Tai nghe tốt nhất từng dùng',
    content:
      'Chống ồn cực tốt, âm thanh trong trẻo. Pin lâu, sạc nhanh. Đeo cả ngày không đau tai.',
    images: ['/pictures/review4.jpg'],
    status: 'PENDING',
    helpful: 12,
    reported: 0,
    verified: true,
    createdAt: '2024-12-18T10:30:00Z',
    updatedAt: '2024-12-18T10:30:00Z',
  },
]

interface ReviewFilters {
  search?: string
  status?: 'PENDING' | 'APPROVED' | 'REJECTED'
  rating?: number
  productId?: string
  verified?: boolean
}

// Get all reviews with filters
export function useReviews(filters?: ReviewFilters) {
  return useQuery<Review[]>({
    queryKey: ['reviews', filters],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      let filtered = [...mockReviews]

      if (filters?.search) {
        const query = filters.search.toLowerCase()
        filtered = filtered.filter(
          (r) =>
            r.userName.toLowerCase().includes(query) ||
            r.productName.toLowerCase().includes(query) ||
            r.content.toLowerCase().includes(query)
        )
      }

      if (filters?.status) {
        filtered = filtered.filter((r) => r.status === filters.status)
      }

      if (filters?.rating) {
        filtered = filtered.filter((r) => r.rating === filters.rating)
      }

      if (filters?.productId) {
        filtered = filtered.filter((r) => r.productId === filters.productId)
      }

      if (filters?.verified !== undefined) {
        filtered = filtered.filter((r) => r.verified === filters.verified)
      }

      // Sort by newest first
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      return filtered
    },
  })
}

// Get single review
export function useReview(id: string) {
  return useQuery<Review>({
    queryKey: ['reviews', id],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const review = mockReviews.find((r) => r.id === id)
      if (!review) throw new Error('Review not found')
      return review
    },
    enabled: !!id,
  })
}

// Approve review
export function useApproveReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      // TODO: Call API
      console.log('Approve review:', id)
      return { id, status: 'APPROVED' }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      toast.success('Đã duyệt đánh giá')
    },
    onError: () => {
      toast.error('Không thể duyệt đánh giá')
    },
  })
}

// Reject review
export function useRejectReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      // TODO: Call API
      console.log('Reject review:', id)
      return { id, status: 'REJECTED' }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      toast.success('Đã từ chối đánh giá')
    },
    onError: () => {
      toast.error('Không thể từ chối đánh giá')
    },
  })
}

// Reply to review
export function useReplyReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, reply }: { id: string; reply: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      // TODO: Call API
      console.log('Reply to review:', id, reply)
      return { id, reply }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      toast.success('Đã gửi phản hồi')
    },
    onError: () => {
      toast.error('Không thể gửi phản hồi')
    },
  })
}

// Delete review
export function useDeleteReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      // TODO: Call API
      console.log('Delete review:', id)
      return { id }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      toast.success('Đã xóa đánh giá')
    },
    onError: () => {
      toast.error('Không thể xóa đánh giá')
    },
  })
}

// Get review statistics
export function useReviewStats() {
  return useQuery({
    queryKey: ['review-stats'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))

      const total = mockReviews.length
      const pending = mockReviews.filter((r) => r.status === 'PENDING').length
      const approved = mockReviews.filter((r) => r.status === 'APPROVED').length
      const rejected = mockReviews.filter((r) => r.status === 'REJECTED').length
      const avgRating = mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length || 0

      const ratingDistribution = {
        5: mockReviews.filter((r) => r.rating === 5).length,
        4: mockReviews.filter((r) => r.rating === 4).length,
        3: mockReviews.filter((r) => r.rating === 3).length,
        2: mockReviews.filter((r) => r.rating === 2).length,
        1: mockReviews.filter((r) => r.rating === 1).length,
      }

      return {
        total,
        pending,
        approved,
        rejected,
        avgRating: parseFloat(avgRating.toFixed(1)),
        ratingDistribution,
      }
    },
  })
}
