"use client";

import Image from "next/image";
import { useBag } from "@/context/BagContext";

export default function BagDrawer() {
  const { items, count, isBagOpen, setIsBagOpen, removeItem, clearBag } =
    useBag();

  if (!isBagOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bag-drawer-title"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-fade-in"
      onClick={() => setIsBagOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm h-full bg-white p-6 flex flex-col justify-between shadow-2xl animate-slide-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-2">
            <h2 id="bag-drawer-title" className="text-lg font-bold text-[#111111]">
              Shopping Bag
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F5F5F5] text-[#707070]">
              {count}
            </span>
          </div>
          <button
            type="button"
            aria-label="Close shopping bag"
            onClick={() => setIsBagOpen(false)}
            className="w-8 h-8 rounded-full bg-[#F5F5F5] hover:bg-[#E5E5E5] flex items-center justify-center text-[#111111] transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto py-4 divide-y divide-[#E5E5E5]">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-[#707070] py-12">
              <svg
                className="w-12 h-12 text-[#A3A3A3] mb-3 stroke-[1.2]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.67 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
                />
              </svg>
              <p className="text-sm font-semibold text-[#111111]">Your bag is empty</p>
              <p className="text-xs text-[#707070] mt-1">Select your size and add Pegasus 43 to bag</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.sku} className="py-4 flex gap-3">
                <div className="relative w-16 h-16 bg-[#F1F1F1] rounded-lg shrink-0 overflow-hidden border border-[#E5E5E5]/60">
                  <Image
                    src={item.image || "/assets/nike-pegasus-43-1.png"}
                    alt={item.productName}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="text-xs font-bold text-[#111111] truncate">
                      {item.productName}
                    </h3>
                    <span className="text-xs font-bold text-[#111111] shrink-0">
                      ${item.price * item.quantity}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#707070] mt-0.5">
                    Size: {item.sizeLabel} {item.sizeEu && `(EU ${item.sizeEu})`}
                  </p>
                  <p className="text-[10px] text-[#A3A3A3] font-mono">
                    SKU: {item.sku}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-[#707070]">
                      Qty: {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.sku)}
                      className="text-[11px] text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="pt-4 border-t border-[#E5E5E5] space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#707070]">Subtotal</span>
              <span className="font-bold text-[#111111]">${subtotal}</span>
            </div>
            <p className="text-[11px] text-[#A3A3A3]">
              Taxes and shipping calculated at checkout.
            </p>
            <button
              type="button"
              className="w-full h-12 bg-[#111111] text-white rounded-full font-bold text-sm hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
              onClick={() => alert(`Proceeding to checkout with ${count} items ($${subtotal})`)}
            >
              Checkout &bull; ${subtotal}
            </button>
            <button
              type="button"
              onClick={clearBag}
              className="w-full text-center text-xs text-[#707070] hover:text-[#111111] py-1"
            >
              Clear Bag
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
