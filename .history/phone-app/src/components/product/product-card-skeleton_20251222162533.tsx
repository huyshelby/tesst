import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm">
      {/* Image Skeleton */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 p-6 md:p-8">
        <Skeleton className="w-full h-full rounded-lg" />
      </div>

      {/* Content Skeleton */}
      <div className="p-4 md:p-5 space-y-3">
        {/* Product Name */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Pricing */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>

        {/* Button */}
        <Skeleton className="h-11 w-full rounded-full" />
      </div>
    </div>
  );
}

export function CategorySectionSkeleton() {
  return (
    <section className="space-y-6 py-8 md:py-12 border-b border-gray-200">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-6 w-32 hidden md:block" />
      </div>

      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
