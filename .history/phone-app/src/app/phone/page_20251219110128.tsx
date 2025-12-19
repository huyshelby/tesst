"use client";
import * as React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
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
  title: "iPhone",
  description:
    "Dòng smartphone đột phá với hiệu năng đỉnh cao và camera chuyên nghiệp",
  filters: ["Tất cả", "iPhone 17", "iPhone Air", "iPhone 16 Pro"],
  categorySlug: "phone" as const,
};

export default function PhonePage() {
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
        const sortBy =
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
          categorySlug: categoryConfig.categorySlug,
          brand: brands.length === 1 ? brands[0] : undefined,
          brands: brands.length > 1 ? brands : (undefined as any), // backward compat (ignored by client)
          ram: rams.length ? rams : undefined,
          storage: storages.length ? storages : undefined,
          minPrice: priceRange?.min,
          maxPrice: priceRange?.max,
          search: q,
          sortBy,
          order,
          page,
          limit: 40,
        } as any);
        setItems(res.products);
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

  // Apply filter
  let filteredProducts = items;
  if (selectedFilter !== "Tất cả") {
    filteredProducts = items.filter((p) =>
      p.name
        .toLowerCase()
        .includes(selectedFilter.toLowerCase().replace(" ", "-"))
    );
  }

  // Apply search query (nếu có)
  if (query) {
    filteredProducts = filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Apply sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0; // popular - giữ nguyên thứ tự từ API
  });

  return (
    <>
      <AppleHeader query={query} setQuery={setQuery} />

      <main className="bg-gray-50 min-h-screen">
        {/* Category Header */}
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

        {/* Sticky Filter Bar */}
        <div className="sticky top-16 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="content-container max-w-[1280px] py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Filter Pills */}
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

              {/* Sort Dropdown */}
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

        {/* Product Grid with Sidebar Filters */}
        <div className="content-container max-w-[1280px] py-8">
          <div className="grid grid-cols-12 gap-6">
            <aside className="hidden md:block md:col-span-3 lg:col-span-3">
              <Filters category={"phone" as CategoryKey} />
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
                  {/* Empty State */}
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

        {/* SEO Content */}
        <div className="bg-white border-t border-gray-200">
          <div className="content-container max-w-[1280px] py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Về {categoryConfig.title}
            </h2>
            <div className="prose prose-gray max-w-none text-gray-600">
              <p>
                {categoryConfig.title} là dòng smartphone cao cấp của Apple,
                mang đến hiệu năng vượt trội với chip xử lý mạnh mẽ, hệ thống
                camera chuyên nghiệp và thiết kế đẳng cấp. Mỗi thế hệ{" "}
                {categoryConfig.title} đều đại diện cho đỉnh cao của công nghệ
                di động, với các tính năng tiên tiến và trải nghiệm người dùng
                hoàn hảo.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
