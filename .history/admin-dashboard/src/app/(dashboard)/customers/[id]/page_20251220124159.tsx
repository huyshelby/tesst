'use client'

import { use, useState } from 'react'
import {
  useCustomerWithOrders,
  useUpdateCustomerRole,
  useDeleteCustomer,
  useRevokeCustomerSessions,
} from '@/hooks/use-customers'
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
import { Textarea } from '@/components/ui/textarea'
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  DollarSign,
  Shield,
  UserX,
  Crown,
  Users,
  UserPlus,
  LogOut,
  Trash2,
} from 'lucide-react'
import Link from 'next/link'
import { Customer } from '@/types/models'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { data: customer, isLoading } = useCustomerWithOrders(resolvedParams.id)
  const updateRole = useUpdateCustomerRole()
  const deleteCustomer = useDeleteCustomer()
  const revokeSessions = useRevokeCustomerSessions()

  const [internalNote, setInternalNote] = useState('')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getAvatarPlaceholder = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getCustomerTier = () => {
    if (!customer) return null
    const orders = customer.totalOrders || 0
    if (orders === 0) return { label: 'Mới', color: 'bg-gray-100 text-gray-700', icon: UserPlus }
    if (orders >= 10) return { label: 'VIP', color: 'bg-amber-100 text-amber-700', icon: Crown }
    if (orders >= 3) return { label: 'Thân thiết', color: 'bg-blue-100 text-blue-700', icon: Users }
    return { label: 'Mới', color: 'bg-gray-100 text-gray-700', icon: UserPlus }
  }

  const handleRoleChange = async (newRole: string) => {
    try {
      await updateRole.mutateAsync({
        userId: resolvedParams.id,
        role: newRole as 'USER' | 'ADMIN',
      })
      toast.success('Cập nhật vai trò thành công')
    } catch (error) {
      toast.error('Cập nhật vai trò thất bại')
    }
  }

  const handleRevokeSessions = async () => {
    if (!confirm('Bạn có chắc muốn đăng xuất khách hàng này khỏi tất cả thiết bị?')) return
    try {
      await revokeSessions.mutateAsync(resolvedParams.id)
      toast.success('Đã đăng xuất khách hàng khỏi tất cả thiết bị')
    } catch (error) {
      toast.error('Thao tác thất bại')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc muốn XOÁ khách hàng này? Hành động này KHÔNG THỂ HOÀN TÁC!')) return
    try {
      await deleteCustomer.mutateAsync(resolvedParams.id)
      toast.success('Đã xoá khách hàng')
      router.push('/customers')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Xoá khách hàng thất bại')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Đang tải...</div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">Không tìm thấy khách hàng</p>
        <Link href="/customers">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </Link>
      </div>
    )
  }

  const tier = getCustomerTier()
  const TierIcon = tier?.icon || User

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/customers">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            {/* Large Avatar */}
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
              {getAvatarPlaceholder(customer.name)}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{customer.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                {tier && (
                  <Badge className={tier.color}>
                    <TierIcon className="w-3 h-3 mr-1" />
                    {tier.label}
                  </Badge>
                )}
                <Badge variant={customer.role === 'ADMIN' ? 'default' : 'secondary'}>
                  <Shield className="w-3 h-3 mr-1" />
                  {customer.role === 'ADMIN' ? 'Admin' : 'Khách hàng'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Thông tin cá nhân</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Ngày đăng ký</p>
                  <p className="font-medium">{formatDate(customer.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Lịch sử đơn hàng</h2>
            </div>
            {customer.orders && customer.orders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã đơn</TableHead>
                    <TableHead>Ngày đặt</TableHead>
                    <TableHead className="text-right">Tổng tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customer.orders.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/orders/${order.id}`}
                          className="hover:text-primary hover:underline"
                        >
                          #{order.orderNumber}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm">{formatDateTime(order.createdAt)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatPrice(order.total)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === 'DELIVERED'
                              ? 'success'
                              : order.status === 'CANCELLED'
                                ? 'destructive'
                                : 'secondary'
                          }
                        >
                          {order.status === 'DELIVERED'
                            ? 'Đã giao'
                            : order.status === 'CANCELLED'
                              ? 'Đã huỷ'
                              : order.status === 'SHIPPING'
                                ? 'Đang giao'
                                : order.status === 'PROCESSING'
                                  ? 'Đang xử lý'
                                  : order.status === 'CONFIRMED'
                                    ? 'Đã xác nhận'
                                    : 'Chờ xác nhận'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Khách hàng chưa có đơn hàng nào
              </div>
            )}
          </div>

          {/* Internal Notes */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Ghi chú nội bộ</h2>
            <Textarea
              placeholder="Thêm ghi chú về khách hàng (chỉ admin/CSKH thấy)..."
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end mt-3">
              <Button size="sm" disabled>
                Lưu ghi chú
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Tính năng ghi chú đang được phát triển
            </p>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Thống kê nhanh</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Tổng đơn hàng</span>
                </div>
                <span className="text-2xl font-bold">{customer.totalOrders || 0}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Tổng chi tiêu</span>
                </div>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(customer.totalSpent || 0)}
                </span>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Đơn gần nhất</p>
                <p className="text-sm font-medium">
                  {customer.orders && customer.orders.length > 0
                    ? formatDateTime(customer.orders[0].createdAt)
                    : 'Chưa có đơn hàng'}
                </p>
              </div>
            </div>
          </div>

          {/* Role Management */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Quản lý vai trò</h2>
            <div className="space-y-3">
              <Select
                value={customer.role}
                onValueChange={handleRoleChange}
                disabled={updateRole.isPending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">Khách hàng</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Thay đổi quyền truy cập của khách hàng
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Thao tác</h2>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleRevokeSessions}
                disabled={revokeSessions.isPending}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Đăng xuất khỏi tất cả thiết bị
              </Button>
              <Separator />
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={handleDelete}
                disabled={deleteCustomer.isPending}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Xoá tài khoản
              </Button>
              <p className="text-xs text-muted-foreground">⚠️ Hành động này không thể hoàn tác</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
