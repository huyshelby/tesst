'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Copy, Pause, Play } from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { usePromotions, useDeletePromotion, useUpdatePromotionStatus } from '@/hooks/use-promotions'
import { Promotion } from '@/types/models'
import { toast } from 'sonner'
import { formatCurrencyCompactVN } from '@/lib/utils'

export default function PromotionsPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [type, setType] = useState<string>('all')
  const [status, setStatus] = useState<string>('all')
  const [deletePromotionId, setDeletePromotionId] = useState<string | null>(null)

  // Filters for API
  const filters = {
    search: search || undefined,
    type: type !== 'all' ? (type as 'PERCENTAGE' | 'FIXED_AMOUNT') : undefined,
    status: status !== 'all' ? (status as 'ACTIVE' | 'EXPIRED' | 'PAUSED') : undefined,
  }

  const { data, isLoading } = usePromotions(filters)
  const deletePromotion = useDeletePromotion()
  const updateStatus = useUpdatePromotionStatus()

  const handleDelete = async () => {
    if (!deletePromotionId) return

    try {
      await deletePromotion.mutateAsync(deletePromotionId)
      toast.success('Xóa khuyến mãi thành công')
      setDeletePromotionId(null)
    } catch (error) {
      toast.error('Không thể xóa khuyến mãi')
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
    try {
      await updateStatus.mutateAsync({ id, status: newStatus })
      toast.success(newStatus === 'ACTIVE' ? 'Đã kích hoạt khuyến mãi' : 'Đã tạm dừng khuyến mãi')
    } catch (error) {
      toast.error('Không thể cập nhật trạng thái')
    }
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success('Đã sao chép mã')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="success">Đang hoạt động</Badge>
      case 'PAUSED':
        return <Badge className="bg-amber-500 text-white">Tạm dừng</Badge>
      case 'EXPIRED':
        return <Badge variant="secondary">Hết hạn</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeBadge = (promotion: Promotion) => {
    if (promotion.type === 'PERCENTAGE') {
      return (
        <Badge variant="outline" className="text-blue-600 border-blue-300">
          Giảm {promotion.value}%
          {promotion.maxDiscount && ` (tối đa ${formatCurrency(promotion.maxDiscount)})`}
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="text-green-600 border-green-300">
        Giảm {formatCurrency(promotion.value)}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const getUsagePercentage = (promotion: Promotion) => {
    if (!promotion.usageLimit) return null
    return Math.round((promotion.usageCount / promotion.usageLimit) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Khuyến mãi</h1>
          <p className="text-muted-foreground">Quản lý mã giảm giá và chương trình khuyến mãi</p>
        </div>
        <Button asChild>
          <Link href="/promotions/new">
            <Plus className="h-4 w-4 mr-2" />
            Tạo khuyến mãi
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên hoặc mã..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Loại giảm giá" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value="PERCENTAGE">Phần trăm</SelectItem>
            <SelectItem value="FIXED_AMOUNT">Số tiền cố định</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
            <SelectItem value="PAUSED">Tạm dừng</SelectItem>
            <SelectItem value="EXPIRED">Hết hạn</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Đang hoạt động</p>
            <Badge variant="success" className="ml-2">
              {data?.promotions.filter((p) => p.status === 'ACTIVE').length || 0}
            </Badge>
          </div>
          <p className="mt-2 text-2xl font-bold">
            {data?.promotions.filter((p) => p.status === 'ACTIVE').length || 0}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Tạm dừng</p>
            <Badge className="ml-2 bg-amber-500 text-white">
              {data?.promotions.filter((p) => p.status === 'PAUSED').length || 0}
            </Badge>
          </div>
          <p className="mt-2 text-2xl font-bold">
            {data?.promotions.filter((p) => p.status === 'PAUSED').length || 0}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Hết hạn</p>
            <Badge variant="secondary" className="ml-2">
              {data?.promotions.filter((p) => p.status === 'EXPIRED').length || 0}
            </Badge>
          </div>
          <p className="mt-2 text-2xl font-bold">
            {data?.promotions.filter((p) => p.status === 'EXPIRED').length || 0}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên chương trình</TableHead>
              <TableHead>Mã voucher</TableHead>
              <TableHead>Loại giảm giá</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead>Lượt sử dụng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : data?.promotions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Không tìm thấy khuyến mãi nào
                </TableCell>
              </TableRow>
            ) : (
              data?.promotions.map((promotion) => (
                <TableRow key={promotion.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{promotion.name}</p>
                      {promotion.minOrderAmount && (
                        <p className="text-xs text-muted-foreground">
                          Đơn tối thiểu: {formatCurrency(promotion.minOrderAmount)}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                        {promotion.code}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyCode(promotion.code)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(promotion)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{formatDate(promotion.startDate)}</p>
                      <p className="text-muted-foreground">→ {formatDate(promotion.endDate)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">
                        {promotion.usageCount}
                        {promotion.usageLimit ? ` / ${promotion.usageLimit}` : ' lượt'}
                      </p>
                      {promotion.usageLimit && (
                        <div className="mt-1 flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${getUsagePercentage(promotion)}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {getUsagePercentage(promotion)}%
                          </p>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(promotion.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/promotions/${promotion.id}/edit`)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCopyCode(promotion.code)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Sao chép mã
                        </DropdownMenuItem>
                        {promotion.status !== 'EXPIRED' && (
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(promotion.id, promotion.status)}
                          >
                            {promotion.status === 'ACTIVE' ? (
                              <>
                                <Pause className="h-4 w-4 mr-2" />
                                Tạm dừng
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Kích hoạt
                              </>
                            )}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeletePromotionId(promotion.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePromotionId} onOpenChange={() => setDeletePromotionId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa khuyến mãi này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
