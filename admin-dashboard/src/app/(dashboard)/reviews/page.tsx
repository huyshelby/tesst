'use client'

import { useState } from 'react'
import {
  useReviews,
  useApproveReview,
  useRejectReview,
  useReplyReview,
  useDeleteReview,
  useReviewStats,
} from '@/hooks/use-reviews'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Label } from '@/components/ui/label'
import {
  Search,
  Filter,
  X,
  Star,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Reply,
  ThumbsUp,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'
import { Review } from '@/types/review'
import { formatDate } from '@/lib/utils'

export default function ReviewsPage() {
  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [ratingFilter, setRatingFilter] = useState<string>('all')
  const [verifiedFilter, setVerifiedFilter] = useState<string>('all')

  // Dialogs
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Mutations
  const approveMutation = useApproveReview()
  const rejectMutation = useRejectReview()
  const replyMutation = useReplyReview()
  const deleteMutation = useDeleteReview()

  // Data fetching
  const { data: reviews = [], isLoading } = useReviews({
    search,
    status: statusFilter === 'all' ? undefined : (statusFilter as any),
    rating: ratingFilter === 'all' ? undefined : parseInt(ratingFilter),
    verified: verifiedFilter === 'all' ? undefined : verifiedFilter === 'true',
  })
  const { data: stats } = useReviewStats()

  const handleResetFilters = () => {
    setSearch('')
    setStatusFilter('all')
    setRatingFilter('all')
    setVerifiedFilter('all')
  }

  const handleApprove = (id: string) => {
    approveMutation.mutate(id)
  }

  const handleReject = (id: string) => {
    rejectMutation.mutate(id)
  }

  const handleOpenReply = (review: Review) => {
    setSelectedReview(review)
    setReplyText(review.adminReply || '')
    setIsReplyDialogOpen(true)
  }

  const handleSendReply = () => {
    if (!selectedReview || !replyText.trim()) return

    replyMutation.mutate(
      { id: selectedReview.id, reply: replyText },
      {
        onSuccess: () => {
          setIsReplyDialogOpen(false)
          setSelectedReview(null)
          setReplyText('')
        },
      }
    )
  }

  const handleOpenDelete = (review: Review) => {
    setSelectedReview(review)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = () => {
    if (!selectedReview) return

    deleteMutation.mutate(selectedReview.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false)
        setSelectedReview(null)
      },
    })
  }

  const getStatusBadge = (status: Review['status']) => {
    const configs = {
      APPROVED: {
        variant: 'default' as const,
        className: 'bg-green-100 text-green-800',
        icon: CheckCircle2,
        label: 'Đã duyệt',
      },
      PENDING: {
        variant: 'secondary' as const,
        className: 'bg-amber-100 text-amber-800',
        icon: Clock,
        label: 'Chờ duyệt',
      },
      REJECTED: {
        variant: 'destructive' as const,
        className: 'bg-red-100 text-red-800',
        icon: XCircle,
        label: 'Từ chối',
      },
    }

    const config = configs[status]
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className={`gap-1 ${config.className}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48" />
        <div className="h-64 bg-gray-200 rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quản lý đánh giá</h1>
        <p className="text-gray-600 mt-1">Duyệt và phản hồi đánh giá từ khách hàng</p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng đánh giá</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Chờ duyệt</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đã duyệt</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.approved}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Từ chối</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.rejected}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Điểm TB</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {stats.avgRating} <span className="text-lg">★</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Filter className="w-4 h-4" />
          Bộ lọc
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Tìm theo tên, sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="PENDING">Chờ duyệt</SelectItem>
              <SelectItem value="APPROVED">Đã duyệt</SelectItem>
              <SelectItem value="REJECTED">Từ chối</SelectItem>
            </SelectContent>
          </Select>

          {/* Rating Filter */}
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Đánh giá" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả sao</SelectItem>
              <SelectItem value="5">5 sao ⭐⭐⭐⭐⭐</SelectItem>
              <SelectItem value="4">4 sao ⭐⭐⭐⭐</SelectItem>
              <SelectItem value="3">3 sao ⭐⭐⭐</SelectItem>
              <SelectItem value="2">2 sao ⭐⭐</SelectItem>
              <SelectItem value="1">1 sao ⭐</SelectItem>
            </SelectContent>
          </Select>

          {/* Verified Filter */}
          <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Xác thực" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="true">Đã mua hàng</SelectItem>
              <SelectItem value="false">Chưa xác thực</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset Button */}
          <Button
            variant="outline"
            onClick={handleResetFilters}
            className="gap-2"
            disabled={
              !search &&
              statusFilter === 'all' &&
              ratingFilter === 'all' &&
              verifiedFilter === 'all'
            }
          >
            <X className="w-4 h-4" />
            Xóa bộ lọc
          </Button>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[30%]">Đánh giá</TableHead>
              <TableHead className="w-[20%]">Sản phẩm</TableHead>
              <TableHead className="text-center">Đánh giá</TableHead>
              <TableHead className="text-center">Tương tác</TableHead>
              <TableHead className="text-center">Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <MessageSquare className="w-12 h-12 mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Không tìm thấy đánh giá</p>
                    <p className="text-sm mt-1">Thử điều chỉnh bộ lọc của bạn</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow key={review.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-gray-900 flex items-center gap-2">
                            {review.userName}
                            {review.verified && (
                              <Badge variant="outline" className="gap-1 text-xs bg-blue-50">
                                <ShieldCheck className="w-3 h-3" />
                                Đã mua
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">{review.userEmail}</div>
                        </div>
                      </div>
                      {review.title && (
                        <div className="font-medium text-sm text-gray-900">{review.title}</div>
                      )}
                      <div className="text-sm text-gray-600 line-clamp-2">{review.content}</div>
                      {review.adminReply && (
                        <div className="bg-blue-50 border-l-2 border-blue-500 p-2 rounded text-sm">
                          <div className="flex items-center gap-1 text-blue-700 font-medium mb-1">
                            <Reply className="w-3 h-3" />
                            Phản hồi admin
                          </div>
                          <div className="text-gray-700">{review.adminReply}</div>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gray-100 rounded flex-shrink-0">
                        {review.productImage && (
                          <img
                            src={review.productImage}
                            alt={review.productName}
                            className="w-full h-full object-cover rounded"
                          />
                        )}
                      </div>
                      <div className="text-sm text-gray-900">{review.productName}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      {renderStars(review.rating)}
                      <span className="text-sm font-semibold text-gray-700">{review.rating}.0</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                        <ThumbsUp className="w-4 h-4" />
                        {review.helpful}
                      </div>
                      {review.reported > 0 && (
                        <div className="flex items-center justify-center gap-1 text-sm text-red-600">
                          <AlertTriangle className="w-4 h-4" />
                          {review.reported}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{getStatusBadge(review.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {formatDate(new Date(review.createdAt))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      {review.status === 'PENDING' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApprove(review.id)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReject(review.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenReply(review)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Reply className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDelete(review)}
                        className="text-gray-600 hover:text-red-700 hover:bg-red-50"
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

      {/* Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Phản hồi đánh giá</DialogTitle>
            <DialogDescription>
              {selectedReview && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    {renderStars(selectedReview.rating)}
                    <span className="font-medium text-gray-900">{selectedReview.userName}</span>
                  </div>
                  <p className="text-sm text-gray-700">{selectedReview.content}</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nội dung phản hồi</Label>
              <Textarea
                placeholder="Nhập phản hồi của bạn..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={5}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSendReply} disabled={!replyText.trim()}>
              Gửi phản hồi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa đánh giá?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedReview && (
                <>
                  Bạn có chắc muốn xóa đánh giá của <strong>{selectedReview.userName}</strong>?
                  <br />
                  Hành động này không thể hoàn tác.
                </>
              )}
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
