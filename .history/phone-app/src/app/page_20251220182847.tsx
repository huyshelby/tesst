import * as React from "react";
import AppleHeader from "@/components/header/apple-header";
import AppleCategorySection from "@/components/home/apple-category-section";
import HeroSection from "@/components/home/hero-section";
import NewsSection from "@/components/home/news-section";
import Footer from "@/components/footer";
import BackToTop from "@/components/common/back-to-top";
import { fetchProducts, type Product } from "@/lib/product-api";

const categories = [
  { key: "phone", label: "iPhone" },
  { key: "tablet", label: "iPad" },
  { key: "laptop", label: "Mac" },
  { key: "watch", label: "Watch" },
  { key: "accessory", label: "Phụ kiện" },
  { key: "audio", label: "Âm thanh" },
];

export default async function Home() {

  // Fetch data for all categories in parallel
  const categoryProductsData = await Promise.all(
    categories.map((category) =>
      fetchProducts({
        categorySlug: category.key,
        limit: 10,
        sortBy: "createdAt",
        order: "desc",
      })
    )
  );

  const categoryProducts = categories.map((category, index) => ({
    ...category,
    products: categoryProductsData[index].products,
  }));

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <AppleHeader />
        {/* Hero Carousel Section */}
        <HeroSection />
        {/* Product Categories */}
        <main className="bg-white">
          <div className="content-container">
            {categoryProducts.map((c, i) => (
              <AppleCategorySection
                key={c.key}
                title={c.label}
                href={`/${c.key}`}
                highlight={i < 3}
                products={c.products}
              />
            ))}
          </div>
        </main>

        {/* News Section */}
        <NewsSection />

        {/* Back to Top */}
        <BackToTop />

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
