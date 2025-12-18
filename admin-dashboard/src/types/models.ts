export interface User {
  id: string
  email: string
  name?: string
  role: 'ADMIN' | 'USER'
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  listPrice?: number
  image: string
  images: string[]
  brand: string
  stock: number
  rating: number
  reviews: number
  badges: string[]
  installment: boolean
  specs: Record<string, any>
  categoryId: string
  category?: Category
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  parentId?: string
  displayOrder: number
  isActive: boolean
  productCount?: number
  children?: Category[]
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  userId: string
  user?: User
  orderNumber: string
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED'

  // Customer info
  customerName: string
  customerEmail: string
  customerPhone: string

  // Shipping info
  shippingAddress: string
  shippingCity: string
  shippingDistrict?: string
  shippingWard?: string

  // Payment info
  paymentMethod: 'COD' | 'CARD' | 'MOMO' | 'VNPAY' | 'BANK_TRANSFER' | 'INSTALLMENT' | 'CRYPTO'
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'

  // Pricing
  subtotal: number
  shippingFee: number
  discount: number
  totalAmount: number

  notes?: string
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  product?: Product
  productName: string
  productImage: string
  price: number
  quantity: number
  selectedColor?: string
  selectedStorage?: string
  subtotal: number
}

export interface Customer {
  id: string
  email: string
  name: string
  role: 'USER' | 'ADMIN'
  createdAt: string
  updatedAt: string
  // Extended fields for customer management
  totalOrders?: number
  totalSpent?: number
  orders?: Order[]
}

export interface Promotion {
  id: string
  name: string
  code: string
  type: 'PERCENTAGE' | 'FIXED_AMOUNT'
  value: number
  minOrderAmount?: number
  maxDiscount?: number
  applicableProducts?: string[] // product IDs
  startDate: string
  endDate: string
  usageLimit?: number
  usageCount: number
  status: 'ACTIVE' | 'EXPIRED' | 'PAUSED'
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  revenue: {
    today: number
    month: number
    change: number
  }
  orders: {
    new: number
    total: number
    change: number
  }
  customers: {
    total: number
    new: number
  }
  lowStock: {
    count: number
    products: Product[]
  }
}
