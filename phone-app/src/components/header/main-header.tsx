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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Menu, Heart, ShoppingCart, User, ChevronRight } from "lucide-react";
import { CATEGORIES } from "@/lib/catalog-mock";

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
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
        <div className="container mx-auto px-3 py-3 flex items-center gap-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
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

          <Link href="/" className="font-black text-lg md:text-2xl">
            Cellshop
          </Link>
          <div className="hidden md:flex items-center gap-2 max-w-2xl flex-1">
            <Input
              placeholder="Bạn muốn tìm gì hôm nay?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-10"
            />
            <Button className="h-10">Tìm kiếm</Button>
          </div>
          <div className="flex-1 md:hidden" />
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Heart />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Yêu thích</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <ShoppingCart />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Giỏ hàng</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:inline-flex"
                >
                  <User className="mr-2 h-4 w-4" />
                  Đăng nhập
                </Button>
              </TooltipTrigger>
              <TooltipContent>Tài khoản</TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div className="md:hidden container mx-auto px-3 pb-3">
          <div className="flex gap-2">
            <Input
              placeholder="Tìm kiếm sản phẩm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button>Tìm</Button>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}
