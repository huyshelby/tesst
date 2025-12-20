'use client'

import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useRecentOrders } from '@/hooks/use-dashboard'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { formatCurrencyCompactVN } from '@/lib/utils'

const STATUS_STYLES: { [key: string]: { bg: string; text: string; label: string } } = {
  PENDING: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Chờ xác nhận' },
  CONFIRMED: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Đã xác nhận' },
  PROCESSING: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Đang xử lý' },
  SHIPPING: { bg: 'bg-cyan-100', text: 'text-cyan-700', label: 'Đang giao' },
  DELIVERED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Đã giao' },
  CANCELLED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Đã hủy' },
}

const PAYMENT_STATUS_STYLES: { [key: string]: { bg: string; text: string; label: string } } = {
  PENDING: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Chưa thanh toán' },
  COMPLETED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Đã thanh toán' },
  FAILED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Thất bại' },
  REFUNDED: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Đã hoàn tiền' },
}

export function RecentOrdersTable() {
  const { data, isLoading, error } = useRecentOrders(10)

  const formatOrderAmount = (value: number) => {
    return formatCurrencyCompactVN(value)
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Đơn hàng mới nhất</h3>
        <div className="flex items-center justify-center py-8 text-red-500">
          Không thể tải dữ liệu
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Đơn hàng mới nhất</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Đơn hàng mới nhất</h3>
        <div className="flex items-center justify-center py-8 text-gray-500">Chưa có đơn hàng</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Đơn hàng mới nhất</h3>
        <Link
          href="/orders"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          Xem tất cả
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Mã đơn</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Khách hàng</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Tổng tiền</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Thanh toán</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Trạng thái</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order) => {
              const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES.PENDING
              const paymentStyle =
                PAYMENT_STATUS_STYLES[order.paymentStatus] || PAYMENT_STATUS_STYLES.PENDING

              return (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <Link
                      href={`/orders/${order.id}`}
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-xs text-gray-500">{order.customerEmail}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentStyle.bg} ${paymentStyle.text}`}
                    >
                      {paymentStyle.label}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
                    >
                      {statusStyle.label}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
