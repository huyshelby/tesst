"use client";
import * as React from "react";
import AppleHeader from "@/components/header/apple-header";

import AppleCategorySection from "@/components/home/apple-category-section";
import HeroSection from "@/components/home/hero-section";
import NewsSection from "@/components/home/news-section";
import Footer from "@/components/footer";
import BackToTop from "@/components/common/back-to-top";

export default function Home() {
  const [q, setQ] = React.useState("");

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <AppleHeader query={q} setQuery={setQ} />
        {/* Hero Carousel Section */}
        <HeroSection />
        {/* Product Categories */}
        <main className="bg-white">
          <div className="content-container">
            {[
              { key: "phone", label: "iPhone" },
              { key: "tablet", label: "iPad" },
              { key: "laptop", label: "Mac" },
              { key: "watch", label: "Watch" },
              { key: "accessory", label: "Phụ kiện" },
              { key: "audio", label: "Âm thanh" },
            ].map((c, i) => (
              <AppleCategorySection
                key={c.key}
                title={c.label}
                href={`/${c.key}`}
                highlight={i < 3}
                categorySlug={c.key}
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
