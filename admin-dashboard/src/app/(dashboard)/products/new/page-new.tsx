'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCreateProduct, useProduct } from '@/hooks/use-products'
import { ProductForm } from '@/components/products/product-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewProductPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isDuplicate = searchParams.get('duplicate') === 'true'

  const [initialData, setInitialData] = useState<any>(null)
  const [duplicateId, setDuplicateId] = useState<string | null>(null)

  const createMutation = useCreateProduct()

  // Fetch product data if duplicating
  const { data: productToDuplicate } = useProduct(duplicateId || '', {
    enabled: !!duplicateId,
  })

  useEffect(() => {
    // Load duplicate data if exists
    if (isDuplicate) {
      const stored = localStorage.getItem('duplicateProductId')
      if (stored) {
        setDuplicateId(stored)
        localStorage.removeItem('duplicateProductId')
      }
    }
  }, [isDuplicate])

  useEffect(() => {
    if (productToDuplicate) {
      // Prepare duplicate data with modified name and slug
      const { id, createdAt, updatedAt, ...productData } = productToDuplicate
      setInitialData({
        ...productData,
        name: `${productData.name} (Copy)`,
        slug: `${productData.slug}-copy-${Date.now()}`,
      })
    }
  }, [productToDuplicate])

  const handleSubmit = async (data: any) => {
    await createMutation.mutateAsync(data)
    router.push('/products')
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/products"
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isDuplicate ? 'Sao chép sản phẩm' : 'Thêm sản phẩm mới'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isDuplicate
              ? 'Tạo sản phẩm mới từ bản sao'
              : 'Nhập thông tin sản phẩm để thêm vào hệ thống'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {isDuplicate && !initialData ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Đang tải dữ liệu sản phẩm...</p>
          </div>
        ) : (
          <ProductForm
            product={initialData}
            onSubmit={handleSubmit}
            onCancel={() => router.push('/products')}
            isLoading={createMutation.isPending}
          />
        )}
      </div>
    </div>
  )
}
