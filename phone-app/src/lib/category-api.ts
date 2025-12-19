import { fetchApi } from "./api";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  icon?: string | null;
  parentId?: string | null;
  displayOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  children?: Category[];
};

export async function fetchCategories(params?: {
  parentId?: string | null;
  isActive?: boolean;
}): Promise<Category[]> {
  const query = new URLSearchParams();
  if (params) {
    if (params.parentId === null) query.set("parentId", "null");
    else if (typeof params.parentId === "string")
      query.set("parentId", params.parentId);
    if (typeof params.isActive === "boolean")
      query.set("isActive", String(params.isActive));
  }
  const res = await fetchApi(`/categories${query.size ? `?${query}` : ""}`);
  if (!res.ok) throw new Error("Không thể tải danh mục");
  return res.json();
}

export async function fetchCategoryTree(): Promise<Category[]> {
  const res = await fetchApi(`/categories/tree`);
  if (!res.ok) throw new Error("Không thể tải cây danh mục");
  return res.json();
}

export async function fetchCategoryBySlug(slug: string): Promise<Category> {
  const res = await fetchApi(`/categories/slug/${slug}`);
  if (!res.ok) throw new Error("Không tìm thấy danh mục");
  return res.json();
}

