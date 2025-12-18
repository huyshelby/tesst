import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  trend?: 'up' | 'down' | 'neutral'
  icon: LucideIcon
  iconColor?: string
  subtitle?: string
  loading?: boolean
}

export function StatCard({
  title,
  value,
  change,
  trend = 'neutral',
  icon: Icon,
  iconColor = 'text-blue-600',
  subtitle,
  loading = false,
}: StatCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>

          <div className="flex items-center gap-2">
            {change !== undefined && (
              <div
                className={cn(
                  'flex items-center text-sm font-medium',
                  trend === 'up' && 'text-green-600',
                  trend === 'down' && 'text-red-600',
                  trend === 'neutral' && 'text-gray-600'
                )}
              >
                {trend === 'up' && (
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                )}
                {trend === 'down' && (
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                )}
                {Math.abs(change)}%
              </div>
            )}
            {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
          </div>
        </div>

        <div className={cn('p-3 rounded-lg bg-opacity-10', iconColor)}>
          <Icon className={cn('w-8 h-8', iconColor)} />
        </div>
      </div>
    </div>
  )
}
