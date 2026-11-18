"use client";

import { inventory } from "@/data/inventory";
import SizeTile from "@/components/SizeTile";

interface SizeSelectorProps {
  selectedSku: string | null;
  onSelectSku: (sku: string) => void;
}

export default function SizeSelector({ selectedSku, onSelectSku }: SizeSelectorProps) {
  return (
    <section aria-label="Size selection" className="w-full max-w-[343px] mx-auto mt-4">
      {/* Heading area: 48px reserved height */}
      <div className="h-[48px] flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-neutral-900 leading-tight">
            Select Size
          </h2>
          <p className="text-[11px] text-neutral-500">
            Unisex sizing &bull; 26 variants available
          </p>
        </div>
        <button
          type="button"
          className="text-xs font-semibold text-neutral-700 underline underline-offset-2 hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-black"
          aria-label="View Nike size guide"
          onClick={() => {}}
        >
          Size Guide
        </button>
      </div>

      {/* 3-Column Size Grid: 343px width, 712px height (9 rows × 72px + 8 gaps × 8px) */}
      <div
        role="radiogroup"
        aria-label="Select shoe size"
        data-testid="size-grid"
        className="w-[343px] max-w-full grid grid-cols-3 gap-2"
        style={{ minHeight: "712px" }}
      >
        {inventory.map((variant) => (
          <SizeTile
            key={variant.sku}
            variant={variant}
            isSelected={selectedSku === variant.sku}
            onSelect={onSelectSku}
          />
        ))}
      </div>
    </section>
  );
}
