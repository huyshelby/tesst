'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCategories, useDeleteCategory } from '@/hooks/use-categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Search, Package, AlertTriangle } from 'lucide-react'
import { CategoryActions } from '@/components/categories/category-actions'
import { toast } from 'sonner'

export default function CategoriesPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null)

  const { data: categories = [], isLoading } = useCategories({ search })
  const deleteCategory = useDeleteCategory()

  const categoryToDelete = categories.find((c) => c.id === deleteCategoryId)

  const handleDelete = async () => {
    if (!categoryToDelete) return

    if (categoryToDelete.productCount > 0) {
      toast.error('Không thể xóa danh mục đang có sản phẩm.')
      setDeleteCategoryId(null)
      return
    }

    try {
      await deleteCategory.mutateAsync(categoryToDelete.id)
      toast.success('Xóa danh mục thành công')
      setDeleteCategoryId(null)
    } catch (error) {
      toast.error('Không thể xóa danh mục')
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Danh mục sản phẩm</h1>
          <p className="text-gray-600 mt-1">Quản lý danh mục cho các sản phẩm</p>
        </div>
        <Button onClick={() => router.push('/categories/new')} className="gap-2">
          <Plus className="w-4 h-4" />
          Thêm mới
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Tìm theo tên danh mục..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có danh mục nào</h3>
            <Button onClick={() => router.push('/categories/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo danh mục đầu tiên
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên danh mục</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-center">Số sản phẩm</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
                <TableHead className="text-center w-24">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">{category.name}</TableCell>
                  <TableCell className="text-gray-600">{category.slug}</TableCell>
                  <TableCell className="text-center text-gray-600">
                    {category.productCount}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={category.isActive ? 'default' : 'secondary'}>
                      {category.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <CategoryActions
                      category={category}
                      onDelete={() => setDeleteCategoryId(category.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteCategoryId} onOpenChange={() => setDeleteCategoryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              {categoryToDelete?.productCount > 0 ? (
                <div className="flex items-start gap-3 text-amber-800 bg-amber-50 p-4 rounded-lg">
                  <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold">Không thể xóa danh mục này</h3>
                    <p>Danh mục "{categoryToDelete.name}" đang có {categoryToDelete.productCount} sản phẩm. Vui lòng chuyển các sản phẩm này sang danh mục khác trước khi xóa.</p>
                  </div>
                </div>
              ) : (
                `Bạn có chắc chắn muốn xóa danh mục "${categoryToDelete?.name}"? Hành động này không thể hoàn tác.`
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            {categoryToDelete?.productCount === 0 && (
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                Xóa
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

