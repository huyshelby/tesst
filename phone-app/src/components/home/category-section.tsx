import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product/product-card";
import { products } from "@/lib/mock";
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
    <section>
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2
            className={`text-xl md:text-2xl font-semibold ${
              highlight ? "text-red-600" : ""
            }`}
          >
            {title}
          </h2>
          <p className="text-sm text-slate-500">
            Deal sốc mỗi ngày – Giá tốt + Quà xịn
          </p>
        </div>
        <Button asChild variant="link" className="text-red-600">
          <Link href={href}>Xem tất cả</Link>
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {products.slice(0, 12).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
