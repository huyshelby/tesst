import * as React from "react";
import AppleHeader from "@/components/header/apple-header";
import CategorySectionWrapper from "@/components/home/category-section-wrapper";
import HeroSection from "@/components/home/hero-section";
import NewsSection from "@/components/home/news-section";
import Footer from "@/components/footer";
import BackToTop from "@/components/common/back-to-top";

const categories = [
  { key: "phone", label: "iPhone" },
  { key: "tablet", label: "iPad" },
  { key: "laptop", label: "Mac" },
  { key: "watch", label: "Watch" },
  { key: "accessory", label: "Phụ kiện" },
  { key: "audio", label: "Âm thanh" },
];

// Enable dynamic caching for hero/static content
export const revalidate = 300; // Revalidate every 5 minutes

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <AppleHeader />
        
        {/* Hero Carousel Section */}
        <HeroSection />
        
        {/* Product Categories with React Query */}
        <main className="bg-white">
          <div className="content-container">
            {categories.map((c, i) => (
              <CategorySectionWrapper
                key={c.key}
                categoryKey={c.key}
                label={c.label}
                highlight={i < 3}
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
