'use client';

import Image from 'next/image';
import { ImageVariant } from '@/hooks/use-product-images';

interface ProductImageThumbnailsProps {
  images: ImageVariant[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function ProductImageThumbnails({
  images,
  selectedIndex,
  onSelect,
}: ProductImageThumbnailsProps) {
  return (
    <div className="hidden lg:flex flex-col gap-3">
      {images.map((image, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={`relative aspect-square w-20 bg-gray-50 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:border-gray-400 ${
            selectedIndex === index
              ? 'border-blue-500 ring-2 ring-blue-500/30 shadow-md'
              : 'border-gray-200'
          }`}
          title={image.label}
        >
          <Image
            src={image.url}
            alt={image.label}
            fill
            className="object-contain p-2"
            sizes="80px"
          />
          {/* Angle Label */}
          <div className="absolute bottom-1 left-1 right-1 text-center">
            <span className="text-xs font-medium text-gray-600 bg-white/80 rounded px-1 py-0.5 inline-block">
              {image.label}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

