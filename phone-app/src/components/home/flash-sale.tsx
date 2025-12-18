// slide chính
import Link from "next/link";
import { promoBanners } from "@/lib/catalog-mock";

// Hiển thị dải banner kéo ngang (khuyến mãi)
export default function FlashSale() {
  return (
    <div className="relative overflow-x-auto snap-x snap-mandatory rounded-2xl shadow-sm bg-white ring-1 ring-slate-100">
      <div className="flex gap-3 w-max p-3">
        {promoBanners.map((b) => (
          <Link key={b.id} href={b.href} className="snap-start shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={b.img}
              alt="promo"
              loading="lazy"
              className="h-44 w-[90vw] md:h-72 md:w-[960px] object-cover rounded-xl"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
