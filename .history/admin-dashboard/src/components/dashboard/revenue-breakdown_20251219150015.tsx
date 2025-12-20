'use client'

import { DollarSign, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface RevenueBreakdownProps {
  revenue: {
    total: number
    subtotal: number
    shippingFee: number
    discount: number
    change: number
    trend: 'up' | 'down' | 'neutral'
  }
  loading?: boolean
}

export function RevenueBreakdown({ revenue, loading = false }: RevenueBreakdownProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const metrics = [
    {
      label: 'Tổng tiền hàng',
      value: revenue.subtotal,
      color: 'blue',
      icon: '💰',
      description: 'Giá trị sản phẩm trước thuế & phí',
    },
    {
      label: 'Phí vận chuyển',
      value: revenue.shippingFee,
      color: 'green',
      icon: '🚚',
      description: 'Thu từ phí giao hàng',
    },
    {
      label: 'Giảm giá',
      value: revenue.discount,
      color: 'red',
      icon: '🎁',
      description: 'Tổng khuyến mãi đã áp dụng',
      isNegative: true,
    },
    {
      label: 'Doanh thu thực',
      value: revenue.total,
      color: 'purple',
      icon: '💵',
      description: 'Doanh thu sau giảm giá',
      highlight: true,
    },
  ]

  const colorMap = {
    blue: {
      border: 'border-blue-500',
      text: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    green: {
      border: 'border-green-500',
      text: 'text-green-600',
      bg: 'bg-green-50',
    },
    red: {
      border: 'border-red-500',
      text: 'text-red-600',
      bg: 'bg-red-50',
    },
    purple: {
      border: 'border-purple-500',
      text: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border-l-4 border-gray-300 pl-4">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          Chi tiết doanh thu (30 ngày)
        </h3>
        <div className="flex items-center gap-2">
          {revenue.trend === 'up' && (
            <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+{revenue.change}%</span>
            </div>
          )}
          {revenue.trend === 'down' && (
            <div className="flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-full">
              <TrendingDown className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">{revenue.change}%</span>
            </div>
          )}
          {revenue.trend === 'neutral' && (
            <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
              <Minus className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">0%</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const colors = colorMap[metric.color as keyof typeof colorMap]
          return (
            <div
              key={metric.label}
              className={`border-l-4 ${colors.border} pl-4 ${metric.highlight ? 'bg-gradient-to-br from-purple-50 to-white p-4 rounded-lg -ml-4' : ''}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{metric.icon}</span>
                <p className="text-sm font-medium text-gray-600">{metric.label}</p>
              </div>
              <p className={`text-2xl font-bold ${colors.text} ${metric.highlight ? 'text-3xl' : ''}`}>
                {metric.isNegative ? '-' : ''}
                {formatCurrency(metric.value)}
              </p>
              <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
            </div>
          )
        })}
      </div>

      {/* Formula visualization */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center gap-3 text-sm flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg">
            <span className="font-semibold text-purple-900">Doanh thu thực</span>
          </div>
          <span className="text-gray-400">=</span>
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
            <span className="text-blue-700">Tiền hàng</span>
          </div>
          <span className="text-gray-400">+</span>
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
            <span className="text-green-700">Phí ship</span>
          </div>
          <span className="text-gray-400">-</span>
          <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg">
            <span className="text-red-700">Giảm giá</span>
          </div>
        </div>
        
        {/* Calculation example */}
        <div className="text-center mt-3 text-xs text-gray-600">
          {formatCurrency(revenue.subtotal)} + {formatCurrency(revenue.shippingFee)} - {formatCurrency(revenue.discount)} = <strong className="text-purple-600">{formatCurrency(revenue.total)}</strong>
        </div>
      </div>
    </div>
  )
}
