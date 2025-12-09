"use client";
import * as React from "react";
import PromoCarousel from "@/components/home/promo-carousel";
import FlashSale from "@/components/home/flash-sale";
import CategorySection from "@/components/home/category-section";
import BrandStrip from "@/components/home/brand-strip";
import NewsStrip from "@/components/home/news-strip";
import TopBar from "@/components/header/top-bar";
import MainHeader from "@/components/header/main-header";
import BackToTop from "@/components/common/back-to-top";
import { CATEGORIES } from "@/lib/catalog-mock";
import AccountPage from "@/app/(account)/account/page";
import LoginPage from "@/app/(auth)/login/page";
import RequireAuth from "@/components/require-auth";
import Image from "next/image";

export default function Home() {
  const [q, setQ] = React.useState("");
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
        <TopBar />
        <MainHeader query={q} setQuery={setQ} />

        <section className="container mx-auto px-3 mt-4">
          <PromoCarousel />
        </section>
        {/* slide */}
        <section className="container mx-auto px-3 mt-6">
          <FlashSale />
        </section>

        <main className="container mx-auto px-3 space-y-10 mt-8">
          {CATEGORIES.map((c, i) => (
            <CategorySection
              key={c.key}
              title={c.label}
              href={`/${c.key}`}
              highlight={i < 3}
            />
          ))}
        </main>

        <BrandStrip className="container mx-auto px-3 mt-10" />
        <NewsStrip className="container mx-auto px-3 mt-10" />

        <BackToTop />
      </div>
    </>
  );
}
