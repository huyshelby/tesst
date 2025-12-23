import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/product-api";
import { formatVND } from "@/utils/currency";
import { formatImageUrl } from "@/lib/utils";

export default function AppleProductCard({ product }: { product: Product }) {
  const discount =
    product.listPrice && product.listPrice > product.price
      ? Math.round(
          ((product.listPrice - product.price) / product.listPrice) * 100
        )
      : 0;

  // Determine primary badge (priority: discount > new)
  const primaryBadge =
    discount > 0
      ? { label: `-${discount}%`, type: "discount" }
      : product.badges?.[0]?.toLowerCase().includes("mới")
      ? { label: "Mới", type: "new" }
      : null;

  const secondaryInfo = product.badges?.find(
    (b) =>
      b.toLowerCase().includes("còn hàng") ||
      b.toLowerCase().includes("trả góp")
  );

  return (
    <Link href={`/product/${product.slug}`}>
      <div className="group relative bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
        {/* Image Container - 1:1 ratio with generous padding */}
        <div className="relative aspect-square overflow-hidden bg-white p-6 md:p-8">
          <Image
            src={formatImageUrl(product.image)}
            alt={product.name}
            fill
            className="w-full h-full object-contain"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            loading="lazy"
            quality={85}
          />

          {/* Single Primary Badge - Top Left */}
          {primaryBadge && (
            <div
              className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                primaryBadge.type === "discount"
                  ? "bg-red-500 text-white"
                  : "bg-blue-500 text-white"
              }`}
            >
              {primaryBadge.label}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 md:p-5 space-y-3">
          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm leading-snug min-h-[40px]">
            {product.name}
          </h3>

          {/* Pricing */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-xl md:text-2xl font-bold text-[color:var(--color-brand)]">
                {formatVND(product.price)}
              </span>
              {product.listPrice && product.listPrice > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  {formatVND(product.listPrice)}
                </span>
              )}
            </div>

            {/* Secondary Info */}
            {secondaryInfo && (
              <p className="text-xs text-gray-600">{secondaryInfo}</p>
            )}
          </div>

          {/* Add to Cart Button - Hidden on desktop, visible on mobile */}
          <Button
            className="w-full bg-[color:var(--color-brand)] hover:bg-[color:var(--color-brand-700)] text-white rounded-full h-11 gap-2 font-medium
                     md:opacity-0 md:group-hover:opacity-100 transition-all duration-200"
          >
            <ShoppingCart className="w-4 h-4" />
            Thêm vào giỏ
          </Button>
        </div>
      </div>
    </Link>
  );
}
