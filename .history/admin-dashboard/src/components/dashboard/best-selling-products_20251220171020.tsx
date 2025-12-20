'use client'

import { useBestSellingProducts } from '@/hooks/use-dashboard'
import { TrendingUp, Package } from 'lucide-react'
import Image from 'next/image'
import { formatCurrencyCompactVN, formatImageUrl } from '@/lib/utils'

export function BestSellingProducts() {
  const { data, isLoading, error } = useBestSellingProducts(5)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm bán chạy</h3>
        <div className="flex items-center justify-center py-8 text-red-500">
          Không thể tải dữ liệu
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm bán chạy</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm bán chạy</h3>
        <div className="flex items-center justify-center py-8 text-gray-500">Chưa có dữ liệu</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">Sản phẩm bán chạy</h3>
      </div>

      <div className="space-y-4">
        {data.map((product, index) => (
          <div
            key={product.id}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 font-bold rounded-full flex-shrink-0">
              {index + 1}
            </div>

            <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {product.image ? (
                <Image src={formatImageUrl(product.image)} alt={product.name} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
              <p className="text-sm text-gray-500">{product.category}</p>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="font-semibold text-gray-900">{product.totalSold} đã bán</div>
              <div className="text-sm text-green-600 font-medium">
                {formatCurrencyCompactVN(product.revenue)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
