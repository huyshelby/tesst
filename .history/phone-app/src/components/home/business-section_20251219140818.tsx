"use client";
import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Users,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { buildImageUrl } from "@/lib/image";

export default function HeroSection() {
  const imagePaths = [
    "/pictures/banner MacBook Pro M5_PC.png",
    "/pictures/banner WatchUltra_PC.png",
    "/pictures/banner iP17 air_PC (2).png",
    "/pictures/banner iP17_PC (2).png",
    "/pictures/banner iP17pro_PC (3).png",
  ];
  const images = imagePaths.map(buildImageUrl);
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const length = images.length;

  React.useEffect(() => {
    if (paused || length === 0) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % length), 4000);
    return () => clearInterval(id);
  }, [paused, length]);

  const prev = () => setIndex((i) => (i - 1 + length) % length);
  const next = () => setIndex((i) => (i + 1) % length);

  return (
    <section className="relative w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black py-16 md:py-24 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="content-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-white">
            <div className="space-y-4">
              <p className="text-sm md:text-base font-semibold text-blue-400 uppercase tracking-wider">
                Giải pháp doanh nghiệp
              </p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Apple cho Doanh Nghiệp
              </h2>
              <p className="text-lg text-gray-300">
                Tăng năng suất, bảo mật và khả năng cộng tác với các giải pháp
                Apple được thiết kế cho doanh nghiệp của bạn.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {[
                { icon: BarChart3, label: "Tăng năng suất lên 40%" },
                { icon: Zap, label: "Triển khai nhanh chóng" },
                { icon: Users, label: "Hỗ trợ 24/7 chuyên dụng" },
              ].map(({ icon: Icon, label }, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-white/5 border border-white/10">
                      <Icon className="h-6 w-6 text-[color:var(--color-brand)]" />
                    </div>
                  </div>
                  <p className="text-gray-200 font-medium">{label}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Button className="rounded-lg bg-[color:var(--color-brand)] hover:bg-[color:var(--color-brand-700)] text-white px-8 py-3 text-base font-semibold h-auto gap-2">
              Liên hệ chúng tôi
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Right - Business slider from /public/pictures */}
          <div className="relative">
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div className="relative aspect-video bg-gray-900/40">
                {/* Slides */}
                <div
                  className="flex h-full transition-transform duration-700 ease-out"
                  style={{
                    transform: `translateX(-${index * 100}%)`,
                  }}
                >
                  {images.map((src, i) => (
                    <div
                      key={i}
                      className="relative min-w-full h-full flex-shrink-0"
                    >
                      <Image
                        src={src}
                        alt={`Business slide ${i + 1}`}
                        fill
                        className="object-cover"
                        priority={i === 0}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  ))}
                </div>

                {/* Controls */}
                <button
                  aria-label="Previous"
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  aria-label="Next"
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      aria-label={`Go to slide ${i + 1}`}
                      onClick={() => setIndex(i)}
                      className={`h-2.5 w-2.5 rounded-full transition-all ${
                        index === i
                          ? "bg-white"
                          : "bg-white/40 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
