'use client'

import { useOrder, useUpdateOrderStatus, useUpdatePaymentStatus, useCancelOrder } from '@/hooks/use-orders'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  User,
  MapPin,
  CreditCard,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Order } from '@/types/models'
import { toast } from 'sonner'
import { formatCurrencyCompactVN } from '@/lib/utils'

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const { data: order, isLoading } = useOrder(id)
  const updateStatus = useUpdateOrderStatus()
  const updatePaymentStatus = useUpdatePaymentStatus()
  const cancelOrder = useCancelOrder()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: Order['status']) => {
    const config = {
      PENDING: { label: 'Chờ xác nhận', variant: 'secondary' as const, icon: Clock },
      CONFIRMED: { label: 'Đã xác nhận', variant: 'default' as const, icon: CheckCircle2 },
      PROCESSING: { label: 'Đang xử lý', variant: 'default' as const, icon: Package },
      SHIPPING: { label: 'Đang giao', variant: 'outline' as const, icon: Truck },
      DELIVERED: { label: 'Đã giao', variant: 'success' as const, icon: CheckCircle2 },
      CANCELLED: { label: 'Đã huỷ', variant: 'destructive' as const, icon: XCircle },
    }
    return config[status]
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateStatus.mutateAsync({
        orderId: id,
        status: newStatus,
      })
      toast.success('Cập nhật trạng thái thành công')
    } catch (error) {
      toast.error('Cập nhật trạng thái thất bại')
    }
  }

  const handlePaymentStatusChange = async (newPaymentStatus: string) => {
    try {
      await updatePaymentStatus.mutateAsync({
        orderId: id,
        paymentStatus: newPaymentStatus as 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED',
      })
      toast.success('Cập nhật trạng thái thanh toán thành công')
    } catch (error) {
      toast.error('Cập nhật trạng thái thanh toán thất bại')
    }
  }

  const handleCancelOrder = async () => {
    if (!confirm('Bạn có chắc muốn huỷ đơn hàng này?')) return
    try {
      await cancelOrder.mutateAsync(id)
      toast.success('Đã huỷ đơn hàng')
    } catch (error) {
      toast.error('Huỷ đơn hàng thất bại')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Đang tải...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">Không tìm thấy đơn hàng</p>
        <Link href="/orders">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </Link>
      </div>
    )
  }

  const statusConfig = getStatusBadge(order.status)
  const StatusIcon = statusConfig.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/orders">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Đơn hàng #{order.orderNumber}</h1>
            <p className="text-muted-foreground mt-1">Đặt ngày {formatDate(order.createdAt)}</p>
          </div>
        </div>
        <Badge variant={statusConfig.variant} className="h-8 px-4">
          <StatusIcon className="w-4 h-4 mr-2" />
          {statusConfig.label}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Thông tin khách hàng</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Họ tên:</span>
                <span className="font-medium">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{order.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Số điện thoại:</span>
                <span className="font-medium">{order.customerPhone}</span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Địa chỉ giao hàng</h2>
            </div>
            <div className="space-y-2">
              <p className="font-medium">{order.shippingAddress}</p>
              <p className="text-muted-foreground">
                {order.shippingWard}, {order.shippingDistrict}
              </p>
              <p className="text-muted-foreground">{order.shippingCity}</p>
            </div>
          </div>

          {/* Products */}
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Sản phẩm</h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead className="text-center">Số lượng</TableHead>
                  <TableHead className="text-right">Đơn giá</TableHead>
                  <TableHead className="text-right">Thành tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {item.productImage && (
                          <div className="relative w-12 h-12 rounded border overflow-hidden">
                            <Image
                              src={item.productImage}
                              alt={item.productName}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{item.productName}</div>
                          {(item.selectedColor || item.selectedStorage) && (
                            <div className="text-sm text-muted-foreground">
                              {[item.selectedColor, item.selectedStorage]
                                .filter(Boolean)
                                .join(' - ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatPrice(item.price)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatPrice(item.subtotal)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-2">Ghi chú</h2>
              <p className="text-muted-foreground">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Thanh toán</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tạm tính:</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Phí vận chuyển:</span>
                <span>{formatPrice(order.shippingFee)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Giảm giá:</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Tổng cộng:</span>
                <span className="text-primary">{formatPrice(order.total)}</span>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Phương thức: </span>
                  <span className="font-medium">
                    {order.paymentMethod === 'COD'
                      ? 'COD'
                      : order.paymentMethod === 'BANK_TRANSFER'
                        ? 'Chuyển khoản'
                        : order.paymentMethod}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Trạng thái: </span>
                  <Badge
                    variant={
                      order.paymentStatus === 'COMPLETED'
                        ? 'success'
                        : order.paymentStatus === 'FAILED'
                          ? 'destructive'
                          : order.paymentStatus === 'REFUNDED'
                            ? 'outline'
                            : 'secondary'
                    }
                    className="text-xs"
                  >
                    {order.paymentStatus === 'COMPLETED'
                      ? 'Đã thanh toán'
                      : order.paymentStatus === 'FAILED'
                        ? 'Thất bại'
                        : order.paymentStatus === 'REFUNDED'
                          ? 'Đã hoàn tiền'
                          : 'Chưa thanh toán'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Cập nhật trạng thái</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Trạng thái đơn hàng
                </label>
                <Select
                  value={order.status}
                  onValueChange={handleStatusChange}
                  disabled={order.status === 'DELIVERED' || order.status === 'CANCELLED'}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Chờ xác nhận</SelectItem>
                    <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
                    <SelectItem value="PROCESSING">Đang xử lý</SelectItem>
                    <SelectItem value="SHIPPING">Đang giao</SelectItem>
                    <SelectItem value="DELIVERED">Đã giao</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Trạng thái thanh toán
                </label>
                <Select
                  value={order.paymentStatus}
                  onValueChange={handlePaymentStatusChange}
                  disabled={order.status === 'CANCELLED'}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Chưa thanh toán</SelectItem>
                    <SelectItem value="COMPLETED">Đã thanh toán</SelectItem>
                    <SelectItem value="FAILED">Thất bại</SelectItem>
                    <SelectItem value="REFUNDED">Đã hoàn tiền</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                <>
                  <Separator />
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleCancelOrder}
                    disabled={cancelOrder.isPending}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Huỷ đơn hàng
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Lịch sử đơn hàng</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="w-0.5 h-full bg-border mt-2" />
                </div>
                <div className="pb-4">
                  <p className="font-medium">Đơn hàng đã đặt</p>
                  <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                </div>
              </div>

              {order.status !== 'PENDING' && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        order.status === 'CANCELLED' ? 'bg-red-100' : 'bg-green-100'
                      }`}
                    >
                      {order.status === 'CANCELLED' ? (
                        <XCircle className="w-4 h-4 text-red-600" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    {order.status !== 'CANCELLED' && order.status !== 'CONFIRMED' && (
                      <div className="w-0.5 h-full bg-border mt-2" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="font-medium">
                      {order.status === 'CANCELLED' ? 'Đơn hàng đã huỷ' : 'Đã xác nhận'}
                    </p>
                    <p className="text-sm text-muted-foreground">{formatDate(order.updatedAt)}</p>
                  </div>
                </div>
              )}

              {order.status === 'DELIVERED' && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Giao hàng thành công</p>
                    <p className="text-sm text-muted-foreground">{formatDate(order.updatedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
