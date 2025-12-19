"use client";
import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Star, Check, ShoppingCart, CreditCard, Phone } from "lucide-react";
import type { Product } from "@/lib/product-api";
import { formatVND } from "@/utils/currency";
import { addToCart } from "@/lib/cart";

export default function ProductHero({ product }: { product: Product }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [selectedColor, setSelectedColor] = React.useState("#000000");
  const [selectedStorage, setSelectedStorage] = React.useState("256GB");
  const images = [product.image, product.image, product.image]; // Mock multiple images

  const colorOptions = [
    { value: "#000000", name: "Đen" },
    { value: "#4A5568", name: "Xám" },
    { value: "#C0C0C0", name: "Bạc" },
    { value: "#F5F5DC", name: "Vàng" },
  ];

  const storageOptions = ["128GB", "256GB", "512GB", "1TB"];

  const handleAddToCart = () => {
    addToCart({
      product,
      quantity: 1,
      selectedColor,
      selectedStorage,
    });
    router.push("/gio-hang");
  };

  const discount =
    product.listPrice && product.listPrice > product.price
      ? Math.round(
          ((product.listPrice - product.price) / product.listPrice) * 100
        )
      : 0;

  const benefits = [
    "Bảo hành chính hãng 12 tháng",
    "Đổi trả trong 14 ngày",
    "Trả góp 0% lãi suất",
    "Miễn phí vận chuyển toàn quốc",
    "Tặng ốp lưng + dán màn hình",
  ];

  return (
    <section className="bg-white py-6 md:py-10">
      <div className="content-container max-w-[1140px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Left - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain p-8"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                  -{discount}%
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative aspect-square w-20 bg-gray-50 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === i
                      ? "border-[color:var(--color-brand)]"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    className="object-contain p-2"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right - Product Info */}
          <div className="space-y-4">
            {/* Title & Rating */}
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {product.name}
              </h1>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(product.rating ?? 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({product.reviews} đánh giá)
                  </span>
                </div>
              )}

              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                {product.badges?.map((badge, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-1 py-4 border-y border-gray-200">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[color:var(--color-brand)]">
                  {formatVND(product.price)}
                </span>
                {product.listPrice && product.listPrice > product.price && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatVND(product.listPrice)}
                  </span>
                )}
              </div>
              {discount > 0 && (
                <p className="text-sm text-red-600 font-medium">
                  Tiết kiệm {formatVND(product.listPrice! - product.price)}
                </p>
              )}
            </div>

            {/* Color / Storage Options - Mock */}
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  Màu sắc
                </p>
                <div className="flex gap-2">
                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedColor(option.value)}
                      className={`w-10 h-10 rounded-full border-2 transition ${
                        selectedColor === option.value
                          ? "border-[color:var(--color-brand)] ring-2 ring-[color:var(--color-brand)]/30"
                          : "border-gray-300 hover:border-gray-900"
                      }`}
                      style={{ backgroundColor: option.value }}
                      title={option.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  Dung lượng
                </p>
                <div className="flex gap-2">
                  {storageOptions.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedStorage(size)}
                      className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition ${
                        selectedStorage === size
                          ? "border-[color:var(--color-brand)] bg-blue-50 text-[color:var(--color-brand)]"
                          : "border-gray-300 hover:border-[color:var(--color-brand)]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-1.5 py-3">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2 pt-3">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-[color:var(--color-brand)] hover:bg-[color:var(--color-brand-700)] text-white rounded-full h-12 text-base font-semibold"
              >
                Mua ngay
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  className="rounded-full h-12 gap-2 border-gray-300"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Thêm vào giỏ
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full h-12 gap-2 border-gray-300"
                >
                  <CreditCard className="w-5 h-5" />
                  Trả góp 0%
                </Button>
              </div>

              <Button
                variant="ghost"
                className="w-full rounded-full h-12 gap-2 text-[color:var(--color-brand)]"
              >
                <Phone className="w-5 h-5" />
                Gọi tư vấn: 1900 1234
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
