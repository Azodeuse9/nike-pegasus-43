"use client";

import { useState } from "react";
import { inventory, SizeFormat } from "@/data/inventory";
import SizeTile from "@/components/SizeTile";
import SizeFormatSwitcher from "@/components/SizeFormatSwitcher";
import SizeGuideModal from "@/components/SizeGuideModal";

interface SizeSelectorProps {
  selectedSku: string | null;
  onSelectSku: (sku: string) => void;
  format: SizeFormat;
  onFormatChange: (format: SizeFormat) => void;
}

export default function SizeSelector({
  selectedSku,
  onSelectSku,
  format,
  onFormatChange,
}: SizeSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Initial 8 sizes: exactly display_order 8 through 15
  const initialVariants = inventory.filter(
    (v) => v.display_order >= 8 && v.display_order <= 15
  );

  const displayedVariants = isExpanded ? inventory : initialVariants;

  return (
    <section aria-label="Shoe size selection" className="w-full max-w-[430px] mx-auto mt-6">
      {/* Header: Select Size + Size Guide Link */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-[#111111]">Select Size</h2>
          <span className="text-xs text-[#707070] font-normal">
            ({format === "EU" ? "EU sizing" : format === "US_MEN" ? "US Men" : "US Women"})
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsGuideOpen(true)}
          className="text-xs font-semibold text-[#111111] underline underline-offset-4 hover:text-[#707070] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-black"
          aria-label="Open size guide"
        >
          Size Guide
        </button>
      </div>

      {/* Sizing Format Switcher: EU | US Men | US Women */}
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-xs font-medium text-[#707070]">Sizing format</span>
        <SizeFormatSwitcher
          currentFormat={format}
          onFormatChange={onFormatChange}
        />
      </div>

      {/* 4-Column Grid on Mobile with 8px gap */}
      <div
        role="radiogroup"
        aria-label={`Select Nike Pegasus 43 size in ${format} format`}
        data-testid="size-grid"
        className="grid grid-cols-4 gap-2 transition-all duration-300"
      >
        {displayedVariants.map((variant) => (
          <SizeTile
            key={variant.sku}
            variant={variant}
            format={format}
            isSelected={selectedSku === variant.sku}
            onSelect={onSelectSku}
          />
        ))}
      </div>

      {/* View All Sizes (26) Toggle */}
      <div className="mt-3.5 flex flex-col items-center">
        <button
          type="button"
          data-testid="toggle-all-sizes"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-2.5 px-4 bg-[#F5F5F5] hover:bg-[#E5E5E5] text-xs font-bold text-[#111111] rounded-lg transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-black active:scale-[0.99]"
        >
          <span>
            {isExpanded ? "Show fewer sizes" : `View all sizes (${inventory.length})`}
          </span>
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>

      {/* Minimal Stock Legend */}
      <div
        aria-label="Stock status key"
        className="flex items-center justify-center gap-4 mt-3 text-[11px] text-[#707070]"
      >
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#16803C] inline-block" aria-hidden="true" />
          In Stock
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#B77900] inline-block" aria-hidden="true" />
          Low Stock (&le; 5)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#A3A3A3] inline-block" aria-hidden="true" />
          Sold Out
        </span>
      </div>

      {/* Accessible Size Guide Modal */}
      <SizeGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </section>
  );
}
