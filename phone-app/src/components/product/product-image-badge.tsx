'use client';

interface ProductImageBadgeProps {
  discount?: number;
  badge?: string;
  storage?: string;
  isNew?: boolean;
}

export function ProductImageBadge({
  discount,
  badge,
  storage,
  isNew,
}: ProductImageBadgeProps) {
  return (
    <>
      {/* Discount Badge - Top Left */}
      {discount && discount > 0 && (
        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm">
          -{discount}%
        </div>
      )}

      {/* New Badge - Top Right */}
      {isNew && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm">
          New
        </div>
      )}

      {/* Storage Badge - Bottom Right */}
      {storage && (
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm">
          {storage}
        </div>
      )}

      {/* Custom Badge - Bottom Left */}
      {badge && (
        <div className="absolute bottom-4 left-4 bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm">
          {badge}
        </div>
      )}
    </>
  );
}

