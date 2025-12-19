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
import { products } from "@/lib/mock";

const categoryConfig = {
  title: "iPhone",
  description:
    "Dòng smartphone đột phá với hiệu năng đỉnh cao và camera chuyên nghiệp",
  filters: ["Tất cả", "iPhone 17", "iPhone Air", "iPhone 16 Pro"],
  categoryMatch: "iphone",
};

export default function PhonePage() {
  const [query, setQuery] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState("Tất cả");
  const [sortBy, setSortBy] = React.useState("popular");

  // Filter products by category
  const categoryProducts = products.filter((p) =>
    p.id.toLowerCase().includes(categoryConfig.categoryMatch)
  );

  // Apply filter
  let filteredProducts = categoryProducts;
  if (selectedFilter !== "Tất cả") {
    filteredProducts = categoryProducts.filter((p) =>
      p.name
        .toLowerCase()
        .includes(selectedFilter.toLowerCase().replace(" ", "-"))
    );
  }

  // Apply sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0; // popular - keep original order
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

        {/* Product Grid */}
        <div className="content-container max-w-[1280px] py-8">
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

          {/* Load More */}
          {sortedProducts.length > 0 && (
            <div className="text-center mt-8">
              <button className="px-8 py-3 bg-white border-2 border-gray-300 rounded-full text-sm font-medium hover:border-[color:var(--color-brand)] transition">
                Xem thêm sản phẩm
              </button>
            </div>
          )}
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
