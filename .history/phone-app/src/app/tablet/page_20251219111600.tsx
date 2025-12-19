"use client";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AppleHeader from "@/components/header/apple-header";
import Footer from "@/components/footer";
import AppleProductCard from "@/components/product/apple-product-card";
import { fetchProducts, type Product } from "@/lib/product-api";
import { useSearchParams } from "next/navigation";
import Filters from "@/components/category/filters";
import { FILTERS, type CategoryKey } from "@/lib/category";

const categoryConfig = {
  title: "iPad",
  description: "Máy tính bảng mạnh mẽ cho sáng tạo và giải trí đỉnh cao",
  filters: ["Tất cả", "iPad Pro", "iPad Air", "iPad"],
  categoryMatch: "ipad",
};

export default function TabletPage() {
  const [query, setQuery] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState("Tất cả");
  const [sortBy, setSortBy] = React.useState("popular");
  const [items, setItems] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const params = useSearchParams();

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const brands = params.getAll("brand");
        const rams = params
          .getAll("ram")
          .map(Number)
          .filter((n) => !isNaN(n));
        const storages = params
          .getAll("storage")
          .map(Number)
          .filter((n) => !isNaN(n));
        const priceId = params.get("price") ?? undefined;
        const priceRange = FILTERS.priceRange.find(
          (p) => p.id === priceId || undefined
        );
        const sort = params.get("sort");
        const sortByParam =
          sort === "priceAsc" || sort === "priceDesc"
            ? ("price" as const)
            : sort === "rating"
            ? ("rating" as const)
            : ("createdAt" as const);
        const order =
          sort === "priceAsc" ? ("asc" as const) : ("desc" as const);
        const q = params.get("q") || undefined;
        const page = Number(params.get("page") || "1");

        const res = await fetchProducts({
          categorySlug: "tablet",
          brand: brands.length === 1 ? brands[0] : undefined,
          brands: brands.length > 1 ? brands : (undefined as any),
          ram: rams.length ? rams : undefined,
          storage: storages.length ? storages : undefined,
          minPrice: priceRange?.min,
          maxPrice: priceRange?.max,
          search: q,
          sortBy: sortByParam,
          order,
          page,
          limit: 40,
        } as any);
        if (mounted) setItems(res.products);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [params]);

  let filteredProducts = items;
  if (selectedFilter !== "Tất cả") {
    filteredProducts = items.filter((p) =>
      p.name.toLowerCase().includes(selectedFilter.toLowerCase())
    );
  }
  if (query) {
    filteredProducts = filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0;
  });

  return (
    <>
      <AppleHeader query={query} setQuery={setQuery} />
      <main className="bg-gray-50 min-h-screen">
        <div className="bg-white border-b border-gray-200">
          <div className="content-container max-w-[1280px] py-8 text-center">
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-3">
              {categoryConfig.title}
            </h1>
            <p className="text-lg text-gray-600">
              {categoryConfig.description}
            </p>
          </div>
        </div>

        <div className="sticky top-16 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="content-container max-w-[1280px] py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto flex-1">
                {categoryConfig.filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                      selectedFilter === filter
                        ? "bg-[color:var(--color-brand)] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] rounded-full border-gray-300">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Phổ biến</SelectItem>
                  <SelectItem value="price-asc">Giá thấp → cao</SelectItem>
                  <SelectItem value="price-desc">Giá cao → thấp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="content-container max-w-[1280px] py-8">
          <div className="grid grid-cols-12 gap-6">
            <aside className="hidden md:block md:col-span-3 lg:col-span-3">
              <Filters category={"tablet" as CategoryKey} />
            </aside>
            <section className="col-span-12 md:col-span-9 lg:col-span-9">
              {loading ? (
                <div className="text-center text-gray-500 py-16">
                  Đang tải...
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {sortedProducts.map((product) => (
                      <AppleProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {sortedProducts.length === 0 && (
                    <div className="text-center py-16">
                      <p className="text-lg text-gray-600">
                        Không tìm thấy sản phẩm phù hợp
                      </p>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
