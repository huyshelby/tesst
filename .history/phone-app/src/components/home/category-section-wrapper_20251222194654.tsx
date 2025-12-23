'use client';

import AppleCategorySection from './apple-category-section';
import { useProducts } from '@/hooks/use-products';
import { Skeleton } from '@/components/ui/skeleton';

interface CategorySectionWrapperProps {
  categoryKey: string;
  label: string;
  highlight?: boolean;
}

export default function CategorySectionWrapper({
  categoryKey,
  label,
  highlight,
}: CategorySectionWrapperProps) {
  const { data, isLoading } = useProducts({
    categorySlug: categoryKey,
    limit: 6, // Giảm từ 10 xuống 6 để load nhanh hơn
    sortBy: 'createdAt',
    order: 'desc',
  });

  if (isLoading) {
    return (
      <section className="space-y-6 py-8 md:py-12 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <AppleCategorySection
      title={label}
      href={`/${categoryKey}`}
      highlight={highlight}
      products={data?.products || []}
    />
  );
}
