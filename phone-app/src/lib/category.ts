import {
  catalogProducts,
  CATEGORIES,
  type CategoryKey2,
} from "@/lib/catalog-mock";
export const CATEGORY_KEYS = CATEGORIES.map((c) => c.key);
export type CategoryKey = CategoryKey2;
export const FILTERS = {
  brand: (cat: CategoryKey) =>
    Array.from(
      new Set(
        catalogProducts.filter((p) => p.categoryKey === cat).map((p) => p.brand)
      )
    ).sort(),
  ram: [4, 6, 8, 12, 16],
  storage: [64, 128, 256, 512],
  priceRange: [
    { id: "p1", label: "Dưới 5 triệu", min: 0, max: 5_000_000 },
    { id: "p2", label: "5–10 triệu", min: 5_000_000, max: 10_000_000 },
    { id: "p3", label: "10–20 triệu", min: 10_000_000, max: 20_000_000 },
    {
      id: "p4",
      label: "Trên 20 triệu",
      min: 20_000_000,
      max: Number.MAX_SAFE_INTEGER,
    },
  ],
} as const;

export type SortBy = "popular" | "priceAsc" | "priceDesc" | "rating";

export function filterProducts(params: {
  category: CategoryKey;
  brands?: string[];
  rams?: number[];
  storages?: number[];
  priceId?: string | null;
  sortBy?: SortBy;
  q?: string;
}) {
  const { category, brands, rams, storages, priceId, sortBy, q } = params;
  const range = FILTERS.priceRange.find((p) => p.id === (priceId ?? undefined));
  let list = catalogProducts.filter((p) => p.categoryKey === category);
  if (q)
    list = list.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  if (brands && brands.length)
    list = list.filter((p) => brands.includes(p.brand));
  if (rams && rams.length)
    list = list.filter((p) => p.ram && rams.includes(p.ram));
  if (storages && storages.length)
    list = list.filter((p) => p.storage && storages.includes(p.storage));
  if (range)
    list = list.filter((p) => p.price >= range.min && p.price < range.max);
  switch (sortBy) {
    case "priceAsc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "priceDesc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      break;
    default:
      break;
  }
  return list;
}
