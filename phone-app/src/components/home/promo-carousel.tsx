"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import HorizontalProductSlider from "@/components/product/horizontal-slider";
import { useCountdown } from "@/hook/use-countdown";
import { products } from "@/lib/mock";

// Khối Flash Sale (đếm ngược) – tên component đồng bộ với import tại app/page.tsx
export default function PromoCarousel() {
  const { display } = useCountdown(3600 * 5 + 42);
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="flex-row items-center justify-between gap-2">
        <div>
          <CardTitle className="text-xl md:text-2xl">Flash Sale</CardTitle>
          <CardDescription>Giờ vàng săn deal – kết thúc sau</CardDescription>
        </div>
        <div className="text-2xl font-mono tabular-nums px-3 py-1 rounded-md bg-slate-900 text-white">
          {display}
        </div>
      </CardHeader>
      <CardContent>
        <HorizontalProductSlider products={products.slice(0, 10)} />
      </CardContent>
    </Card>
  );
}
