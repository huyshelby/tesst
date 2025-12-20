'use client'

import { useRouter } from 'next/navigation'
import { useCategory, useUpdateCategory } from '@/hooks/use-categories'
import { CategoryForm, CategoryFormData } from '@/components/categories/category-form'
import { toast } from 'sonner'

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: category, isLoading } = useCategory(params.id)
  const updateCategory = useUpdateCategory()

  const handleSubmit = async (data: CategoryFormData) => {
    try {
      await updateCategory.mutateAsync({ id: params.id, data })
      toast.success('Cập nhật danh mục thành công')
      router.push('/categories')
    } catch (error) {
      toast.error('Không thể cập nhật danh mục')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Đang tải dữ liệu...</p>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-gray-600 mb-4">Không tìm thấy danh mục</p>
        <Button onClick={() => router.push('/categories')}>Quay lại danh sách</Button>
      </div>
    )
  }

  return (
    <CategoryForm
      category={category}
      onSubmit={handleSubmit}
      onCancel={() => router.push('/categories')}
      isLoading={updateCategory.isPending}
    />
  )
}

