"use client";
import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { products } from "@/lib/mock";
import { formatVND } from "@/utils/currency";

export default function ProductUpsell() {
  // Get accessories (last 4 products)
  const accessories = products.slice(-4);

  return (
    <section className="bg-gray-50 py-10 md:py-12">
      <div className="content-container max-w-[1140px]">
        <div className="space-y-5">
          <div className="text-center space-y-1">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Mua kèm ưu đãi
            </h2>
            <p className="text-gray-600">
              Phụ kiện chính hãng Apple giảm đến 20% khi mua kèm
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {accessories.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg p-4 flex flex-col hover:shadow-md transition"
              >
                <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden mb-3">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>

                <div className="flex-grow space-y-2 mb-3">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[40px]">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-[color:var(--color-brand)]">
                    {formatVND(product.price)}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full rounded-full gap-2 border-[color:var(--color-brand)] text-[color:var(--color-brand)] hover:bg-[color:var(--color-brand)] hover:text-white mt-auto"
                >
                  <Plus className="w-4 h-4" />
                  Thêm
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
