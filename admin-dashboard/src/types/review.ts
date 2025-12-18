export interface Review {
  id: string
  productId: string
  productName: string
  productImage: string
  userId: string
  userName: string
  userEmail: string
  rating: number
  title: string
  content: string
  images?: string[]
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  adminReply?: string
  adminReplyAt?: string
  helpful: number
  reported: number
  verified: boolean
  createdAt: string
  updatedAt: string
}
