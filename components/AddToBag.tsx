"use client";

import { useState } from "react";
import { useBag } from "@/context/BagContext";
import { ProductVariant, productInfo } from "@/data/inventory";

interface AddToBagProps {
  selectedVariant: ProductVariant | undefined;
}

export default function AddToBag({ selectedVariant }: AddToBagProps) {
  const { addItem, setIsBagOpen } = useBag();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);

  const isDisabled =
    !selectedVariant || selectedVariant.stock_status === "sold_out";

  const handleAdd = () => {
    if (isDisabled || !selectedVariant) return;

    setIsAdding(true);

    addItem({
      sku: selectedVariant.sku,
      productName: productInfo.name,
      sizeLabel: selectedVariant.size_label,
      sizeEu: selectedVariant.size_eu,
      price: productInfo.price,
      image: "/assets/pegasus-lateral.webp",
    });

    setToastMessage(
      `Added ${productInfo.name} (EU ${selectedVariant.size_eu}) to your Bag`
    );
    setShowToast(true);

    setTimeout(() => {
      setIsAdding(false);
    }, 400);

    setTimeout(() => {
      setShowToast(false);
    }, 3500);
  };

  return (
    <>
      {/* Toast Notification Banner */}
      {showToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-16 left-1/2 -translate-x-1/2 w-[360px] max-w-[92vw] z-50 bg-[#111111] text-white py-3 px-4 rounded-2xl shadow-2xl flex items-center justify-between border border-neutral-700 animate-slide-up"
        >
          <div className="flex items-center gap-2.5 min-w-0 mr-2">
            <span className="w-5 h-5 rounded-full bg-[#C7F000] text-[#111111] flex items-center justify-center text-xs font-bold shrink-0">
              &#10003;
            </span>
            <p className="text-xs font-medium truncate">{toastMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsBagOpen(true)}
            className="text-xs font-bold text-[#C7F000] underline underline-offset-2 shrink-0 hover:text-white transition-colors"
          >
            View Bag
          </button>
        </div>
      )}

      {/* Sticky Bottom Bar with Safe-Area insets */}
      <div className="sticky bottom-0 z-30 w-full bg-white/95 backdrop-blur-md border-t border-[#E5E5E5] px-5 py-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))] shadow-lg">
        <div className="max-w-[430px] mx-auto">
          <button
            type="button"
            disabled={isDisabled}
            onClick={handleAdd}
            className={`w-full h-[54px] rounded-full text-base font-bold flex items-center justify-center gap-2.5 transition-all duration-200 select-none box-border focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
              isDisabled
                ? "bg-[#F5F5F5] text-[#A3A3A3] cursor-not-allowed border border-[#E5E5E5]"
                : isAdding
                ? "bg-[#C7F000] text-[#111111] scale-[0.99]"
                : "bg-[#111111] text-white hover:bg-neutral-800 active:scale-[0.98] shadow-md"
            }`}
            aria-label={
              isDisabled
                ? "Select a size to enable Add to Bag"
                : `Add ${productInfo.name} size EU ${selectedVariant?.size_eu} to bag for $${productInfo.price}`
            }
          >
            {/* Bag Icon */}
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.67 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
              />
            </svg>
            <span>
              {isDisabled
                ? "Select Size"
                : isAdding
                ? "Added to Bag"
                : `Add to Bag — $${productInfo.price}`}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
