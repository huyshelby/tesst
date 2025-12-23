'use client';

import Image from 'next/image';
import { useState, useRef } from 'react';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageVariant } from '@/hooks/use-product-images';

interface ProductImageZoomModalProps {
  isOpen: boolean;
  images: ImageVariant[];
  selectedIndex: number;
  onClose: () => void;
  onSelectImage: (index: number) => void;
}

export function ProductImageZoomModal({
  isOpen,
  images,
  selectedIndex,
  onClose,
  onSelectImage,
}: ProductImageZoomModalProps) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const currentImage = images[selectedIndex];
  const maxZoom = 3;
  const minZoom = 1;

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, maxZoom));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, minZoom));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handlePrev = () => {
    onSelectImage((selectedIndex - 1 + images.length) % images.length);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleNext = () => {
    onSelectImage((selectedIndex + 1) % images.length);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Image Container */}
      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={currentImage.url}
            alt={currentImage.label}
            fill
            className="object-contain cursor-grab active:cursor-grabbing"
            style={{
              transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            }}
            sizes="100vw"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-sm px-4 py-3 rounded-full">
        <button
          onClick={handleZoomOut}
          disabled={zoom <= minZoom}
          className="p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
        >
          <ZoomOut className="w-5 h-5 text-white" />
        </button>

        <span className="text-white text-sm font-medium min-w-[3rem] text-center">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={handleZoomIn}
          disabled={zoom >= maxZoom}
          className="p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
        >
          <ZoomIn className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Navigation */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Image Counter */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white text-sm font-medium bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full">
        {selectedIndex + 1} / {images.length}
      </div>
    </div>
  );
}

