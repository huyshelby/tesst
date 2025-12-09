import * as React from "react";
import { CATEGORY_KEYS } from "@/lib/category";
import Filters from "@/components/category/filters";
import ProductGrid from "@/components/category/product-grid";

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const cat = (params.category || "phone") as (typeof CATEGORY_KEYS)[number];
  if (!CATEGORY_KEYS.includes(cat)) {
    return (
      <div className="container mx-auto px-3 py-10">
        Danh mục không tồn tại.
      </div>
    );
  }
  return (
    <div className="container mx-auto px-3 py-6 grid grid-cols-1 md:grid-cols-[280px,1fr] gap-4">
      <aside>
        <Filters category={cat} />
      </aside>
      <section>
        <h1 className="text-2xl font-semibold mb-3 capitalize">{cat}</h1>
        <ProductGrid category={cat} />
      </section>
    </div>
  );
}
