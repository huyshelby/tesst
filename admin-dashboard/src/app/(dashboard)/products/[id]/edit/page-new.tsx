'use client'

import { useRouter, useParams } from 'next/navigation'
import { useState } from 'react'
import { useProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/use-products'
import { ProductForm } from '@/components/products/product-form'
import { DeleteConfirmDialog } from '@/components/ui/delete-confirm-dialog'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Trash2, Copy } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { data: product, isLoading } = useProduct(productId)
  const updateMutation = useUpdateProduct()
  const deleteMutation = useDeleteProduct()

  const handleSubmit = async (data: any) => {
    await updateMutation.mutateAsync({ id: productId, data })
    router.push('/products')
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(productId)
      router.push('/products')
    } catch (error) {
      setShowDeleteDialog(false)
    }
  }

  const handleDuplicate = () => {
    if (!product) return

    // Store product data for duplication
    const duplicateData = {
      ...product,
      name: `${product.name} (Copy)`,
      slug: `${product.slug}-copy`,
    }

    // Navigate to new product page with data
    localStorage.setItem('duplicateProduct', JSON.stringify(duplicateData))
    router.push('/products/new?duplicate=true')
    toast.success('Đã sao chép sản phẩm. Vui lòng điền thông tin bổ sung.')
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 p-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48" />
        <div className="h-96 bg-gray-200 rounded animate-pulse" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h2>
          <p className="text-gray-600 mb-4">Sản phẩm không tồn tại hoặc đã bị xóa</p>
          <Button onClick={() => router.push('/products')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa sản phẩm</h1>
              <p className="text-gray-600 mt-1">Cập nhật thông tin sản phẩm</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleDuplicate} className="gap-2">
              <Copy className="w-4 h-4" />
              Sao chép
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Xóa
            </Button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <ProductForm
            product={product}
            onSubmit={handleSubmit}
            onCancel={() => router.push('/products')}
            isLoading={updateMutation.isPending}
          />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
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
