'use client'

import { useRouter } from 'next/navigation'
import { useCreateCategory } from '@/hooks/use-categories'
import { CategoryForm, CategoryFormData } from '@/components/categories/category-form'
import { toast } from 'sonner'

export default function NewCategoryPage() {
  const router = useRouter()
  const createCategory = useCreateCategory()

  const handleSubmit = async (data: CategoryFormData) => {
    try {
      await createCategory.mutateAsync(data)
      toast.success('Tạo danh mục thành công')
      router.push('/categories')
    } catch (error) {
      toast.error('Không thể tạo danh mục')
    }
  }

  return (
    <CategoryForm
      onSubmit={handleSubmit}
      onCancel={() => router.push('/categories')}
      isLoading={createCategory.isPending}
    />
  )
}

