import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product/product-card";
import { products } from "@/lib/mock";
import { ChevronRight } from "lucide-react";

export default function CategorySection({
  title,
  href,
  highlight,
}: {
  title: string;
  href: string;
  highlight?: boolean;
}) {
  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2
            className={`text-2xl md:text-3xl font-bold ${
              highlight ? "text-red-600" : "text-slate-900"
            }`}
          >
            {title}
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Deal sốc mỗi ngày – Giá tốt + Quà xịn
          </p>
        </div>
        <Button
          asChild
          variant="ghost"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-2"
        >
          <Link href={href}>
            Xem tất cả
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {products.slice(0, 12).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {/* View More Button */}
      <div className="flex justify-center pt-4">
        <Button
          asChild
          variant="outline"
          className="w-full sm:w-auto px-12 py-2 rounded-lg border-slate-300 hover:bg-slate-50"
        >
          <Link href={href}>Xem thêm {title.toLowerCase()}</Link>
        </Button>
      </div>
    </section>
  );
}
