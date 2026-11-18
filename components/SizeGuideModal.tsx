"use client";

import { useEffect, useRef } from "react";
import { inventory, inventorySummary } from "@/data/inventory";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-guide-title"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[85vh] bg-white rounded-t-[24px] sm:rounded-2xl p-6 flex flex-col shadow-2xl animate-slide-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
          <div>
            <h2 id="size-guide-title" className="text-lg font-bold text-[#111111]">
              Nike Size Guide
            </h2>
            <p className="text-xs text-[#707070] mt-0.5">
              Pegasus 43 official variant size conversion table
            </p>
          </div>
          <button
            type="button"
            aria-label="Close size guide"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F5F5F5] hover:bg-[#E5E5E5] flex items-center justify-center text-[#111111] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            &times;
          </button>
        </div>

        {/* Info callout */}
        <div className="mt-4 p-3 bg-[#F5F5F5] rounded-xl text-xs text-[#707070] leading-relaxed">
          <p>
            <strong className="text-[#111111]">Unisex Sizing:</strong> Sizing options map across EU, US Men, and US Women for all 26 variants. The default format on this page is EU sizing.
          </p>
        </div>

        {/* Mapping Table */}
        <div className="mt-4 flex-1 overflow-y-auto pr-1">
          <table className="w-full text-xs text-left">
            <thead className="sticky top-0 bg-white border-b border-[#E5E5E5] text-[#707070] font-semibold">
              <tr>
                <th className="py-2.5 px-3">EU Size</th>
                <th className="py-2.5 px-3">US Men</th>
                <th className="py-2.5 px-3">US Women</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {inventory.map((variant) => (
                <tr
                  key={variant.sku}
                  className={`hover:bg-[#F5F5F5] transition-colors ${
                    variant.stock_status === "sold_out" ? "opacity-50" : ""
                  }`}
                >
                  <td className="py-2.5 px-3 font-semibold text-[#111111]">
                    {variant.size_eu}
                  </td>
                  <td className="py-2.5 px-3 text-[#111111]">
                    {variant.size_us_men}
                  </td>
                  <td className="py-2.5 px-3 text-[#111111]">
                    {variant.size_us_women}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {variant.stock_status === "sold_out" ? (
                      <span className="text-[#A3A3A3]">Sold Out</span>
                    ) : variant.stock_status === "low_stock" ? (
                      <span className="text-[#B77900] font-medium">
                        Low Stock ({variant.stock_quantity})
                      </span>
                    ) : (
                      <span className="text-[#16803C] font-medium">In Stock</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#E5E5E5] mt-4 flex items-center justify-between text-xs text-[#707070]">
          <span>Total Variants: {inventorySummary.total}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#111111] text-white rounded-full font-semibold hover:bg-neutral-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
