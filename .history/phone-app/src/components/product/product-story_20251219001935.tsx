"use client";
import * as React from "react";
import Image from "next/image";
import { Camera, Cpu, Monitor, Battery } from "lucide-react";
import type { Product } from "@/lib/mock";

export default function ProductStory({ product }: { product: Product }) {
  const features = [
    {
      icon: Camera,
      stat: "48MP",
      title: "Camera Pro",
      description: "Hệ thống camera chuyên nghiệp",
    },
    {
      icon: Cpu,
      stat: "M5",
      title: "Chip thế hệ mới",
      description: "Hiệu năng đột phá",
    },
    {
      icon: Monitor,
      stat: "120Hz",
      title: "ProMotion",
      description: "Màn hình siêu mượt",
    },
    {
      icon: Battery,
      stat: "All day",
      title: "Pin trâu",
      description: "Sử dụng cả ngày",
    },
  ];

  return (
    <section className="relative bg-black py-16 md:py-24 text-white overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black pointer-events-none" />

      <div className="content-container max-w-[1140px] space-y-16 md:space-y-24 relative z-10">
        {/* Hero */}
        <div className="text-center space-y-3">
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight">
            {product.name.split(" ")[0]}
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 font-light">
            Thiết kế. Tiên phong. Hoàn hảo.
          </p>
        </div>

        {/* Large Product Image - blend with background */}
        <div
          className="relative w-full max-w-5xl mx-auto"
          style={{ height: "500px" }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain drop-shadow-2xl"
            sizes="(max-width: 1280px) 100vw, 1280px"
            priority
          />
        </div>

        {/* Features Grid - keynote style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto pt-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="text-center space-y-3 group">
                <div className="inline-flex w-14 h-14 rounded-2xl bg-white/5 items-center justify-center mb-2 group-hover:bg-white/10 transition">
                  <Icon className="w-7 h-7 text-white/80" />
                </div>
                <div className="text-5xl md:text-6xl font-semibold tracking-tight bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                  {feature.stat}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-gray-500 font-light">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
