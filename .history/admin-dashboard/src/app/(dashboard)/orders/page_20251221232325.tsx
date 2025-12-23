'use client'

import { useState } from 'react'
import { useOrders, useDeleteOrder } from '@/hooks/use-orders'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Search, Eye, Download, RefreshCw, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Order } from '@/types/models'
import { formatCurrencyCompactVN } from '@/lib/utils'

export default function OrdersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [paymentFilter, setPaymentFilter] = useState<string>('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null)

  const { data, isLoading, refetch } = useOrders({
    page: 1,
    limit: 50,
    status: statusFilter || undefined,
    paymentMethod: paymentFilter || undefined,
    search: search || undefined,
  })

  const deleteOrderMutation = useDeleteOrder()

  const orders = data?.orders || []
  const pagination = data?.pagination

  // Handle delete order
  const handleDeleteClick = (order: Order) => {
    setOrderToDelete(order)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!orderToDelete) return

    try {
      await deleteOrderMutation.mutateAsync(orderToDelete.id)
      setDeleteDialogOpen(false)
      setOrderToDelete(null)
    } catch (error) {
      // Error is handled by the mutation's onError
    }
  }

  // Format tiền VNĐ (rút gọn với đơn lớn)
  const formatOrderAmount = (price: number) => formatCurrencyCompactVN(price)

  // Format ngày giờ
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Màu badge theo status
  const getStatusBadge = (status: Order['status']) => {
    const config = {
      PENDING: { label: 'Chờ xác nhận', variant: 'secondary' as const },
      CONFIRMED: { label: 'Đã xác nhận', variant: 'default' as const },
      PROCESSING: { label: 'Đang xử lý', variant: 'default' as const },
      SHIPPING: { label: 'Đang giao', variant: 'outline' as const },
      DELIVERED: { label: 'Đã giao', variant: 'success' as const },
      CANCELLED: { label: 'Đã huỷ', variant: 'destructive' as const },
    }
    return config[status]
  }

  // Màu badge theo payment status
  const getPaymentBadge = (status: string) => {
    const config = {
      PENDING: { label: 'Chưa thanh toán', variant: 'secondary' as const },
      COMPLETED: { label: 'Đã thanh toán', variant: 'success' as const },
      FAILED: { label: 'Thất bại', variant: 'destructive' as const },
      REFUNDED: { label: 'Đã hoàn tiền', variant: 'outline' as const },
    }
    return config[status as keyof typeof config] || { label: status, variant: 'secondary' as const }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý đơn hàng</h1>
          <p className="text-muted-foreground mt-1">Theo dõi và xử lý đơn hàng của khách hàng</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm theo mã đơn, tên khách hàng, SĐT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={statusFilter || 'all'}
          onValueChange={(val) => setStatusFilter(val === 'all' ? '' : val)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="PENDING">Chờ xác nhận</SelectItem>
            <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
            <SelectItem value="PROCESSING">Đang xử lý</SelectItem>
            <SelectItem value="SHIPPING">Đang giao</SelectItem>
            <SelectItem value="DELIVERED">Đã giao</SelectItem>
            <SelectItem value="CANCELLED">Đã huỷ</SelectItem>
          </SelectContent>
        </Select>

        {/* Payment Filter */}
        <Select
          value={paymentFilter || 'all'}
          onValueChange={(val) => setPaymentFilter(val === 'all' ? '' : val)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Thanh toán" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả hình thức</SelectItem>
            <SelectItem value="COD">COD</SelectItem>
            <SelectItem value="BANK_TRANSFER">Chuyển khoản</SelectItem>
            <SelectItem value="MOMO">MoMo</SelectItem>
            <SelectItem value="VNPAY">VNPay</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">Tổng đơn hàng</div>
          <div className="text-2xl font-bold mt-2">{pagination?.total || 0}</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">Chờ xử lý</div>
          <div className="text-2xl font-bold mt-2 text-amber-600">
            {orders.filter((o) => o.status === 'PENDING').length}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">Đang giao</div>
          <div className="text-2xl font-bold mt-2 text-blue-600">
            {orders.filter((o) => o.status === 'SHIPPING').length}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">Hoàn thành</div>
          <div className="text-2xl font-bold mt-2 text-green-600">
            {orders.filter((o) => o.status === 'DELIVERED').length}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px]">Mã đơn</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead className="w-[180px]">Ngày đặt</TableHead>
              <TableHead className="text-right w-[140px]">Tổng tiền</TableHead>
              <TableHead className="w-[140px]">Thanh toán</TableHead>
              <TableHead className="w-[140px]">Trạng thái</TableHead>
              <TableHead className="text-right w-[100px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-muted-foreground">Không tìm thấy đơn hàng nào</p>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSearch('')
                        setStatusFilter('')
                        setPaymentFilter('')
                      }}
                    >
                      Xoá bộ lọc
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.orderNumber}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(order.createdAt)}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatOrderAmount(order.total)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        {order.paymentMethod === 'COD'
                          ? 'COD'
                          : order.paymentMethod === 'BANK_TRANSFER'
                            ? 'Chuyển khoản'
                            : order.paymentMethod}
                      </div>
                      <Badge
                        variant={getPaymentBadge(order.paymentStatus).variant}
                        className="text-xs"
                      >
                        {getPaymentBadge(order.paymentStatus).label}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(order.status).variant}>
                      {getStatusBadge(order.status).label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Xem
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(order)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Info */}
      {pagination && (
        <div className="text-sm text-muted-foreground text-center">
          Hiển thị {orders.length} / {pagination.total} đơn hàng
        </div>
      )}
    </div>
  )
}
