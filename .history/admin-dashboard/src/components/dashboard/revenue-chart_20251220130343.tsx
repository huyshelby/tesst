'use client'

import { useMemo, useState } from 'react'
import {
  ComposedChart,
  Bar,
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

type Mode = 'revenue' | 'orders' | 'both'

interface RevenueChartProps {
  period?: Period
  mode?: Mode
  title?: string
}

export function RevenueChart(props: RevenueChartProps = {}) {
  const [internalPeriod, setInternalPeriod] = useState<Period>('7days')
  const activePeriod = props.period ?? internalPeriod
  const mode: Mode = props.mode ?? 'both'

  const { data, isLoading, error } = useRevenueChart(activePeriod)

  const chartData = useMemo(() => {
    if (!data) return []

    return data.map((item) => ({
      date: item.date,
      formattedDate:
        activePeriod === '12months'
          ? format(parseISO(item.date + '-01'), 'MM/yyyy')
          : format(parseISO(item.date), 'dd/MM', { locale: vi }),
      revenue: item.revenue,
      orders: item.orders,
    }))
  }, [data, activePeriod])

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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{props.title || 'Doanh thu'}</h3>
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
        {!props.period && (
          <div className="flex gap-2">
            {periodOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setInternalPeriod(option.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activePeriod === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-80">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex items-center justify-center h-80 text-gray-500">Chưa có dữ liệu</div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={1}/>
                <stop offset="100%" stopColor="#2563EB" stopOpacity={0.9}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis 
              dataKey="formattedDate" 
              stroke="#9CA3AF" 
              style={{ fontSize: '12px' }}
              tick={{ fill: '#6B7280' }}
              tickLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis
              yAxisId="left"
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
              tick={{ fill: '#6B7280' }}
              tickLine={{ stroke: '#E5E7EB' }}
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
                return value.toString()
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
              tick={{ fill: '#6B7280' }}
              tickLine={{ stroke: '#E5E7EB' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                padding: '12px',
              }}
              labelStyle={{ 
                color: '#111827', 
                fontWeight: 600, 
                marginBottom: '8px',
                fontSize: '13px'
              }}
              formatter={(value: number, name: string) => {
                if (name === 'revenue') {
                  return [formatCurrency(value), 'Doanh thu']
                }
                return [value + ' đơn', 'Đơn hàng']
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '24px' }}
              iconType="circle"
              formatter={(value) => (
                <span className="text-sm font-medium text-gray-700">
                  {value === 'revenue' ? 'Doanh thu' : 'Đơn hàng'}
                </span>
              )}
            />
            {(mode === 'revenue' || mode === 'both') && (
              <Bar
                yAxisId="left"
                dataKey="revenue"
                fill="url(#barGradient)"
                radius={[8, 8, 0, 0]}
                maxBarSize={60}
              />
            )}
            {(mode === 'orders' || mode === 'both') && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 5, stroke: '#ffffff' }}
                activeDot={{ r: 7, strokeWidth: 2, stroke: '#ffffff' }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
