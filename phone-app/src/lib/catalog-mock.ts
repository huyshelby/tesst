export const CATEGORIES = [
  { key: "phone", label: "Điện thoại" },
  { key: "laptop", label: "Laptop" },
  { key: "monitor", label: "Màn hình" },
  { key: "tablet", label: "Máy tính bảng" },
  { key: "audio", label: "Âm thanh" },
  { key: "watch", label: "Đồng hồ" },
  { key: "home", label: "Đồ gia dụng" },
  { key: "tv", label: "TV" },
  { key: "accessory", label: "Phụ kiện" },
] as const;
export type CategoryKey2 = (typeof CATEGORIES)[number]["key"];

export type CatalogProduct = {
  id: string;
  name: string;
  image: string;
  price: number;
  listPrice?: number;
  rating?: number;
  reviews?: number;
  badges?: string[];
  installment?: boolean;
  categoryKey: CategoryKey2;
  brand: string;
  ram?: number;
  storage?: number;
};

const brandPool = {
  phone: ["Apple", "Samsung", "Xiaomi", "OPPO", "vivo"],
  laptop: ["Apple", "Asus", "Acer", "Lenovo", "MSI"],
  monitor: ["LG", "Samsung", "AOC", "Gigabyte"],
  tablet: ["Apple", "Samsung", "Xiaomi", "Lenovo"],
  audio: ["JBL", "Sony", "Sennheiser", "Apple"],
  watch: ["Apple", "Samsung", "Garmin", "Amazfit"],
  home: ["Philips", "Xiaomi", "Sharp"],
  tv: ["Sony", "Samsung", "LG", "TCL"],
  accessory: ["Anker", "UGREEN", "Baseus"],
} as const;

function pick<T>(arr: readonly T[], i: number) {
  return arr[i % arr.length];
}

export const catalogProducts: CatalogProduct[] = Array.from({
  length: 72,
}).flatMap((_, i) => {
  const cats = CATEGORIES.map((c) => c.key);
  const categoryKey = cats[i % cats.length] as CategoryKey2;
  const brand = pick(brandPool[categoryKey] as readonly string[], i);
  const base = 5_000_000 + (i % 10) * 1_200_000;
  return [
    {
      id: `cp${i + 1}`,
      name: `${brand} ${categoryKey.toUpperCase()} ${100 + (i % 9)} – ${
        128 + (i % 3) * 128
      }GB`,
      price: base,
      listPrice: base + 1_000_000,
      rating: 4 + (i % 3) * 0.3,
      reviews: 20 + i * 2,
      image:
        "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=1200&auto=format&fit=crop",
      badges:
        i % 2 === 0 ? ["Trả góp 0%", "Online giá rẻ"] : ["Mua kèm giảm thêm"],
      installment: i % 2 === 0,
      categoryKey,
      brand,
      ram: [4, 6, 8, 12, 16][i % 5],
      storage: [64, 128, 256, 512][i % 4],
    },
  ];
});
export const promoBanners = [
  {
    id: "b1",
    img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1600&auto=format&fit=crop",
    href: "#",
  },
  {
    id: "b2",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop",
    href: "#",
  },
  {
    id: "b3",
    img: "https://images.unsplash.com/photo-1542834369-f10ebf06d3cb?q=80&w=1600&auto=format&fit=crop",
    href: "#",
  },
];
