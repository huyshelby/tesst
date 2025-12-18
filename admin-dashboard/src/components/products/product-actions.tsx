'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUpdateProduct, useDeleteProduct } from '@/hooks/use-products'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { DeleteConfirmDialog } from '@/components/ui/delete-confirm-dialog'
import { MoreVertical, Edit, Copy, Eye, EyeOff, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface ProductActionsProps {
  product: {
    id: string
    name: string
    slug: string
    isActive: boolean
  }
  onActionComplete?: () => void
}

export function ProductActions({ product, onActionComplete }: ProductActionsProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const updateMutation = useUpdateProduct()
  const deleteMutation = useDeleteProduct()

  const handleToggleActive = async () => {
    try {
      await updateMutation.mutateAsync({
        id: product.id,
        data: { isActive: !product.isActive },
      })
      toast.success(product.isActive ? 'Đã tạm ngưng sản phẩm' : 'Đã kích hoạt sản phẩm')
      onActionComplete?.()
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.')
    }
  }

  const handleDuplicate = () => {
    // Store minimal data for duplication (will fetch full data in new page)
    localStorage.setItem('duplicateProductId', product.id)
    router.push('/products/new?duplicate=true')
    toast.success('Đang sao chép sản phẩm...')
  }

  const handleEdit = () => {
    router.push(`/products/${product.id}/edit`)
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(product.id)
      toast.success('Đã xóa sản phẩm')
      setShowDeleteDialog(false)
      onActionComplete?.()
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa. Vui lòng thử lại.')
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleEdit} className="gap-2">
            <Edit className="w-4 h-4" />
            Chỉnh sửa
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleDuplicate} className="gap-2">
            <Copy className="w-4 h-4" />
            Sao chép
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleToggleActive}
            disabled={updateMutation.isPending}
            className="gap-2"
          >
            {product.isActive ? (
              <>
                <EyeOff className="w-4 h-4" />
                Tạm ngưng
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Kích hoạt
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="gap-2 text-red-600 focus:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
            Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Xóa sản phẩm?"
        description={`Bạn có chắc muốn xóa "${product.name}"? Hành động này không thể hoàn tác.`}
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
