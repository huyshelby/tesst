"use client";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Menu, ShoppingCart, User, Search, ChevronRight } from "lucide-react";
import { CATEGORIES } from "@/lib/catalog-mock";

const NAV_ITEMS = [
  { label: "iPhone", href: "/phone" },
  { label: "iPad", href: "/tablet" },
  { label: "Mac", href: "/laptop" },
  { label: "Watch", href: "/watch" },
  { label: "Phụ kiện", href: "/accessory" },
  { label: "Âm thanh", href: "/audio" },
  { label: "Camera", href: "/camera" },
  { label: "Gia dụng", href: "/home" },
  { label: "Máy hút", href: "/home" },
];

export default function MainHeader({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (v: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <TooltipProvider>
      <header className="sticky top-0 z-50 bg-neutral-700 text-gray-100">
        {/* Row 1: logos - search - actions */}
        <div className="container mx-auto px-3 py-3 flex items-center gap-3">
          {/* Mobile menu trigger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-gray-100"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Danh mục</SheetTitle>
              </SheetHeader>
              <nav className="mt-4 grid gap-2">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.key}
                    href={`/${c.key}`}
                    className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-slate-100"
                    onClick={() => setOpen(false)}
                  >
                    <span>{c.label}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logos left */}
          <div className="hidden lg:flex items-center gap-4 min-w-[220px]">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-gray-200/20 grid place-items-center text-xs font-bold">
                SD
              </div>
              <div className="text-sm leading-tight">
                <div className="font-semibold">SHOPDUNK</div>
                <div className="text-[10px] opacity-80">
                  Authorized Reseller
                </div>
              </div>
            </Link>
          </div>

          {/* Search center */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Bạn tìm gì..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-10 pl-9 pr-3 rounded-full bg-white text-gray-900 placeholder-gray-400 border-0"
              />
            </div>
          </div>

          {/* Actions right */}
          <div className="flex items-center gap-4">
            <Link
              href="/gio-hang"
              className="flex items-center gap-2 hover:opacity-90"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden md:inline text-sm">Giỏ hàng</span>
            </Link>
            <Link
              href="/account"
              className="flex items-center gap-2 hover:opacity-90"
            >
              <User className="h-5 w-5" />
              <span className="hidden md:inline text-sm">Tài khoản</span>
            </Link>
            <div className="hidden sm:flex items-center gap-2 text-lg">
              <span title="Tiếng Việt">🇻🇳</span>
              <span className="opacity-60">|</span>
              <span title="English">🇺🇸</span>
            </div>
          </div>
        </div>

        {/* Row 2: category bar */}
        <div className="border-t border-neutral-600/60">
          <div className="container mx-auto px-3 py-2 flex items-center gap-4 text-sm">
            <button className="flex items-center gap-2 rounded-md px-3 py-1.5 bg-neutral-600 hover:bg-neutral-500 transition">
              <Menu className="h-4 w-4" />
              <span>Dịch vụ</span>
            </button>
            <nav className="hidden md:flex items-center gap-6">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="opacity-90 hover:opacity-100"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            {/* filler */}
            <div className="md:hidden text-xs opacity-80">Danh mục</div>
          </div>
        </div>

        {/* Mobile search below */}
        <div className="lg:hidden container mx-auto px-3 pb-3 pt-2">
          <div className="flex gap-2">
            <Input
              placeholder="Tìm kiếm sản phẩm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-10 rounded-full bg-white text-gray-900 border-0"
            />
            <Button className="h-10 rounded-full">Tìm</Button>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}
