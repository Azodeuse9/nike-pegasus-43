"use client";

import { useState } from "react";
import { useBag } from "@/context/BagContext";
import { productInfo, inventory } from "@/data/inventory";

interface AddToBagProps {
  selectedSku: string | null;
  selectedSize: string;
}

export default function AddToBag({ selectedSku, selectedSize }: AddToBagProps) {
  const { addItem } = useBag();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  const selectedVariant = inventory.find((v) => v.sku === selectedSku);
  const isDisabled = !selectedSku || selectedVariant?.stock_status === "sold_out";

  const handleAddToBag = () => {
    if (isDisabled || !selectedSku) return;

    addItem(selectedSku, selectedSize);
    setIsAdded(true);
    setToastMessage(`Added ${selectedSize} (SKU: ${selectedSku}) to Bag`);

    setTimeout(() => {
      setIsAdded(false);
    }, 1200);

    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  return (
    <section aria-label="Purchase action" className="w-full max-w-[343px] mx-auto mt-4 relative">
      {/* Toast confirmation message */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[343px] max-w-[92vw] bg-neutral-900 text-white text-xs font-medium py-3 px-4 rounded-xl shadow-2xl flex items-center gap-2 z-50 animate-fade-in border border-neutral-700"
        >
          <svg className="w-4 h-4 text-lime-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* 343px × 56px Prominent Button */}
      <button
        type="button"
        disabled={isDisabled}
        onClick={handleAddToBag}
        className={`w-full h-[56px] rounded-full text-base font-bold transition-all duration-200 flex items-center justify-center gap-2 select-none box-border focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
          isDisabled
            ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            : isAdded
            ? "bg-lime-500 text-neutral-950 scale-[0.99]"
            : "bg-black text-white hover:bg-neutral-800 active:scale-[0.98]"
        }`}
        aria-label={
          isDisabled
            ? "Add to Bag (Select a size first)"
            : `Add ${productInfo.name} size ${selectedSize} to Bag for $${productInfo.price}`
        }
      >
        {isAdded ? (
          <>
            <svg className="w-5 h-5 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <span>Added to Bag</span>
          </>
        ) : isDisabled ? (
          "Select a Size"
        ) : (
          `Add to Bag — $${productInfo.price}`
        )}
      </button>

      {/* Selected variant details preview */}
      <div className="h-5 mt-1.5 flex items-center justify-center text-[11px] text-neutral-500">
        {selectedVariant ? (
          <span>
            Selected: <strong className="text-neutral-900">{selectedVariant.size_label}</strong> (EU {selectedVariant.size_eu}) &bull; SKU: {selectedVariant.sku}
          </span>
        ) : (
          <span>Please choose an available size above</span>
        )}
      </div>
    </section>
  );
}
