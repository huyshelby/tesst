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
import type { Product } from "@/lib/mock";
import { formatVND } from "@/utils/currency";

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
  return (
    <Card className="group h-full hover:shadow-lg transition-shadow rounded-2xl">
      <CardHeader className="space-y-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform"
          />
          {discount > 0 && (
            <Badge className="absolute left-2 top-2 bg-red-600">
              -{discount}%
            </Badge>
          )}
          {product.installment && (
            <Badge variant="secondary" className="absolute right-2 top-2">
              Trả góp 0%
            </Badge>
          )}
        </div>
        <CardTitle className="text-sm line-clamp-2 leading-snug min-h-[2.6rem]">
          {product.name}
        </CardTitle>
        <div className="flex items-center gap-1 text-amber-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.round(product.rating ?? 0)
                  ? "fill-current"
                  : "opacity-30"
              }`}
            />
          ))}
          <span className="ml-1 text-xs text-slate-500">
            ({product.reviews})
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-baseline gap-2">
          <div className="text-lg font-bold text-red-600">
            {formatVND(product.price)}
          </div>
          {product.listPrice && (
            <div className="text-xs text-slate-400 line-through">
              {formatVND(product.listPrice)}
            </div>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {product.badges?.map((b, i) => (
            <Badge
              key={i}
              variant="outline"
              className="rounded-full text-[10px]"
            >
              {b}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex w-full gap-2">
          <Button className="flex-1">Mua ngay</Button>
          <Button variant="secondary" size="icon">
            <Heart />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
