'use client';

import { useState, useMemo } from 'react';
import { ProductImageGallery } from './product-image-gallery';
import { ProductImageThumbnails } from './product-image-thumbnails';
import { ProductImageZoomModal } from './product-image-zoom-modal';
import { ColorVariant } from '@/hooks/use-product-images';

interface ProductImageSectionProps {
  colorVariants: ColorVariant[];
  selectedColorIndex: number;
  onColorChange: (index: number) => void;
  discount?: number;
  badge?: string;
  storage?: string;
  isNew?: boolean;
}

export function ProductImageSection({
  colorVariants,
  selectedColorIndex,
  onColorChange,
  discount,
  badge,
  storage,
  isNew,
}: ProductImageSectionProps) {
  const [selectedAngleIndex, setSelectedAngleIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const currentColor = useMemo(
    () => colorVariants[selectedColorIndex],
    [colorVariants, selectedColorIndex]
  );

  const currentImages = useMemo(
    () => currentColor?.images || [],
    [currentColor]
  );

  // Khi đổi màu, giữ nguyên góc nhìn hiện tại
  const handleColorChange = (index: number) => {
    onColorChange(index);
    // selectedAngleIndex giữ nguyên
  };

  return (
    <div className="space-y-6">
      {/* Gallery + Thumbnails */}
      <div className="flex gap-4">
        {/* Thumbnails - Desktop Only */}
        <ProductImageThumbnails
          images={currentImages}
          selectedIndex={selectedAngleIndex}
          onSelect={setSelectedAngleIndex}
        />

        {/* Main Gallery */}
        <div className="flex-1">
          <ProductImageGallery
            images={currentImages}
            selectedIndex={selectedAngleIndex}
            onSelect={setSelectedAngleIndex}
            onZoom={() => setIsZoomOpen(true)}
            discount={discount}
            badge={badge}
            storage={storage}
            isNew={isNew}
          />
        </div>
      </div>

      {/* Color Selector */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-900">Màu sắc</p>
        <div className="flex gap-3 flex-wrap">
          {colorVariants.map((color, index) => (
            <button
              key={color.value}
              onClick={() => handleColorChange(index)}
              className={`w-12 h-12 rounded-full border-2 transition-all ${
                selectedColorIndex === index
                  ? 'border-blue-500 ring-2 ring-blue-500/30 shadow-md'
                  : 'border-gray-300 hover:border-gray-900'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Zoom Modal */}
      <ProductImageZoomModal
        isOpen={isZoomOpen}
        images={currentImages}
        selectedIndex={selectedAngleIndex}
        onClose={() => setIsZoomOpen(false)}
        onSelectImage={setSelectedAngleIndex}
      />
    </div>
  );
}

