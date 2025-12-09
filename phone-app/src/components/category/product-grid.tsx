import ProductCard from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { filterProducts, SortBy } from "@/lib/category";
import { useSearchParams } from "next/navigation";
import * as React from "react";

export default function ProductGrid({
  category,
}: {
  category: import("@/lib/category").CategoryKey;
}) {
  const params = useSearchParams();
  const page = Number(params.get("page") ?? "1");
  const pageSize = 24;
  const sortBy = (params.get("sort") as SortBy) ?? "popular";

  const list = filterProducts({
    category,
    brands: params.getAll("brand"),
    rams: params.getAll("ram").map(Number),
    storages: params.getAll("storage").map(Number),
    priceId: params.get("price"),
    sortBy,
    q: params.get("q") ?? undefined,
  });

  const start = (page - 1) * pageSize;
  const items = list.slice(start, start + pageSize);
  const pageCount = Math.max(1, Math.ceil(list.length / pageSize));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">{list.length} sản phẩm</div>
        <SortSelector value={sortBy} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {items.map((p) => (
          <ProductCard key={p.id} product={p as any} />
        ))}
      </div>
      <Pagination page={page} pageCount={pageCount} />
    </div>
  );
}

function SortSelector({ value }: { value: SortBy }) {
  const params = useSearchParams();
  const url = new URLSearchParams(params.toString());
  return (
    <div className="flex items-center gap-2 text-sm">
      <span>Sắp xếp:</span>
      {["popular", "priceAsc", "priceDesc", "rating"].map((v) => {
        url.set("sort", v);
        url.delete("page");
        return (
          <a
            key={v}
            href={`?${url.toString()}`}
            className={`px-2 py-1 rounded-md border ${
              value === v ? "bg-slate-900 text-white" : "bg-white"
            }`}
          >
            {label(v as SortBy)}
          </a>
        );
      })}
    </div>
  );
}
function label(v: SortBy) {
  return v === "popular"
    ? "Phổ biến"
    : v === "priceAsc"
    ? "Giá ↑"
    : v === "priceDesc"
    ? "Giá ↓"
    : "Đánh giá";
}

function Pagination({ page, pageCount }: { page: number; pageCount: number }) {
  const params = useSearchParams();
  const mk = (p: number) => {
    const u = new URLSearchParams(params.toString());
    u.set("page", String(p));
    return `?${u.toString()}`;
  };
  return (
    <div className="flex justify-center gap-2">
      <Button variant="outline" asChild disabled={page <= 1}>
        <a href={mk(page - 1)}>Trước</a>
      </Button>
      {Array.from({ length: pageCount })
        .slice(0, 5)
        .map((_, i) => {
          const p = i + 1;
          return (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              asChild
            >
              <a href={mk(p)}>{p}</a>
            </Button>
          );
        })}
      <Button variant="outline" asChild disabled={page >= pageCount}>
        <a href={mk(page + 1)}>Sau</a>
      </Button>
    </div>
  );
}
