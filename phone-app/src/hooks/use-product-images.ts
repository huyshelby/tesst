import { useState, useCallback, useMemo } from 'react';

export interface ImageVariant {
  angle: 'front' | 'back' | 'side' | 'camera' | 'lifestyle';
  label: string;
  url: string;
}

export interface ColorVariant {
  value: string;
  name: string;
  images: ImageVariant[];
}

export const useProductImages = (colorVariants: ColorVariant[]) => {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedAngleIndex, setSelectedAngleIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const currentColor = useMemo(
    () => colorVariants[selectedColorIndex],
    [colorVariants, selectedColorIndex]
  );

  const currentImage = useMemo(
    () => currentColor?.images[selectedAngleIndex],
    [currentColor, selectedAngleIndex]
  );

  const handleColorChange = useCallback((index: number) => {
    setSelectedColorIndex(index);
    // Giữ nguyên góc nhìn hiện tại
  }, []);

  const handleAngleChange = useCallback((index: number) => {
    setSelectedAngleIndex(index);
  }, []);

  const handleZoom = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
    setIsZoomed(true);
  }, []);

  const handleZoomOut = useCallback(() => {
    setIsZoomed(false);
  }, []);

  return {
    selectedColorIndex,
    selectedAngleIndex,
    currentColor,
    currentImage,
    isZoomed,
    zoomPosition,
    handleColorChange,
    handleAngleChange,
    handleZoom,
    handleZoomOut,
  };
};

