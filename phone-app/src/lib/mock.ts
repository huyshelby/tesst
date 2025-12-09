export type Product = {
  id: string;
  name: string;
  price: number;
  listPrice?: number;
  rating?: number;
  reviews?: number;
  image: string;
  badges?: string[];
  installment?: boolean;
  brand?: string; // new
};

// In mock data generator:
export const products: Product[] = Array.from({ length: 18 }).map((_, i) => ({
  id: `p${i + 1}`,
  name: `Sản phẩm ${i + 1} – 128GB`,
  price: 9990000 - i * 200000,
  listPrice: 11990000 - i * 150000,
  rating: 4 + (i % 3) * 0.3,
  reviews: 20 + i * 3,
  image:
    "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=1200&auto=format&fit=crop",
  badges: i % 2 === 0 ? ["Trả góp 0%", "Online giá rẻ"] : ["Mua kèm giảm thêm"],
  installment: i % 2 === 0,
  brand: i % 3 === 0 ? "Apple" : i % 3 === 1 ? "Samsung" : "Xiaomi",
}));
