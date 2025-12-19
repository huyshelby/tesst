import { fetchApi } from "./api";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  listPrice?: number | null;
  image: string;
  images?: string[];
  categoryId: string;
  brand: string;
  stock: number;
  rating?: number | null;
  reviews?: number;
  badges?: string[];
  installment?: boolean;
  isActive?: boolean;
  specs?: Record<string, any> | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductListResponse = {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function fetchProducts(params: {
  categoryId?: string;
  categorySlug?: string;
  brand?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  ram?: number[];
  storage?: number[];
  sortBy?: "price" | "rating" | "createdAt";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}): Promise<ProductListResponse> {
  const query = new URLSearchParams();
  if (params.categoryId) query.set("categoryId", params.categoryId);
  if (params.categorySlug) query.set("categorySlug", params.categorySlug);
  if (params.brand) query.set("brand", params.brand);
  if (params.brands) params.brands.forEach((b) => query.append("brand", b));
  if (params.minPrice != null) query.set("minPrice", String(params.minPrice));
  if (params.maxPrice != null) query.set("maxPrice", String(params.maxPrice));
  if (params.search) query.set("search", params.search);
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.order) query.set("order", params.order);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.ram) params.ram.forEach((v) => query.append("ram", String(v)));
  if (params.storage)
    params.storage.forEach((v) => query.append("storage", String(v)));

  const res = await fetchApi(`/products?${query.toString()}`);
  if (!res.ok) throw new Error("Không thể tải danh sách sản phẩm");
  return res.json();
}

export async function fetchProductById(id: string): Promise<Product> {
  const res = await fetchApi(`/products/${id}`);
  if (!res.ok) throw new Error("Không tìm thấy sản phẩm");
  return res.json();
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  const res = await fetchApi(`/products/slug/${slug}`);
  if (!res.ok) throw new Error("Không tìm thấy sản phẩm");
  return res.json();
}
