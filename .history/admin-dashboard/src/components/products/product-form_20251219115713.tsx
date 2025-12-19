'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCategories } from '@/hooks/use-categories'
import { Loader2, Save, X, Image as ImageIcon, Upload } from 'lucide-react'
import type { Product } from '@/types/models'
import { ImageUpload } from '@/components/ui/image-upload'
import { uploadImage, uploadImages } from '@/lib/upload'

const productSchema = z.object({
  name: z.string().min(3, 'Tên sản phẩm phải có ít nhất 3 ký tự'),
  slug: z.string().min(3, 'Slug phải có ít nhất 3 ký tự'),
  description: z.string().optional(),
  price: z.number().positive('Giá phải lớn hơn 0'),
  listPrice: z.number().positive().optional().or(z.literal(0)),
  image: z.string().min(1, 'Vui lòng nhập URL ảnh'),
  images: z.array(z.string()).optional(),
  brand: z.string().min(2, 'Thương hiệu phải có ít nhất 2 ký tự'),
  stock: z.number().int().min(0, 'Tồn kho không được âm'),
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  specs: z.record(z.any()).optional(),
  isActive: z.boolean(),
  installment: z.boolean(),
  badges: z.array(z.string()).optional(),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  product?: Product
  onSubmit: (data: ProductFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function ProductForm({ product, onSubmit, onCancel, isLoading }: ProductFormProps) {
  const { data: categories = [] } = useCategories({ isActive: true })
  const [additionalImages, setAdditionalImages] = useState<string[]>(product?.images || [])
  const [specsJson, setSpecsJson] = useState(JSON.stringify(product?.specs || {}, null, 2))
  const [badgesInput, setBadgesInput] = useState((product?.badges || []).join(', '))
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([])
  const additionalFileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      price: 0,
      listPrice: undefined,
      image: '',
      images: [],
      brand: '',
      stock: 0,
      categoryId: '',
      specs: {},
      isActive: true,
      installment: false,
      badges: [],
    },
  })

  // Reset form when product data loads
  useEffect(() => {
    if (product && categories.length > 0) {
      console.log('Product data loaded:', {
        categoryId: product.categoryId,
        categoryName: product.category?.name,
        categoriesCount: categories.length,
      })

      reset({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        price: product.price || 0,
        listPrice: product.listPrice || undefined,
        image: product.image || '',
        images: product.images || [],
        brand: product.brand || '',
        stock: product.stock || 0,
        categoryId: product.categoryId || '',
        specs: product.specs || {},
        isActive: product.isActive ?? true,
        installment: product.installment || false,
        badges: product.badges || [],
      })
      setAdditionalImages(product.images || [])
      setSpecsJson(JSON.stringify(product.specs || {}, null, 2))
      setBadgesInput((product.badges || []).join(', '))
    }
  }, [product, categories, reset])
  const nameValue = watch('name')
  useEffect(() => {
    if (!product && nameValue) {
      const slug = nameValue
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setValue('slug', slug)
    }
  }, [nameValue, product, setValue])

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      // Parse specs JSON
      let parsedSpecs = {}
      try {
        parsedSpecs = specsJson ? JSON.parse(specsJson) : {}
      } catch (e) {
        alert('Specs JSON không hợp lệ. Vui lòng kiểm tra lại định dạng.')
        return
      }

      // Parse badges
      const parsedBadges = badgesInput
        .split(',')
        .map((b) => b.trim())
        .filter(Boolean)

      // Upload main image if a File was selected
      let imageUrl = data.image
      if (mainImageFile) {
        const up = await uploadImage(mainImageFile)
        imageUrl = up.url
      }

      // Upload additional files if any
      let imagesToSave = [...additionalImages]
      if (additionalFiles.length > 0) {
        const ups = await uploadImages(additionalFiles)
        imagesToSave = [...imagesToSave, ...ups.map((u) => u.url)]
      }

      const submitData = {
        ...data,
        image: imageUrl,
        images: imagesToSave,
        specs: parsedSpecs,
        badges: parsedBadges,
        isActive: data.isActive ?? true,
        installment: data.installment ?? false,
      }

      console.log('Submitting product data:', submitData)
      await onSubmit(submitData)
    } catch (error) {
      console.error('Form submit error:', error)
      alert('Có lỗi xảy ra khi lưu sản phẩm. Vui lòng kiểm tra console.')
    }
  }

  const handleAddImage = () => {
    const url = prompt('Nhập URL ảnh:')
    if (url) {
      setAdditionalImages([...additionalImages, url])
    }
  }

  const handleRemoveImage = (index: number) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
          <TabsTrigger value="pricing">Giá & Tồn kho</TabsTrigger>
          <TabsTrigger value="images">Hình ảnh</TabsTrigger>
          <TabsTrigger value="specs">Thông số & Khác</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-4 mt-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Tên sản phẩm <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="iPhone 15 Pro Max 256GB"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                {...register('slug')}
                placeholder="iphone-15-pro-max-256gb"
                className={errors.slug ? 'border-red-500' : ''}
              />
              {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
              <p className="text-xs text-gray-500">
                Tự động tạo từ tên sản phẩm. Có thể chỉnh sửa thủ công.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Mô tả chi tiết về sản phẩm..."
                rows={5}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="brand">
                Thương hiệu <span className="text-red-500">*</span>
              </Label>
              <Input
                id="brand"
                {...register('brand')}
                placeholder="Apple"
                className={errors.brand ? 'border-red-500' : ''}
              />
              {errors.brand && <p className="text-sm text-red-500">{errors.brand.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="categoryId">
                Danh mục <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => {
                  const selectedCategory = categories.find((c) => c.id === field.value)
                  return (
                    <Select value={field.value || ''} onValueChange={field.onChange}>
                      <SelectTrigger className={errors.categoryId ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Chọn danh mục">
                          {selectedCategory?.name || 'Chọn danh mục'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )
                }}
              />
              {errors.categoryId && (
                <p className="text-sm text-red-500">{errors.categoryId.message}</p>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="price">
                Giá bán <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="1000"
                {...register('price', { valueAsNumber: true })}
                placeholder="29990000"
                className={errors.price ? 'border-red-500' : ''}
              />
              {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="listPrice">Giá niêm yết (giá gốc)</Label>
              <Input
                id="listPrice"
                type="number"
                step="1000"
                {...register('listPrice', { valueAsNumber: true })}
                placeholder="34990000"
              />
              <p className="text-xs text-gray-500">Để trống nếu không có giảm giá</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="stock">
                Tồn kho <span className="text-red-500">*</span>
              </Label>
              <Input
                id="stock"
                type="number"
                {...register('stock', { valueAsNumber: true })}
                placeholder="100"
                className={errors.stock ? 'border-red-500' : ''}
              />
              {errors.stock && <p className="text-sm text-red-500">{errors.stock.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="installment">Trả góp</Label>
              <div className="flex items-center space-x-2 h-10">
                <Switch
                  id="installment"
                  checked={watch('installment')}
                  onCheckedChange={(checked) => setValue('installment', checked)}
                />
                <Label htmlFor="installment" className="cursor-pointer">
                  Hỗ trợ trả góp 0%
                </Label>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images" className="space-y-4 mt-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="image">
                Ảnh đại diện <span className="text-red-500">*</span>
              </Label>
              <Input
                id="image"
                {...register('image')}
                placeholder="https://example.com/image.jpg"
                className={errors.image ? 'border-red-500' : ''}
              />
              {errors.image && <p className="text-sm text-red-500">{errors.image.message}</p>}
              {watch('image') && (
                <div className="mt-2">
                  <img
                    src={watch('image')}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Ảnh bổ sung</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddImage}>
                  <Upload className="w-4 h-4 mr-2" />
                  Thêm ảnh
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {additionalImages.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Image ${index + 1}`}
                      className="w-full h-24 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {additionalImages.length === 0 && (
                  <div className="col-span-4 text-center py-8 border-2 border-dashed rounded-lg">
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Chưa có ảnh bổ sung</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Specs Tab */}
        <TabsContent value="specs" className="space-y-4 mt-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="badges">Badges (phân cách bằng dấu phẩy)</Label>
              <Input
                id="badges"
                value={badgesInput}
                onChange={(e) => setBadgesInput(e.target.value)}
                placeholder="Trả góp 0%, Mới 100%, Giảm sốc"
              />
              <p className="text-xs text-gray-500">Ví dụ: Trả góp 0%, Mới 100%, Giảm sốc</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="specs">Thông số kỹ thuật (JSON)</Label>
              <Textarea
                id="specs"
                value={specsJson}
                onChange={(e) => setSpecsJson(e.target.value)}
                placeholder='{"ram": "8GB", "storage": "256GB", "color": "Titan Tự Nhiên"}'
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                Định dạng JSON. Ví dụ: {`{"ram": "8GB", "storage": "256GB"}`}
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="isActive">Trạng thái</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={watch('isActive')}
                  onCheckedChange={(checked) => setValue('isActive', checked)}
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  {watch('isActive') ? 'Đang hoạt động' : 'Tạm ngưng'}
                </Label>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Hủy
        </Button>
        <Button type="submit" disabled={isLoading} className="gap-2">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {product ? 'Cập nhật' : 'Tạo mới'}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
