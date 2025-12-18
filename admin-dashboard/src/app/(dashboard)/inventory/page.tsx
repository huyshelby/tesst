'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProducts } from '@/hooks/use-products'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Search,
  Filter,
  X,
  AlertTriangle,
  Package,
  TrendingDown,
  TrendingUp,
  Download,
  Upload,
  Edit,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { Product } from '@/types/models'
import { toast } from 'sonner'

export default function InventoryPage() {
  const router = useRouter()

  // Filters
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [stockFilter, setStockFilter] = useState<string>('all')
  const [brandFilter, setBrandFilter] = useState<string>('')

  // Update stock dialog
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [stockChange, setStockChange] = useState<string>('')
  const [changeType, setChangeType] = useState<'add' | 'subtract'>('add')
  const [updateNote, setUpdateNote] = useState('')
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)

  // Data fetching
  const { data: products = [], isLoading } = useProducts({
    search,
    categoryId: categoryFilter || undefined,
    brand: brandFilter || undefined,
  })
  const { data: categories = [] } = useCategories({ isActive: true })

  // Get unique brands
  const brands = Array.from(new Set(products.map((p) => p.brand))).sort()

  // Filter by stock status
  const filteredProducts = products.filter((product) => {
    if (stockFilter === 'all') return true
    if (stockFilter === 'out') return product.stock === 0
    if (stockFilter === 'low') return product.stock > 0 && product.stock <= 10
    if (stockFilter === 'in') return product.stock > 10
    return true
  })

  // Calculate statistics
  const stats = {
    total: products.length,
    outOfStock: products.filter((p) => p.stock === 0).length,
    lowStock: products.filter((p) => p.stock > 0 && p.stock <= 10).length,
    totalValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
  }

  const handleResetFilters = () => {
    setSearch('')
    setCategoryFilter('')
    setStockFilter('all')
    setBrandFilter('')
  }

  const handleOpenUpdateDialog = (product: Product) => {
    setSelectedProduct(product)
    setStockChange('')
    setChangeType('add')
    setUpdateNote('')
    setIsUpdateDialogOpen(true)
  }

  const handleUpdateStock = () => {
    if (!selectedProduct || !stockChange) {
      toast.error('Vui lòng nhập số lượng')
      return
    }

    const change = parseInt(stockChange)
    if (isNaN(change) || change <= 0) {
      toast.error('Số lượng không hợp lệ')
      return
    }

    const newStock =
      changeType === 'add'
        ? selectedProduct.stock + change
        : Math.max(0, selectedProduct.stock - change)

    // TODO: Call API to update stock
    console.log('Update stock:', {
      productId: selectedProduct.id,
      oldStock: selectedProduct.stock,
      newStock,
      change,
      type: changeType,
      note: updateNote,
    })

    toast.success(`Đã cập nhật tồn kho cho ${selectedProduct.name}`)
    setIsUpdateDialogOpen(false)
    setSelectedProduct(null)
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return {
        label: 'Hết hàng',
        variant: 'destructive' as const,
        icon: AlertTriangle,
        color: 'text-red-600',
      }
    }
    if (stock <= 10) {
      return {
        label: 'Sắp hết',
        variant: 'secondary' as const,
        icon: TrendingDown,
        color: 'text-amber-600',
      }
    }
    return {
      label: 'Còn hàng',
      variant: 'default' as const,
      icon: Package,
      color: 'text-green-600',
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
          <h1 className="text-3xl font-bold text-gray-900">Quản lý kho hàng</h1>
          <p className="text-gray-600 mt-1">Theo dõi và quản lý tồn kho sản phẩm</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Xuất Excel
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Nhập Excel
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng sản phẩm</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hết hàng</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.outOfStock}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sắp hết hàng</p>
              <p className="text-3xl font-bold text-amber-600 mt-2">{stats.lowStock}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Giá trị tồn kho</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(stats.totalValue, true)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

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
              placeholder="Tìm sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Stock Status Filter */}
          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Trạng thái kho" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="in">Còn hàng (&gt;10)</SelectItem>
              <SelectItem value="low">Sắp hết (1-10)</SelectItem>
              <SelectItem value="out">Hết hàng (0)</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select
            value={categoryFilter || 'all'}
            onValueChange={(val) => setCategoryFilter(val === 'all' ? '' : val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Danh mục" />
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
              <SelectValue placeholder="Thương hiệu" />
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

          {/* Reset Button */}
          <Button
            variant="outline"
            onClick={handleResetFilters}
            className="gap-2"
            disabled={!search && !categoryFilter && stockFilter === 'all' && !brandFilter}
          >
            <X className="w-4 h-4" />
            Xóa bộ lọc
          </Button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[40%]">Sản phẩm</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Thương hiệu</TableHead>
              <TableHead className="text-right">Giá bán</TableHead>
              <TableHead className="text-center">Tồn kho</TableHead>
              <TableHead className="text-center">Trạng thái</TableHead>
              <TableHead className="text-right">Giá trị</TableHead>
              <TableHead className="text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Package className="w-12 h-12 mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Không tìm thấy sản phẩm</p>
                    <p className="text-sm mt-1">Thử điều chỉnh bộ lọc của bạn</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock)
                const StockIcon = stockStatus.icon
                return (
                  <TableRow key={product.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-full h-full p-2 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">SKU: {product.slug}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {product.category?.name || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{product.brand}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-medium text-gray-900">
                        {formatCurrency(product.price)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`text-lg font-bold ${stockStatus.color}`}>
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={stockStatus.variant} className="gap-1">
                        <StockIcon className="w-3 h-3" />
                        {stockStatus.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm text-gray-600">
                        {formatCurrency(product.price * product.stock, true)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenUpdateDialog(product)}
                        className="gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Cập nhật
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Update Stock Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật tồn kho</DialogTitle>
            <DialogDescription>
              {selectedProduct && (
                <div className="mt-2">
                  <p className="font-medium text-gray-900">{selectedProduct.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Tồn kho hiện tại: <span className="font-semibold">{selectedProduct.stock}</span>
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Loại thay đổi</Label>
              <Select
                value={changeType}
                onValueChange={(val) => setChangeType(val as 'add' | 'subtract')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Nhập hàng (+)</SelectItem>
                  <SelectItem value="subtract">Xuất hàng (-)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Số lượng</Label>
              <Input
                type="number"
                min="1"
                placeholder="Nhập số lượng..."
                value={stockChange}
                onChange={(e) => setStockChange(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Ghi chú (tùy chọn)</Label>
              <Input
                placeholder="Lý do thay đổi..."
                value={updateNote}
                onChange={(e) => setUpdateNote(e.target.value)}
              />
            </div>

            {selectedProduct && stockChange && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-sm text-blue-900">
                  Tồn kho mới:{' '}
                  <span className="font-bold">
                    {changeType === 'add'
                      ? selectedProduct.stock + parseInt(stockChange || '0')
                      : Math.max(0, selectedProduct.stock - parseInt(stockChange || '0'))}
                  </span>
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleUpdateStock}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
