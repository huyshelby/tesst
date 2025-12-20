'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Filter, Download, TrendingUp, AlertCircle, DollarSign, ShoppingCart, Gauge } from 'lucide-react'

export default function FinancialMockPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Báo cáo tài chính</h1>
          <p className="text-gray-600 mt-1">Tổng quan hiệu suất kinh doanh và insight tài chính</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Global period filter (mock) */}
          <div className="flex rounded-lg bg-gray-100 p-1 text-sm font-medium">
            <button className="px-3 py-1.5 rounded-md bg-white shadow">7 ngày</button>
            <button className="px-3 py-1.5 rounded-md text-gray-700">30 ngày</button>
            <button className="px-3 py-1.5 rounded-md text-gray-700">12 tháng</button>
          </div>

          <Button variant="outline" className="gap-2">
            <Gauge className="w-4 h-4" /> So sánh kỳ trước
          </Button>
          <Button className="gap-2">
            <Download className="w-4 h-4" /> Xuất báo cáo
          </Button>
        </div>
      </div>

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
            <div className="text-3xl font-semibold text-gray-900">1.245.000.000₫</div>
            <div className="mt-2 inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" /> +12.4% so với kỳ trước
            </div>
          </CardContent>
        </Card>

        {/* Lợi nhuận gộp (ẩn nếu chưa có COGS – mock hiển thị dạng disabled) */}
        <Card className="opacity-60">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600">Lợi nhuận gộp</CardTitle>
              <AlertCircle className="w-4 h-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-500">—</div>
            <div className="mt-2 text-xs text-gray-500">Chưa có dữ liệu COGS</div>
          </CardContent>
        </Card>

        {/* Tổng đơn hàng */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600">Tổng đơn hàng (30 ngày)</CardTitle>
              <ShoppingCart className="w-4 h-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900">1.982</div>
            <div className="mt-2 inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" /> +4.7% so với kỳ trước
            </div>
          </CardContent>
        </Card>

        {/* AOV */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600">Giá trị đơn hàng TB (AOV)</CardTitle>
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900">627.800₫</div>
            <div className="mt-2 text-xs text-gray-500">Trên các đơn đã giao</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Xu hướng</CardTitle>
            <Tabs defaultValue="revenue">
              <TabsList>
                <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
                <TabsTrigger value="orders">Số đơn</TabsTrigger>
                <TabsTrigger value="profit" disabled>
                  Lợi nhuận
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {/* Mock chart area */}
          <div className="h-80 rounded-md border border-dashed border-gray-200 flex items-center justify-center text-gray-500">
            Biểu đồ (Line/Area) — mock UI
          </div>
        </CardContent>
      </Card>

      {/* Revenue Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Phân tích doanh thu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="text-sm text-gray-600">Tiền hàng</p>
              <p className="text-2xl font-semibold text-blue-700">1.100.000.000₫</p>
              <p className="text-xs text-gray-500">Giá trị sản phẩm</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="text-sm text-gray-600">Phí vận chuyển</p>
              <p className="text-2xl font-semibold text-green-700">90.000.000₫</p>
              <p className="text-xs text-gray-500">Thu từ phí ship</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <p className="text-sm text-gray-600">Giảm giá</p>
              <p className="text-2xl font-semibold text-red-700">-45.000.000₫</p>
              <p className="text-xs text-gray-500">Khuyến mãi đã áp dụng</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <p className="text-sm text-gray-600">Doanh thu thực</p>
              <p className="text-3xl font-bold text-purple-700">1.145.000.000₫</p>
              <p className="text-xs text-gray-500">subtotal + ship - discount</p>
            </div>
          </div>

          {/* Formula line */}
          <div className="mt-6 text-center text-sm text-gray-600">
            1.100.000.000₫ + 90.000.000₫ − 45.000.000₫ = <span className="font-semibold text-purple-700">1.145.000.000₫</span>
          </div>
        </CardContent>
      </Card>

      {/* Detailed analysis table */}
      <Card>
        <CardHeader>
          <CardTitle>Phân tích chi tiết</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-700">
                  <th className="text-left py-3 px-4 font-semibold">Chỉ số</th>
                  <th className="text-right py-3 px-4 font-semibold">Giá trị</th>
                  <th className="text-right py-3 px-4 font-semibold">% so với doanh thu</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">Tổng tiền hàng</td>
                  <td className="py-3 px-4 text-right font-medium text-blue-600">1.100.000.000₫</td>
                  <td className="py-3 px-4 text-right text-gray-600">96.1%</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">Phí vận chuyển</td>
                  <td className="py-3 px-4 text-right font-medium text-green-600">90.000.000₫</td>
                  <td className="py-3 px-4 text-right text-gray-600">7.9%</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">Giảm giá</td>
                  <td className="py-3 px-4 text-right font-medium text-red-600">-45.000.000₫</td>
                  <td className="py-3 px-4 text-right text-gray-600">-3.9%</td>
                </tr>
                <tr className="bg-purple-50 font-semibold">
                  <td className="py-3 px-4">Doanh thu thực</td>
                  <td className="py-3 px-4 text-right text-purple-700">1.145.000.000₫</td>
                  <td className="py-3 px-4 text-right text-purple-700">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Operational stats */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Thống kê đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Tổng đơn</span>
                <span className="font-semibold">1.982</span>
              </div>
              <div className="mt-2 h-2 rounded bg-gray-100">
                <div className="h-2 rounded bg-gray-400 w-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Đang xử lý</span>
                <span className="font-semibold text-blue-600">320</span>
              </div>
              <div className="mt-2 h-2 rounded bg-blue-100">
                <div className="h-2 rounded bg-blue-500" style={{ width: '16%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Đã giao</span>
                <span className="font-semibold text-green-600">1.450</span>
              </div>
              <div className="mt-2 h-2 rounded bg-green-100">
                <div className="h-2 rounded bg-green-500" style={{ width: '73%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Đã hủy</span>
                <span className="font-semibold text-red-600">212</span>
              </div>
              <div className="mt-2 h-2 rounded bg-red-100">
                <div className="h-2 rounded bg-red-500" style={{ width: '11%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customers */}
        <Card>
          <CardHeader>
            <CardTitle>Thống kê khách hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Tổng khách hàng</span>
              <span className="font-semibold text-gray-900">25.430</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Khách hàng hoạt động</span>
              <span className="font-semibold text-green-600">9.812</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Khách hàng mới (30 ngày)</span>
              <span className="font-semibold text-blue-600">1.204</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Tỷ lệ quay lại</span>
              <span className="font-semibold text-purple-600">38.6%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes / Empty state example */}
      <div className="flex items-start gap-2 text-sm text-gray-600">
        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
        <p>Empty state: Khi không có dữ liệu trong kỳ, hiển thị "Chưa phát sinh giao dịch trong kỳ" thay vì 0đ/NaN.</p>
      </div>
    </div>
  )
}

