import Link from "next/link";
import { Button } from "@/components/ui/button";
import AppleProductCard from "@/components/product/apple-product-card";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/product-api";

export default function AppleCategorySection({
  title,
  href,
  highlight,
  products = [],
}: {
  title: string;
  href: string;
  highlight?: boolean;
  products: Product[];
}) {

  return (
    <section className="space-y-6 py-8 md:py-12 border-b border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className={`text-3xl md:text-4xl font-bold ${
              highlight ? "text-gray-900" : "text-gray-900"
            }`}
          >
            {title}
          </h2>
        </div>
        <Link
          href={href}
          className="hidden md:flex items-center gap-2 text-[color:var(--color-brand)] hover:text-[color:var(--color-brand-700)] font-semibold text-sm group"
        >
          Xem tất cả
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {loading ? (
          <div className="col-span-full text-center text-gray-500 py-8">
            Đang tải...
          </div>
        ) : (
          items.map((p) => <AppleProductCard key={p.id} product={p} />)
        )}
      </div>

      {/* View All Button - Mobile */}
      <div className="md:hidden flex justify-center pt-4">
        <Button
          asChild
          variant="outline"
          className="rounded-lg border-gray-300 w-full"
        >
          <Link href={href}>Xem tất cả {title}</Link>
        </Button>
      </div>
    </section>
  );
}
