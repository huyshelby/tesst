"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Hero banner nền xanh (theo ảnh mẫu)
// Không dùng lib carousel để giữ nhẹ; có thể mở rộng sau.
export default function HeroCarousel() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
      <div className="container mx-auto px-6 py-10 md:py-14 grid md:grid-cols-2 items-center gap-6">
        {/* Left: text */}
        <div className="space-y-3 md:space-y-4">
          <p className="uppercase text-xs tracking-wider/relaxed opacity-90">
            Khuyến mãi mùa lễ
          </p>
          <h1 className="text-2xl md:text-4xl font-black leading-tight">
            Bắt trọn khoảnh khắc – Bùng chất sáng tạo
          </h1>
          <p className="text-sm md:text-base opacity-90">
            Ưu đãi lớn cho điện thoại, máy ảnh, phụ kiện. Giao nhanh 2h – Trả góp 0%.
          </p>
          <div className="flex gap-3 pt-2">
            <Button asChild className="bg-white text-emerald-700 hover:bg-slate-100">
              <Link href="/phone">Mua ngay</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/60 text-white hover:bg-white/10">
              <Link href="#flash-sale">Xem ưu đãi</Link>
            </Button>
          </div>
        </div>

        {/* Right: image */}
        <div className="relative h-44 md:h-72">
          <Image
            src="https://images.unsplash.com/photo-1511707267537-b85faf00021e?q=80&w=1600&auto=format&fit=crop"
            alt="Hero devices"
            fill
            priority
            className="object-cover rounded-xl shadow-2xl"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>

      {/* Decorative circles */}
      <div className="pointer-events-none absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-black/10 blur-2xl" />
    </section>
  );
}

