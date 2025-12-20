import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Heart } from "lucide-react";
import type { Product } from "@/lib/product-api";
import { formatVND } from "@/utils/currency";
import { formatImageUrl } from "@/lib/utils";

export default function ProductCard({
  product,
  compact,
}: {
  product: Product;
  compact?: boolean;
}) {
  const discount =
    product.listPrice && product.listPrice > product.price
      ? Math.round(
          ((product.listPrice - product.price) / product.listPrice) * 100
        )
      : 0;

  // Status badge styling based on badge type
  const getStatusBadgeStyle = (badge: string) => {
    if (badge.includes("Giá dự kiến")) return "bg-blue-100 text-blue-800";
    if (badge.includes("Còn hàng") || badge.includes("Online"))
      return "bg-green-100 text-green-800";
    if (badge.includes("Trả góp")) return "bg-cyan-100 text-cyan-800";
    if (badge.includes("giảm")) return "bg-orange-100 text-orange-800";
    return "bg-slate-100 text-slate-800";
  };

  return (
    <Card className="group h-full hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden border border-slate-200">
      <CardHeader className="space-y-2 p-3">
        {/* Image Container */}
        <div className="relative aspect-[1/1] overflow-hidden rounded-lg bg-slate-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
          />
          {/* Discount Badge - Top Left */}
          {discount > 0 && (
            <div className="absolute left-2 top-2 bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm">
              -{discount}%
            </div>
          )}
          {/* Status badges - Top Right */}
          <div className="absolute right-2 top-2 flex flex-col gap-1">
            {product.badges?.slice(0, 2).map((b, i) => (
              <Badge
                key={i}
                className={`text-[10px] font-semibold ${getStatusBadgeStyle(
                  b
                )}`}
              >
                {b.substring(0, 20)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Product Title */}
        <CardTitle className="text-xs sm:text-sm line-clamp-2 leading-snug min-h-[2.2rem] font-semibold text-slate-900">
          {product.name}
        </CardTitle>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.round(product.rating ?? 0)
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500">({product.reviews})</span>
        </div>
      </CardHeader>

      {/* Price Section */}
      <CardContent className="p-3 pt-0">
        <div className="space-y-2">
          {/* Main Price */}
          <div className="flex items-baseline gap-2">
            <div className="text-base sm:text-lg font-bold text-red-600">
              {formatVND(product.price)}
            </div>
            {product.listPrice && (
              <div className="text-xs text-slate-400 line-through">
                {formatVND(product.listPrice)}
              </div>
            )}
          </div>

          {/* Additional Status Badges */}
          {product.badges && product.badges.length > 2 && (
            <div className="flex flex-wrap gap-1">
              {product.badges.slice(2).map((b, i) => (
                <Badge
                  key={i}
                  className={`text-[9px] font-medium ${getStatusBadgeStyle(b)}`}
                >
                  {b.substring(0, 16)}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      {/* Action Buttons */}
      <CardFooter className="p-3 pt-0 gap-2">
        <Button className="flex-1 h-9 text-sm rounded-lg bg-red-600 hover:bg-red-700">
          Mua ngay
        </Button>
        <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg">
          <Heart className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
