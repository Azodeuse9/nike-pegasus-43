"use client";

import { ProductVariant, SizeFormat, getFormattedSize } from "@/data/inventory";

interface SizeTileProps {
  variant: ProductVariant;
  format: SizeFormat;
  isSelected: boolean;
  onSelect: (sku: string) => void;
}

export default function SizeTile({
  variant,
  format,
  isSelected,
  onSelect,
}: SizeTileProps) {
  const isSoldOut = variant.stock_status === "sold_out";
  const isLowStock = variant.stock_status === "low_stock";
  const formattedSize = getFormattedSize(variant, format);

  // Dynamic accessible label
  const accessibleLabel = [
    `Size ${formattedSize} (${format === "EU" ? "EU" : format === "US_MEN" ? "US Men" : "US Women"})`,
    `Full sizing: EU ${variant.size_eu}, US Men ${variant.size_us_men}, US Women ${variant.size_us_women}`,
    isSoldOut
      ? "Sold out"
      : isLowStock
      ? `Low stock, only ${variant.stock_quantity} left`
      : "In stock",
    isSelected ? "Selected" : "",
  ]
    .filter(Boolean)
    .join(" - ");

  // State-driven styling with stable 66px height and 8px border radius
  let stateClasses = "bg-white border-[#E5E5E5] text-[#111111] hover:border-[#111111] cursor-pointer";

  if (isSoldOut) {
    stateClasses = "bg-[#F5F5F5] border-transparent text-[#A3A3A3] cursor-not-allowed select-none";
  } else if (isSelected) {
    stateClasses = "bg-[#111111] border-[#111111] text-white cursor-pointer shadow-sm";
  } else if (isLowStock) {
    stateClasses = "bg-white border-[#E5E5E5] text-[#111111] hover:border-[#B77900] cursor-pointer";
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
      className={`w-full h-[66px] rounded-lg border p-2 flex flex-col items-center justify-between transition-all duration-150 box-border relative focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${stateClasses}`}
    >
      {/* Top right subtle availability indicator dot */}
      <div className="w-full flex items-center justify-end h-2">
        {isSoldOut ? (
          <span className="w-1.5 h-1.5 rounded-full bg-[#A3A3A3]" aria-hidden="true" />
        ) : isLowStock ? (
          <span
            className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-[#F59E0B]" : "bg-[#B77900]"}`}
            aria-hidden="true"
          />
        ) : (
          <span
            className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-emerald-400" : "bg-[#16803C]"}`}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Main size number: largest element */}
      <span
        className={`text-base font-bold leading-none tracking-tight ${
          isSelected
            ? "text-white"
            : isSoldOut
            ? "text-[#A3A3A3] line-through decoration-[#A3A3A3]"
            : "text-[#111111]"
        }`}
      >
        {formattedSize}
      </span>

      {/* Bottom minimal indicator label */}
      <div className="h-3 flex items-center justify-center">
        {isSoldOut ? (
          <span className="text-[9px] font-medium text-[#A3A3A3] tracking-tight">
            Sold out
          </span>
        ) : isLowStock ? (
          <span
            className={`text-[9px] font-semibold tracking-tight ${
              isSelected ? "text-amber-300" : "text-[#B77900]"
            }`}
          >
            {variant.stock_quantity} left
          </span>
        ) : (
          <span
            className={`text-[9px] font-normal tracking-tight ${
              isSelected ? "text-neutral-300" : "text-[#707070]"
            }`}
          >
            {format === "EU" ? "EU" : format === "US_MEN" ? "US M" : "US W"}
          </span>
        )}
      </div>
    </button>
  );
}
