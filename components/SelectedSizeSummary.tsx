"use client";

import { ProductVariant, SizeFormat, getFormattedSize } from "@/data/inventory";

interface SelectedSizeSummaryProps {
  selectedVariant: ProductVariant | undefined;
  format: SizeFormat;
}

export default function SelectedSizeSummary({
  selectedVariant,
  format,
}: SelectedSizeSummaryProps) {
  if (!selectedVariant) {
    return (
      <div
        aria-live="polite"
        className="w-full max-w-[430px] mx-auto mt-4 py-2 px-3.5 bg-[#F5F5F5] rounded-xl text-center text-xs text-[#707070] border border-[#E5E5E5]/60 transition-all"
      >
        <span>Please select a size above to continue</span>
      </div>
    );
  }

  const primarySize = getFormattedSize(selectedVariant, format);
  const formatLabel =
    format === "EU" ? "EU" : format === "US_MEN" ? "US Men" : "US Women";

  const isLowStock = selectedVariant.stock_status === "low_stock";

  return (
    <div
      aria-live="polite"
      className="w-full max-w-[430px] mx-auto mt-4 p-3.5 bg-[#F5F5F5] rounded-xl border border-[#E5E5E5] flex items-center justify-between transition-all animate-fade-in"
    >
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#707070]">
            Selected Size
          </span>
          <span className="text-sm font-black text-[#111111]">
            {formatLabel} {primarySize}
          </span>
        </div>
        <p className="text-[11px] text-[#707070] mt-0.5">
          {format !== "EU" && `EU ${selectedVariant.size_eu} · `}
          {format !== "US_MEN" && `US M ${selectedVariant.size_us_men} · `}
          {format !== "US_WOMEN" && `US W ${selectedVariant.size_us_women}`}
          <span className="ml-1 text-[#A3A3A3] font-mono">({selectedVariant.sku})</span>
        </p>
      </div>

      <div className="text-right">
        {isLowStock ? (
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#B77900] text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B77900]" />
            Only {selectedVariant.stock_quantity} left
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#16803C] text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16803C]" />
            In Stock
          </div>
        )}
      </div>
    </div>
  );
}
