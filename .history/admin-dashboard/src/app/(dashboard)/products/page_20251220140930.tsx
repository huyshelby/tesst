'use client'

import { useDeferredValue, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProducts, useBulkDeleteProducts } from '@/hooks/use-products'
import { useCategories } from '@/hooks/use-categories'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ProductActions } from '@/components/products/product-actions'
import { Plus, Search, Filter, X, Trash2, Image as ImageIcon, Package } from 'lucide-react'
import { formatCurrencyCompactVN } from '@/lib/utils'

export default function ProductsPage() {
  const router = useRouter()
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Filters
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [brandFilter, setBrandFilter] = useState<string>('')

  const deferredSearch = useDeferredValue(search)


  // Data fetching
  const { data: products = [], isLoading } = useProducts({
    search: deferredSearch,
    categoryId: categoryFilter || undefined,
    isActive: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined,
    brand: brandFilter || undefined,
  })
  const { data: categories = [] } = useCategories({ isActive: true })
  const bulkDeleteMutation = useBulkDeleteProducts()

  // Get unique brands from products (safe check)
  const brands = Array.from(new Set((products || []).map((p) => p.brand))).sort()

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(products.map((p) => p.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id])
    } else {
      setSelectedIds(selectedIds.filter((i) => i !== id))
    }
  }

  const handleBulkDelete = () => {
    if (confirm(`Bạn có chắc muốn xóa ${selectedIds.length} sản phẩm?`)) {
      bulkDeleteMutation.mutate(selectedIds, {
        onSuccess: () => setSelectedIds([]),
      })
    }
  }

  const handleResetFilters = () => {
    setSearch('')
    setCategoryFilter('')
    setStatusFilter('')
    setBrandFilter('')
  }

  const formatCurrency = (price: number) => formatCurrencyCompactVN(price)

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
          <h1 className="text-3xl font-bold text-gray-900">Sản phẩm</h1>
          <p className="text-gray-600 mt-1">Quản lý danh sách sản phẩm của cửa hàng</p>
        </div>
        <Button onClick={() => router.push('/products/new')} className="gap-2">
          <Plus className="w-4 h-4" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Filter className="w-4 h-4" />
          Bộ lọc
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Tìm theo tên hoặc SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category Filter */}
          <Select
            value={categoryFilter || 'all'}
            onValueChange={(val) => setCategoryFilter(val === 'all' ? '' : val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tất cả danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Brand Filter */}
          <Select
            value={brandFilter || 'all'}
            onValueChange={(val) => setBrandFilter(val === 'all' ? '' : val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tất cả thương hiệu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả thương hiệu</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={statusFilter || 'all'}
            onValueChange={(val) => setStatusFilter(val === 'all' ? '' : val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="inactive">Không hoạt động</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters & Reset */}
        {(search || categoryFilter || statusFilter || brandFilter) && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Bộ lọc đang áp dụng:</span>
            <Button variant="outline" size="sm" onClick={handleResetFilters} className="gap-2">
              <X className="w-3 h-3" />
              Xóa tất cả
            </Button>
          </div>
        )}
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm text-blue-900 font-medium">
            Đã chọn {selectedIds.length} sản phẩm
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            disabled={bulkDeleteMutation.isPending}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Xóa đã chọn
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có sản phẩm nào</h3>
            <p className="text-gray-600 mb-4">Bắt đầu bằng cách thêm sản phẩm đầu tiên của bạn</p>
            <Button onClick={() => router.push('/products/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm sản phẩm
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedIds.length === products.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-20">Ảnh</TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Thương hiệu</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead className="text-right">Giá</TableHead>
                <TableHead className="text-center">Tồn kho</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
                <TableHead className="text-center w-24">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow
                  key={product.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/products/${product.id}/edit`)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.includes(product.id)}
                      onCheckedChange={(checked) => handleSelectOne(product.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-semibold text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">SKU: {product.slug}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700">{product.brand}</TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{product.category?.name || '—'}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-semibold text-blue-600">
                      {formatCurrency(product.price)}
                    </div>
                    {product.listPrice && product.listPrice > product.price && (
                      <div className="text-sm text-gray-400 line-through">
                        {formatCurrency(product.listPrice)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`font-medium ${
                        product.stock > 10
                          ? 'text-green-600'
                          : product.stock > 0
                            ? 'text-amber-600'
                            : 'text-red-600'
                      }`}
                    >
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={product.isActive ? 'default' : 'secondary'}>
                      {product.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <ProductActions product={product} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          Hiển thị <span className="font-semibold text-gray-900">{products.length}</span> sản phẩm
        </div>
      </div>
    </div>
  )
}
