"use client";

import { ProductVariant } from "@/data/inventory";

interface SizeTileProps {
  variant: ProductVariant;
  isSelected: boolean;
  onSelect: (sku: string) => void;
}

export default function SizeTile({ variant, isSelected, onSelect }: SizeTileProps) {
  const isSoldOut = variant.stock_status === "sold_out";
  const isLowStock = variant.stock_status === "low_stock";

  // Build accessible label
  const accessibleLabel = [
    `US Men ${variant.size_us_men}, US Women ${variant.size_us_women}, EU ${variant.size_eu}`,
    isSoldOut
      ? "Sold out"
      : isLowStock
      ? `Low stock, only ${variant.stock_quantity} left`
      : "In stock",
    isSelected ? "Selected" : "",
  ]
    .filter(Boolean)
    .join(" - ");

  // Dynamic visual state classes while keeping geometry strictly identical
  let stateClasses = "bg-white border-neutral-300 text-neutral-900 hover:border-neutral-900 cursor-pointer";

  if (isSoldOut) {
    stateClasses = "bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed opacity-65";
  } else if (isSelected) {
    stateClasses = "bg-black border-black text-white ring-2 ring-black ring-offset-1 cursor-pointer";
  } else if (isLowStock) {
    stateClasses = "bg-amber-50/50 border-amber-400 text-neutral-900 hover:border-amber-500 cursor-pointer";
  }

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      aria-label={accessibleLabel}
      aria-disabled={isSoldOut}
      disabled={isSoldOut}
      tabIndex={isSoldOut ? -1 : 0}
      data-testid={`size-option-${variant.sku}`}
      onClick={() => {
        if (!isSoldOut) {
          onSelect(variant.sku);
        }
      }}
      className={`w-full h-[72px] rounded-lg border-2 p-1.5 flex flex-col justify-between items-center text-center transition-colors box-border focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${stateClasses}`}
    >
      {/* Top line: US Men & Women sizes */}
      <span
        className={`text-[12px] font-bold leading-tight tracking-tight ${
          isSelected
            ? "text-white"
            : isSoldOut
            ? "text-neutral-400 line-through decoration-neutral-400"
            : "text-neutral-900"
        }`}
      >
        M {variant.size_us_men} / W {variant.size_us_women}
      </span>

      {/* Middle line: EU size */}
      <span
        className={`text-[11px] font-medium leading-none ${
          isSelected
            ? "text-neutral-300"
            : isSoldOut
            ? "text-neutral-400"
            : "text-neutral-500"
        }`}
      >
        EU {variant.size_eu}
      </span>

      {/* Bottom line: Stock status indicator badge (fixed 14px height for layout stability) */}
      <div className="h-[14px] flex items-center justify-center">
        {isSoldOut ? (
          <span className="text-[9px] font-semibold uppercase tracking-wider text-neutral-400">
            Sold Out
          </span>
        ) : isLowStock ? (
          <span
            className={`text-[9px] font-semibold tracking-tight ${
              isSelected ? "text-amber-300" : "text-amber-700"
            }`}
          >
            Only {variant.stock_quantity} left
          </span>
        ) : (
          <span
            className={`text-[9px] font-medium tracking-tight ${
              isSelected ? "text-neutral-300" : "text-emerald-700"
            }`}
          >
            In Stock
          </span>
        )}
      </div>
    </button>
  );
}
