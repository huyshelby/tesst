'use client'

import { useMemo, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useRevenueChart } from '@/hooks/use-dashboard'

const periodOptions = [
  { value: '7days', label: '7 ngày' },
  { value: '30days', label: '30 ngày' },
  { value: '12months', label: '12 tháng' },
] as const

type Period = (typeof periodOptions)[number]['value']

export function RevenueChart() {
  const [period, setPeriod] = useState<Period>('7days')
  const { data, isLoading, error } = useRevenueChart(period)

  const chartData = useMemo(() => {
    if (!data) return []

    return data.map((item) => ({
      date: item.date,
      formattedDate:
        period === '12months'
          ? format(parseISO(item.date + '-01'), 'MM/yyyy')
          : format(parseISO(item.date), 'dd/MM', { locale: vi }),
      revenue: item.revenue,
      orders: item.orders,
    }))
  }, [data, period])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Doanh thu</h3>
        <div className="flex items-center justify-center h-80 text-red-500">
          Không thể tải dữ liệu biểu đồ
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Doanh thu</h3>
        <div className="flex gap-2">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setPeriod(option.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                period === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-80">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex items-center justify-center h-80 text-gray-500">Chưa có dữ liệu</div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="formattedDate" stroke="#6B7280" style={{ fontSize: '12px' }} />
            <YAxis
              yAxisId="left"
              stroke="#2563EB"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#10B981"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number, name: string) => {
                if (name === 'revenue') {
                  return [formatCurrency(value), 'Doanh thu']
                }
                return [value, 'Đơn hàng']
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => (value === 'revenue' ? 'Doanh thu' : 'Đơn hàng')}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#2563EB"
              strokeWidth={2}
              dot={{ fill: '#2563EB', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="orders"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: '#10B981', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
