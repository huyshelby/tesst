"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Star, ThumbsUp } from "lucide-react";
import type { Product } from "@/lib/mock";

export default function ProductReviews({ product }: { product: Product }) {
  const reviews = [
    {
      id: 1,
      author: "Nguyễn Văn A",
      rating: 5,
      date: "15/12/2025",
      comment:
        "Sản phẩm rất tốt, đúng như mô tả. Giao hàng nhanh, đóng gói cẩn thận.",
      helpful: 24,
    },
    {
      id: 2,
      author: "Trần Thị B",
      rating: 5,
      date: "14/12/2025",
      comment:
        "Máy đẹp, pin trâu, camera chụp ảnh rất đẹp. Rất hài lòng với lần mua hàng này.",
      helpful: 18,
    },
    {
      id: 3,
      author: "Lê Văn C",
      rating: 4,
      date: "13/12/2025",
      comment:
        "Sản phẩm tốt, chỉ tiếc là giá hơi cao. Nhưng đổi lại chất lượng xứng đáng.",
      helpful: 12,
    },
  ];

  return (
    <section className="bg-gray-50 py-10 md:py-12">
      <div className="content-container max-w-[1000px]">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Đánh giá từ khách hàng
            </h2>

            {/* Overall Rating */}
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">
                  {product.rating?.toFixed(1)}
                </div>
                <div className="flex gap-1 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(product.rating ?? 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {product.reviews} đánh giá
                </p>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-lg p-6 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900">
                      {review.author}
                    </p>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>

                <p className="text-gray-700">{review.comment}</p>

                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-[color:var(--color-brand)] transition">
                  <ThumbsUp className="w-4 h-4" />
                  Hữu ích ({review.helpful})
                </button>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center">
            <Button
              variant="outline"
              className="rounded-full px-8 border-gray-300"
            >
              Xem tất cả đánh giá
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
