"use client";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { getCartCount } from "@/lib/cart-api";

const menuItems = [
  { label: "iPhone", href: "/phone" },
  { label: "iPad", href: "/tablet" },
  { label: "Mac", href: "/laptop" },
  { label: "Watch", href: "/watch" },
  { label: "Phụ kiện", href: "/accessory" },
  { label: "Âm thanh", href: "/audio" },
  { label: "Khuyến mãi", href: "/sale" },
];

export default function AppleHeader({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (v: string) => void;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [cartCount, setCartCount] = React.useState(0);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const count = await getCartCount();
      if (mounted) setCartCount(count);
    })();

    const handleCartUpdate = async () => {
      const count = await getCartCount();
      if (mounted) setCartCount(count);
    };

    window.addEventListener("cart-updated", handleCartUpdate);
    return () => {
      mounted = false;
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* Main Header */}
      <div className="content-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="font-black text-xl text-black tracking-tight hover:opacity-70 transition"
          >
            Apple Store
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-gray-700 hover:text-[color:var(--color-brand)] transition font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden sm:flex items-center">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <Search className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Cart */}
            <Link
              href="/gio-hang"
              className="p-2 hover:bg-gray-100 rounded-full transition relative"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 hover:bg-gray-100 rounded-full transition">
                  <User className="w-5 h-5 text-gray-700" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/account">Tài khoản của tôi</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/orders">Đơn hàng</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/login">Đăng nhập</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar Expanded */}
        {searchOpen && (
          <div className="pb-4 hidden sm:block">
            <div className="flex gap-2">
              <Input
                placeholder="Tìm kiếm sản phẩm Apple..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 rounded-full bg-gray-100 border-0 px-4"
              />
              <Button className="rounded-full bg-blue-600 hover:bg-blue-700">
                Tìm
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <nav className="content-container py-4 space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-sm text-gray-700 hover:text-black py-2 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="px-4 pb-4">
            <Input
              placeholder="Tìm kiếm sản phẩm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-full bg-gray-100 border-0"
            />
          </div>
        </div>
      )}
    </header>
  );
}
