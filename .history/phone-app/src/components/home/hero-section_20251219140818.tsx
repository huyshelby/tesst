"use client";
import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildImageUrl } from "@/lib/image";

export default function HeroSection() {
  const imagePaths = [
    "/pictures/banner/banner MacBook Pro M5_PC.png",
    "/pictures/banner/banner WatchUltra_PC.png",
    "/pictures/banner/banner iP17 air_PC (2).png",
    "/pictures/banner/banner iP17_PC (2).png",
    "/pictures/banner/banner iP17pro_PC (3).png",
  ];
  const images = imagePaths.map(buildImageUrl);
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const length = images.length;

  React.useEffect(() => {
    if (paused || length === 0) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % length), 5000);
    return () => clearInterval(id);
  }, [paused, length]);

  const prev = () => setIndex((i) => (i - 1 + length) % length);
  const next = () => setIndex((i) => (i + 1) % length);

  // Unified handlers for both mouse and touch
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setPaused(true);
  };

  const handleEnd = (clientX: number) => {
    if (!isDragging) return;

    const diff = startX - clientX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        next();
      } else {
        prev();
      }
    }

    setIsDragging(false);
    setPaused(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    handleEnd(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    handleEnd(e.changedTouches[0].clientX);
  };

  return (
    <section
      className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <div
        className="flex h-full w-full transition-transform duration-700 ease-in-out cursor-grab active:cursor-grabbing"
        style={{
          transform: `translateX(-${index * 100}%)`,
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((src, i) => (
          <div key={i} className="relative min-w-full h-full flex-shrink-0">
            <Image
              src={src}
              alt={`Hero banner ${i + 1}`}
              fill
              className="object-cover pointer-events-none"
              priority={i === 0}
              sizes="100vw"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        aria-label="Previous slide"
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        aria-label="Next slide"
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-0 right-0 z-10 flex items-center justify-center gap-2.5">
        {images.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`transition-all duration-300 rounded-full ${
              index === i
                ? "w-8 h-3 bg-white"
                : "w-3 h-3 bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
