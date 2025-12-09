import ProductCard from "@/components/product/product-card";
import type { Product } from "@/lib/mock";
export default function HorizontalProductSlider({
  products,
}: {
  products: Product[];
}) {
  return (
    <div className="relative overflow-x-auto">
      <div className="flex gap-3 w-max snap-x snap-mandatory">
        {products.map((p) => (
          <div key={p.id} className="snap-start shrink-0 w-[220px]">
            <ProductCard product={p} compact />
          </div>
        ))}
      </div>
    </div>
  );
}
