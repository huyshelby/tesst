"use client";
import * as React from "react";
import { useParams } from "next/navigation";
import AppleHeader from "@/components/header/apple-header";
import AppleFooter from "@/components/home/apple-footer";
import ProductHero from "@/components/product/product-hero";
import ProductUpsell from "@/components/product/product-upsell";
import ProductStory from "@/components/product/product-story";
import ProductSpecs from "@/components/product/product-specs";
import ProductReviews from "@/components/product/product-reviews";
import { products } from "@/lib/mock";
import BackToTop from "@/components/common/back-to-top";

export default function ProductDetailPage() {
  const params = useParams();
  const [q, setQ] = React.useState("");
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AppleHeader query={q} setQuery={setQ} />

      {/* Product Hero */}
      <ProductHero product={product} />

      {/* Upsell / Cross-sell */}
      <ProductUpsell />

      {/* Product Story */}
      <ProductStory product={product} />

      {/* Tech Specs */}
      <ProductSpecs product={product} />

      {/* Reviews */}
      <ProductReviews product={product} />

      {/* Footer */}
      <AppleFooter />

      {/* Back to Top */}
      <BackToTop />
    </div>
  );
}
