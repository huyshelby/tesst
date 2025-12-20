'use client'

import { useState } from 'react'
import { AlertCircle, DollarSign, Download, Filter, TrendingUp, TrendingDown, ShoppingCart, Gauge } from 'lucide-react'
import { useDashboardStats } from '@/hooks/use-dashboard'
import { RevenueBreakdown } from '@/components/dashboard/revenue-breakdown'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'

const RevenueChart = dynamic(() => import('@/components/dashboard/revenue-chart').then(m => m.RevenueChart), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 h-80 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  ),
})

export default function FinancialReportPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'7days' | '30days' | '12months'>('30days')
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats()
  const [chartTab, setChartTab] = useState<'revenue' | 'orders'>('revenue')

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const calculateMetrics = () => {
    if (!stats) return null

    const { revenue } = stats
    // Tính AOV theo định nghĩa doanh thu (chỉ đơn DELIVERED + COMPLETED)
    const deliveredCount = stats.orders.delivered || 0
    const averageOrderValue = deliveredCount > 0 ? revenue.total / deliveredCount : 0
    const discountRate = revenue.subtotal > 0 ? (revenue.discount / revenue.subtotal) * 100 : 0

    return {
      averageOrderValue,
      discountRate,
    }
  }

  const metrics = calculateMetrics()

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Báo cáo tài chính</h1>
          <p className="text-gray-600 mt-1">Tổng quan hiệu suất kinh doanh và insight tài chính</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Global period filter */}
          <div className="flex rounded-lg bg-gray-100 p-1 text-sm font-medium">
            <button
              onClick={() => setSelectedPeriod('7days')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedPeriod === '7days' ? 'bg-white shadow text-gray-900' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              7 ngày
            </button>
            <button
              onClick={() => setSelectedPeriod('30days')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedPeriod === '30days' ? 'bg-white shadow text-gray-900' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              30 ngày
            </button>
            <button
              onClick={() => setSelectedPeriod('12months')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedPeriod === '12months' ? 'bg-white shadow text-gray-900' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              12 tháng
            </button>
          </div>

          <Button variant="outline" className="gap-2">
            <Gauge className="w-4 h-4" /> So sánh kỳ trước
          </Button>
          <Button className="gap-2">
            <Download className="w-4 h-4" /> Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Error State */}
      {statsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="text-red-800 font-medium">Không thể tải dữ liệu tài chính</h3>
            <p className="text-red-700 text-sm">Hãy kiểm tra quyền truy cập (yêu cầu ADMIN) và kết nối backend.</p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        {/* Doanh thu thực */}
        <Card className="border-l-4 border-green-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600">Doanh thu thực (30 ngày)</CardTitle>
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ) : stats ? (
              <>
                <div className="text-3xl font-semibold text-gray-900">{formatCurrency(stats.revenue.total)}</div>
                <div className={`mt-2 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                  stats.revenue.trend === 'up' 
                    ? 'text-green-700 bg-green-50' 
                    : stats.revenue.trend === 'down'
                    ? 'text-red-700 bg-red-50'
                    : 'text-gray-700 bg-gray-50'
                }`}>
                  {stats.revenue.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : stats.revenue.trend === 'down' ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : null}
                  {stats.revenue.change > 0 ? '+' : ''}{stats.revenue.change}% so với kỳ trước
                </div>
              </>
            ) : (
              <div className="text-3xl font-semibold text-gray-500">—</div>
            )}
          </CardContent>
        </Card>

        {/* Giá trị đơn hàng TB (AOV) */}
        <Card className="border-l-4 border-blue-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600">Giá trị đơn hàng TB (AOV)</CardTitle>
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ) : metrics ? (
              <>
                <div className="text-3xl font-semibold text-gray-900">{formatCurrency(metrics.averageOrderValue)}</div>
                <div className="mt-2 text-xs text-gray-500">Trên các đơn đã giao</div>
              </>
            ) : (
              <div className="text-3xl font-semibold text-gray-500">—</div>
            )}
          </CardContent>
        </Card>

        {/* Tổng đơn hàng */}
        <Card className="border-l-4 border-purple-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600">Tổng đơn hàng (30 ngày)</CardTitle>
              <ShoppingCart className="w-4 h-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ) : stats ? (
              <>
                <div className="text-3xl font-semibold text-gray-900">{stats.orders.total}</div>
                <div className={`mt-2 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                  stats.orders.change > 0 
                    ? 'text-green-700 bg-green-50' 
                    : stats.orders.change < 0
                    ? 'text-red-700 bg-red-50'
                    : 'text-gray-700 bg-gray-50'
                }`}>
                  {stats.orders.change > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : stats.orders.change < 0 ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : null}
                  {stats.orders.change > 0 ? '+' : ''}{stats.orders.change}% so với kỳ trước
                </div>
              </>
            ) : (
              <div className="text-3xl font-semibold text-gray-500">—</div>
            )}
          </CardContent>
        </Card>

        {/* Tỷ lệ giảm giá */}
        <Card className="border-l-4 border-amber-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600">Tỷ lệ giảm giá</CardTitle>
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ) : metrics ? (
              <>
                <div className="text-3xl font-semibold text-gray-900">{metrics.discountRate.toFixed(1)}%</div>
                <div className="mt-2 text-xs text-gray-500">Khuyến mãi / Tổng tiền hàng</div>
              </>
            ) : (
              <div className="text-3xl font-semibold text-gray-500">—</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      {stats && <RevenueBreakdown revenue={stats.revenue} loading={statsLoading} />}

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Xu hướng</CardTitle>
            <Tabs value={chartTab} onValueChange={(v) => setChartTab(v as 'revenue' | 'orders')}>
              <TabsList>
                <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
                <TabsTrigger value="orders">Số đơn</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <RevenueChart
            title={chartTab === 'revenue' ? 'Doanh thu' : 'Số đơn hàng'}
            period={selectedPeriod}
            mode={chartTab}
          />
        </CardContent>
      </Card>

      {/* Detailed Financial Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân tích chi tiết</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Chỉ số</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Giá trị</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">% Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {stats && (
                <>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">Tổng tiền hàng</td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-blue-600">
                      {formatCurrency(stats.revenue.subtotal)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-gray-600">
                      {((stats.revenue.subtotal / stats.revenue.total) * 100).toFixed(1)}%
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">Phí vận chuyển</td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-green-600">
                      {formatCurrency(stats.revenue.shippingFee)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-gray-600">
                      {((stats.revenue.shippingFee / stats.revenue.total) * 100).toFixed(1)}%
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">Giảm giá</td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-red-600">
                      -{formatCurrency(stats.revenue.discount)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-gray-600">
                      -{((stats.revenue.discount / stats.revenue.total) * 100).toFixed(1)}%
                    </td>
                  </tr>
                  <tr className="bg-purple-50 font-semibold">
                    <td className="py-3 px-4 text-sm text-gray-900">Doanh thu thực</td>
                    <td className="py-3 px-4 text-sm text-right text-purple-700">
                      {formatCurrency(stats.revenue.total)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-purple-700">100%</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê đơn hàng</h3>
          <div className="space-y-3">
            {stats && (
              <>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Tổng đơn hàng</span>
                  <span className="font-semibold text-gray-900">{stats.orders.total}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Đơn chờ xử lý</span>
                  <span className="font-semibold text-amber-600">{stats.orders.pending}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Đơn đang xử lý</span>
                  <span className="font-semibold text-blue-600">{stats.orders.processing}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Đơn đã giao</span>
                  <span className="font-semibold text-green-600">{stats.orders.delivered}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Đơn đã hủy</span>
                  <span className="font-semibold text-red-600">{stats.orders.cancelled}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê khách hàng</h3>
          <div className="space-y-3">
            {stats && (
              <>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Tổng khách hàng</span>
                  <span className="font-semibold text-gray-900">{stats.customers.total}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Khách hàng hoạt động</span>
                  <span className="font-semibold text-green-600">{stats.customers.active}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Khách hàng mới (30 ngày)</span>
                  <span className="font-semibold text-blue-600">{stats.customers.new}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Tỷ lệ khách quay lại</span>
                  <span className="font-semibold text-purple-600">
                    {stats.customers.total > 0
                      ? `${((stats.customers.active / stats.customers.total) * 100).toFixed(1)}%`
                      : '0%'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
