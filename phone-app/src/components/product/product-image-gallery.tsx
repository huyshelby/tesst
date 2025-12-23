'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { ImageVariant } from '@/hooks/use-product-images';
import { ProductImageBadge } from './product-image-badge';

interface ProductImageGalleryProps {
  images: ImageVariant[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onZoom?: () => void;
  discount?: number;
  badge?: string;
  storage?: string;
  isNew?: boolean;
}

export function ProductImageGallery({
  images,
  selectedIndex,
  onSelect,
  onZoom,
  discount,
  badge,
  storage,
  isNew,
}: ProductImageGalleryProps) {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePrev = () => {
    onSelect((selectedIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    onSelect((selectedIndex + 1) % images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);
    if (touchStart - touchEnd > 50) handleNext();
    if (touchEnd - touchStart > 50) handlePrev();
  };

  const currentImage = images[selectedIndex];

  return (
    <div className="space-y-4">
      {/* Main Image Container */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden group cursor-zoom-in"
        onClick={onZoom}
      >
        <Image
          src={currentImage.url}
          alt={currentImage.label}
          fill
          className="object-contain p-8 transition-transform duration-300 group-hover:scale-105"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        {/* Badges */}
        <ProductImageBadge
          discount={discount}
          badge={badge}
          storage={storage}
          isNew={isNew}
        />

        {/* Zoom Hint - Desktop */}
        <div className="absolute bottom-4 right-4 hidden lg:flex items-center gap-2 bg-black/60 text-white px-3 py-2 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-4 h-4" />
          Click để phóng to
        </div>

        {/* Navigation Arrows - Desktop */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center w-10 h-10 bg-white/80 hover:bg-white rounded-full transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center w-10 h-10 bg-white/80 hover:bg-white rounded-full transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Mobile Swipe Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 lg:hidden text-white text-xs font-medium bg-black/60 px-3 py-1.5 rounded-full">
          Vuốt để xem
        </div>
      </div>

      {/* Angle Indicators - Mobile Dots */}
      <div className="flex lg:hidden justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              selectedIndex === index
                ? 'bg-blue-500 w-6'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Angle Labels - Mobile */}
      <div className="lg:hidden text-center">
        <p className="text-sm font-medium text-gray-700">
          {currentImage.label}
        </p>
      </div>
    </div>
  );
}

