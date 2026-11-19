"use client";

import { useState, useRef, TouchEvent } from "react";
import Image from "next/image";

interface GallerySlide {
  src: string;
  alt: string;
  label: string;
}

const GALLERY_SLIDES: GallerySlide[] = [
  {
    src: "/assets/nike-pegasus-43-1.webp",
    alt: "Nike Pegasus 43 lateral profile view in Black / White showing engineered mesh, responsive midsole and iconic white swoosh",
    label: "Lateral Profile",
  },
  {
    src: "/assets/nike-pegasus-43-5.webp",
    alt: "Nike Pegasus 43 three-quarter pair perspective showing toe box and lacing system",
    label: "Pair Angle",
  },
  {
    src: "/assets/nike-pegasus-43-2.webp",
    alt: "Nike Pegasus 43 medial arch view showing supportive inner midsole cushioning",
    label: "Medial Profile",
  },
  {
    src: "/assets/nike-pegasus-43-3.webp",
    alt: "Nike Pegasus 43 waffle-inspired rubber outsole traction pods in black and white",
    label: "Outsole Traction",
  },
  {
    src: "/assets/nike-pegasus-43-4.webp",
    alt: "Nike Pegasus 43 overhead view showing padded tongue, footbed and structured lacing",
    label: "Top-Down Footbed",
  },
];

export default function ProductGallery() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = GALLERY_SLIDES.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + total) % total);
  };

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      nextSlide();
    } else if (diff < -45) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const activeImage = GALLERY_SLIDES[currentSlide];

  return (
    <>
      <section
        aria-label="Nike Pegasus 43 product photo gallery"
        className="w-full max-w-[430px] mx-auto select-none"
      >
        {/* Main Gallery Card: 18px rounded corners, matching shoe background (#F1F1F1), 1:1 aspect ratio */}
        <div
          data-testid="main-photo"
          style={{ aspectRatio: "1 / 1", backgroundColor: "#F1F1F1" }}
          className="relative w-full aspect-square bg-[#F1F1F1] rounded-[18px] overflow-hidden flex items-center justify-center group"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Backwards-compatibility test attribute */}
          <span data-testid="main-product-image" className="sr-only">
            {activeImage.alt}
          </span>
          <span data-testid="product-main-image" className="sr-only">
            {activeImage.alt}
          </span>

          {/* Top Left: Small NEW Badge */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5">
            <span className="bg-[#111111] text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase shadow-xs">
              New
            </span>
          </div>

          {/* Top Right: Fullscreen Viewer Control */}
          <button
            type="button"
            aria-label="View full screen image"
            onClick={() => setIsFullscreen(true)}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs text-[#111111] hover:bg-white flex items-center justify-center transition-all shadow-xs active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15m11.25-11.25h-4.5m4.5 0v4.5m0-4.5L15 9m4.5 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          </button>

          {/* Full-bleed Shoe Image without inner borders or rectangular drop-shadows */}
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              sizes="(max-width: 430px) 390px, 430px"
              priority={currentSlide === 0}
              className="object-contain select-none"
            />
          </div>

          {/* Previous Slide Button */}
          <button
            type="button"
            aria-label="Previous image"
            onClick={prevSlide}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 backdrop-blur-xs text-[#111111] hover:bg-white flex items-center justify-center shadow-xs transition-opacity opacity-75 hover:opacity-100 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Next Slide Button */}
          <button
            type="button"
            aria-label="Next image"
            onClick={nextSlide}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 backdrop-blur-xs text-[#111111] hover:bg-white flex items-center justify-center shadow-xs transition-opacity opacity-75 hover:opacity-100 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Bottom Right: Image Counter */}
          <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded-full text-[11px] font-semibold text-[#707070] shadow-xs">
            {currentSlide + 1} / {total}
          </div>
        </div>

        {/* Gallery Pagination Dots */}
        <div
          role="tablist"
          aria-label="Product photography thumbnails"
          className="flex items-center justify-center gap-1.5 mt-3 h-3"
        >
          {GALLERY_SLIDES.map((slide, idx) => (
            <button
              key={slide.label}
              type="button"
              role="tab"
              aria-selected={currentSlide === idx}
              aria-label={`View ${slide.label}`}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all duration-200 rounded-full ${
                currentSlide === idx
                  ? "w-6 h-1.5 bg-[#111111]"
                  : "w-1.5 h-1.5 bg-[#E5E5E5] hover:bg-[#A3A3A3]"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Fullscreen Modal View */}
      {isFullscreen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full screen photo viewer"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 animate-fade-in"
          onClick={() => setIsFullscreen(false)}
        >
          <div className="flex items-center justify-between text-white text-sm">
            <span className="font-semibold">{activeImage.label} ({currentSlide + 1} of {total})</span>
            <button
              type="button"
              aria-label="Close full screen"
              onClick={() => setIsFullscreen(false)}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
            >
              &times;
            </button>
          </div>

          <div
            className="relative w-full max-w-2xl h-[70vh] mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-contain"
            />
          </div>

          <div className="flex items-center justify-center gap-4 text-white pb-4">
            <button
              type="button"
              aria-label="Previous full screen photo"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 text-xs font-semibold"
            >
              &larr; Previous
            </button>
            <button
              type="button"
              aria-label="Next full screen photo"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 text-xs font-semibold"
            >
              Next &rarr;
            </button>
          </div>
        </div>
      )}
    </>
  );
}
