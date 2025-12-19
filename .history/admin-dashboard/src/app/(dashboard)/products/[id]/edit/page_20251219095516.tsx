'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/use-products'
import { useCategories } from '@/hooks/use-categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save, X, Trash2, Upload } from 'lucide-react'
import { ImageUpload } from '@/components/ui/image-upload'

const productSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm là bắt buộc'),
  slug: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().positive('Giá phải lớn hơn 0'),
  listPrice: z.coerce.number().optional(),
  image: z.string().min(1, 'Ảnh đại diện là bắt buộc'),
  brand: z.string().min(1, 'Thương hiệu là bắt buộc'),
  stock: z.coerce.number().int().min(0, 'Tồn kho không thể âm'),
  categoryId: z.string().min(1, 'Danh mục là bắt buộc'),
  isActive: z.boolean().default(true),
  specs: z.record(z.any()).optional(),
})

type ProductFormData = z.infer<typeof productSchema>

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [activeTab, setActiveTab] = useState('basic')

  const { data: product, isLoading } = useProduct(productId)
  // Lấy tất cả danh mục để đảm bảo bind được cả danh mục đang inactive
  const { data: categories = [] } = useCategories()
  const updateMutation = useUpdateProduct()
  const deleteMutation = useDeleteProduct()

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      price: 0,
      listPrice: 0,
      image: '',
      brand: 'Apple',
      stock: 0,
      categoryId: '',
      isActive: true,
      specs: {},
    },
  })

  // Load product data when available
  useEffect(() => {
    if (product && categories.length > 0) {
      console.log('Loading product data into form:', {
        productId: product.id,
        categoryId: product.categoryId,
        categoryName: product.category?.name,
        availableCategories: categories.length,
        categoriesIds: categories.map((c) => c.id),
      })

      form.reset({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        price: product.price,
        listPrice: product.listPrice || 0,
        image: product.image,
        brand: product.brand,
        stock: product.stock,
        categoryId: product.categoryId,
        isActive: product.isActive,
        specs: product.specs || {},
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, categories])

  const onSubmit = (data: ProductFormData) => {
    updateMutation.mutate(
      { id: productId, data },
      {
        onSuccess: () => {
          router.push('/products')
        },
      }
    )
  }

  const handleDelete = () => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      deleteMutation.mutate(productId, {
        onSuccess: () => {
          router.push('/products')
        },
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-gray-200 rounded animate-pulse w-64" />
        <div className="h-96 bg-gray-200 rounded animate-pulse" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900">Không tìm thấy sản phẩm</h3>
        <Button onClick={() => router.back()} className="mt-4">
          Quay lại
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa sản phẩm</h1>
            <p className="text-gray-600 mt-1">{product.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
            <Trash2 className="w-4 h-4 mr-2" />
            Xóa
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            <X className="w-4 h-4 mr-2" />
            Hủy
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={updateMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            {updateMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </div>

      {/* Form with Tabs */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
              <TabsTrigger value="specs">Thuộc tính</TabsTrigger>
              <TabsTrigger value="images">Hình ảnh</TabsTrigger>
              <TabsTrigger value="description">Mô tả</TabsTrigger>
            </TabsList>

            {/* TAB 1: Basic Info - Same as create page */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cơ bản</CardTitle>
                  <CardDescription>Các thông tin chính về sản phẩm</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Tên sản phẩm *</FormLabel>
                          <FormControl>
                            <Input placeholder="iPhone 15 Pro Max 256GB" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU/Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="iphone-15-pro-max-256gb" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Thương hiệu *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ''}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn thương hiệu" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Apple">Apple</SelectItem>
                              <SelectItem value="Samsung">Samsung</SelectItem>
                              <SelectItem value="Xiaomi">Xiaomi</SelectItem>
                              <SelectItem value="OPPO">OPPO</SelectItem>
                              <SelectItem value="Vivo">Vivo</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Danh mục *</FormLabel>
                          <Select
                            key={product?.categoryId}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn danh mục" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tồn kho *</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="100" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giá bán *</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="29990000" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">VNĐ</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="listPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giá gốc</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="34990000" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Để hiển thị giá cũ bị gạch
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <FormLabel>Trạng thái</FormLabel>
                            <FormDescription className="text-xs">
                              Hiển thị sản phẩm trên website
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 2: Specs */}
            <TabsContent value="specs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thuộc tính kỹ thuật</CardTitle>
                  <CardDescription>Thông số kỹ thuật của sản phẩm</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">RAM</label>
                      <Input
                        defaultValue={product.specs?.ram}
                        placeholder="8GB"
                        onChange={(e) => form.setValue('specs.ram', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">ROM</label>
                      <Input
                        defaultValue={product.specs?.storage}
                        placeholder="256GB"
                        onChange={(e) => form.setValue('specs.storage', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Màn hình</label>
                      <Input
                        defaultValue={product.specs?.screen}
                        placeholder='6.7" Super Retina XDR'
                        onChange={(e) => form.setValue('specs.screen', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Camera</label>
                      <Input
                        defaultValue={product.specs?.camera}
                        placeholder="48MP + 12MP + 12MP"
                        onChange={(e) => form.setValue('specs.camera', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">CPU</label>
                      <Input
                        defaultValue={product.specs?.cpu}
                        placeholder="Apple A17 Pro"
                        onChange={(e) => form.setValue('specs.cpu', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Pin</label>
                      <Input
                        defaultValue={product.specs?.battery}
                        placeholder="4422 mAh"
                        onChange={(e) => form.setValue('specs.battery', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium mb-2 block">Màu sắc</label>
                      <Input
                        defaultValue={product.specs?.colors}
                        placeholder="Titan Đen, Titan Trắng..."
                        onChange={(e) => form.setValue('specs.colors', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 3: Images */}
            <TabsContent value="images" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hình ảnh sản phẩm</CardTitle>
                  <CardDescription>Ảnh đại diện và thư viện ảnh</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ảnh đại diện *</FormLabel>
                        <FormControl>
                          <ImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            disabled={updateMutation.isPending}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Upload ảnh mới hoặc giữ nguyên ảnh hiện tại
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hoặc nhập URL thủ công</FormLabel>
                        <FormControl>
                          <Input placeholder="/pictures/iphone-15-pro-max.jpg hoặc https://..." {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Để trống nếu đã upload ảnh ở trên
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 4: Description */}
            <TabsContent value="description" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mô tả sản phẩm</CardTitle>
                  <CardDescription>Thông tin chi tiết về sản phẩm</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Nhập mô tả chi tiết về sản phẩm..."
                            className="min-h-[300px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  )
}
