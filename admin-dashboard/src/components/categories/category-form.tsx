'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { Category } from '@/hooks/use-categories'

const categorySchema = z.object({
  name: z.string().min(2, 'Tên danh mục phải có ít nhất 2 ký tự'),
  slug: z.string().min(2, 'Slug phải có ít nhất 2 ký tự'),
  isActive: z.boolean(),
})

export type CategoryFormData = z.infer<typeof categorySchema>

interface CategoryFormProps {
  category?: Category
  onSubmit: (data: CategoryFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function CategoryForm({ category, onSubmit, onCancel, isLoading }: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      slug: category?.slug || '',
      isActive: category?.isActive ?? true,
    },
  })

  const nameValue = watch('name')
  useEffect(() => {
    if (nameValue) {
      const slug = nameValue
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setValue('slug', slug)
    }
  }, [nameValue, setValue])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" type="button" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {category ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}
          </h1>
          <p className="text-gray-600">
            Điền thông tin chi tiết cho danh mục sản phẩm
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Name */}
        <div className="grid gap-2">
          <Label htmlFor="name">
            Tên danh mục <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="VD: Điện thoại thông minh"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        {/* Slug */}
        <div className="grid gap-2">
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug"
            {...register('slug')}
            placeholder="vd-dien-thoai-thong-minh"
            className={errors.slug ? 'border-red-500' : ''}
          />
          {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
          <p className="text-xs text-gray-500">
            Tự động tạo từ tên. Có thể chỉnh sửa thủ công.
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label className="text-base">Trạng thái</Label>
            <p className="text-sm text-gray-600">
              {watch('isActive') ? 'Danh mục sẽ được hiển thị.' : 'Danh mục sẽ bị ẩn.'}
            </p>
          </div>
          <Switch
            checked={watch('isActive')}
            onCheckedChange={(checked) => setValue('isActive', checked)}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isLoading} className="gap-2">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {category ? 'Lưu thay đổi' : 'Tạo danh mục'}
            </>
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Hủy
        </Button>
      </div>
    </form>
  )
}

