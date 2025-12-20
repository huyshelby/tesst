import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildImageUrl(path?: string | null): string {
  if (!path) return '/placeholder.png' // Return a placeholder if path is empty
  if (path.startsWith('http')) return path // Already a full URL
  if (path.startsWith('data:')) return path // Base64 data URL

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
  const baseUrl = apiUrl.replace(/\/api$/, '') // Remove /api suffix to get the base URL

  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`
}


export function formatCurrency(amount: number, short: boolean = false): string {
  if (short && amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M đ`
  }

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(
  date: string | Date,
  format: 'short' | 'long' | 'relative' = 'short'
): string {
  const d = typeof date === 'string' ? new Date(date) : date

  if (format === 'relative') {
    const diff = Date.now() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return 'Hôm nay'
    if (days === 1) return 'Hôm qua'
    if (days < 7) return `${days} ngày trước`
    if (days < 30) return `${Math.floor(days / 7)} tuần trước`
    return `${Math.floor(days / 30)} tháng trước`
  }

  if (format === 'long') {
    return new Intl.DateTimeFormat('vi-VN', {
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(d)
  }

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}
