"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
  bgGradient?: string;
}

const banners: PromoBanner[] = [
  {
    id: "promo1",
    title: "Bắt Trọn Khoảnh Khắc",
    subtitle: "Bùng Chát Sắc Tươi",
    image:
      "https://images.unsplash.com/photo-1511707267537-b85faf00021e?q=80&w=1200&auto=format&fit=crop",
    href: "/phone",
    bgGradient: "from-green-400 to-green-600",
  },
  {
    id: "promo2",
    title: "MacBook Pro",
    subtitle: "Năng Suất Vô Hạn",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
    href: "/laptop",
    bgGradient: "from-blue-400 to-blue-600",
  },
];

export default function PromoBanner() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {banners.map((banner) => (
        <Link key={banner.id} href={banner.href}>
          <div
            className={`relative overflow-hidden rounded-xl h-48 md:h-56 bg-gradient-to-r ${banner.bgGradient} group cursor-pointer`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity">
              <img
                src={banner.image}
                alt={banner.title}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-6 text-white">
              <div>
                <p className="text-sm md:text-base font-semibold opacity-90">
                  {banner.subtitle}
                </p>
                <h3 className="text-xl md:text-3xl font-bold mt-2">
                  {banner.title}
                </h3>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
                <span>Khám phá ngay</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
