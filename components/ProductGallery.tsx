"use client";

import { useState } from "react";

export default function ProductGallery() {
  const [activeSlide, setActiveSlide] = useState(0);

  const views = [
    { label: "Lateral Profile", angle: "Side view showing Pegasus 43 silhouette in Black/White-Volt" },
    { label: "Medial Profile", angle: "Inner arch view with Volt accent detailing" },
    { label: "Outsole Traction", angle: "Waffle-inspired outsole pattern view" },
  ];

  return (
    <section
      aria-label="Product photography gallery"
      className="w-full max-w-[343px] mx-auto pt-2"
    >
      {/* 343px × 343px 1:1 Square Container with explicit reserved dimensions to prevent CLS */}
      <div
        data-testid="product-main-image"
        className="w-[343px] h-[343px] max-w-full aspect-square bg-gradient-to-b from-neutral-100 to-neutral-200/80 rounded-2xl relative overflow-hidden flex flex-col items-center justify-between p-4 border border-neutral-200/60 shadow-inner select-none"
      >
        {/* Placeholder identification badge */}
        <div className="w-full flex items-center justify-between text-[11px] font-semibold tracking-wider text-neutral-500 uppercase">
          <span className="bg-white/80 backdrop-blur px-2.5 py-1 rounded-full border border-neutral-200/80 shadow-sm">
            Product Placeholder
          </span>
          <span className="bg-lime-400/90 text-neutral-900 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight shadow-sm">
            VOLT ACCENT
          </span>
        </div>

        {/* Sneaker Graphic / Silhouette */}
        <div className="relative w-full h-[180px] flex items-center justify-center">
          {/* Subtle glow / drop shadow under shoe */}
          <div className="absolute bottom-2 w-48 h-5 bg-black/15 rounded-full blur-md" />

          {/* Detailed SVG Sneaker Graphic representing Black/White-Volt Pegasus 43 */}
          <svg
            viewBox="0 0 400 200"
            className="w-full h-full max-h-[160px] drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outsole: Volt/Lime traction pods */}
            <path
              d="M60 155 C100 156, 170 156, 220 154 C260 152, 320 155, 345 140 C348 138, 350 134, 344 135 C310 144, 250 142, 210 143 C150 144, 90 146, 60 155 Z"
              fill="#CEFF00"
            />
            {/* Midsole: Sculpted white performance foam */}
            <path
              d="M50 148 C90 150, 160 150, 210 148 C270 146, 330 142, 350 128 C354 125, 348 120, 335 120 C290 122, 240 123, 190 124 C140 125, 80 128, 50 138 C44 140, 44 147, 50 148 Z"
              fill="#FFFFFF"
              stroke="#E5E7EB"
              strokeWidth="1.5"
            />
            {/* Midsole Volt Accent wedge */}
            <path
              d="M170 140 C210 139, 270 137, 310 132 C300 136, 230 142, 170 140 Z"
              fill="#CEFF00"
            />
            {/* Upper: Engineered breathable black mesh */}
            <path
              d="M50 138 C45 130, 60 95, 110 88 C135 84, 160 92, 185 86 C210 80, 230 55, 260 50 C280 47, 295 62, 285 85 C295 90, 325 105, 342 120 C348 125, 340 130, 335 128 C280 122, 230 124, 180 124 C120 125, 75 130, 50 138 Z"
              fill="#18181B"
            />
            {/* Collar & Tongue (Volt interior lining) */}
            <path
              d="M230 55 C245 52, 265 52, 270 65 C265 75, 245 78, 230 80 Z"
              fill="#CEFF00"
            />
            {/* Lacing system & eyelet stays */}
            <path
              d="M185 86 L205 92 M195 80 L218 86 M208 72 L230 78 M220 65 L242 70"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Iconic Nike Swoosh in Crisp White */}
            <path
              d="M315 88 C275 108, 200 122, 140 114 C122 112, 118 108, 126 106 C144 102, 195 96, 230 84 C255 75, 290 62, 315 88 Z"
              fill="#FFFFFF"
            />
            {/* Mini Volt Swoosh accent */}
            <path
              d="M150 118 C175 116, 205 112, 220 106 C210 110, 185 116, 150 118 Z"
              fill="#CEFF00"
            />
          </svg>
        </div>

        {/* Caption & angle info */}
        <div className="w-full text-center pb-1">
          <p className="text-[12px] font-medium text-neutral-700 leading-tight">
            Nike Pegasus 43 · Black/White-Volt
          </p>
          <p className="text-[10px] text-neutral-400 mt-0.5">
            {views[activeSlide].label} &bull; Official photography awaiting launch
          </p>
        </div>
      </div>

      {/* Carousel dots navigation for multi-angle preview */}
      <div
        className="flex items-center justify-center gap-2 mt-2.5 h-4"
        role="tablist"
        aria-label="Gallery slide controls"
      >
        {views.map((view, index) => (
          <button
            key={view.label}
            type="button"
            role="tab"
            aria-selected={activeSlide === index}
            aria-label={`View ${index + 1}: ${view.label}`}
            onClick={() => setActiveSlide(index)}
            className={`transition-all duration-200 rounded-full ${
              activeSlide === index
                ? "w-6 h-2 bg-black"
                : "w-2 h-2 bg-neutral-300 hover:bg-neutral-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
