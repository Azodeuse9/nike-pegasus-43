"use client";

import { useBag } from "@/context/BagContext";

export default function Header() {
  const { count } = useBag();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm w-full h-[56px] border-b border-gray-100 flex items-center justify-between px-4">
      {/* Menu icon button */}
      <button
        type="button"
        aria-label="Navigation menu"
        className="w-10 h-10 flex items-center justify-center -ml-2 text-black hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-full transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Nike Swoosh Brand Mark */}
      <div className="flex items-center justify-center flex-1">
        <svg
          viewBox="0 0 24 24"
          className="w-12 h-6 text-black fill-current"
          aria-label="Nike"
          role="img"
        >
          <path d="M21.707 5.293c-.27-.27-.69-.34-1.03-.18L3.45 13.56c-.53.25-.8.83-.66 1.4.15.56.66.96 1.25.96.1 0 .21-.01.31-.04l13.5-3.37-9.82 5.89c-.39.23-.59.69-.49 1.13.1.44.48.76.94.76h.17l12.44-3.11c.45-.11.77-.5.8-1 .02-.45-.25-.87-.67-1.02L7.33 11.23l14.15-4.72c.44-.15.71-.58.67-1.04-.04-.45-.33-.82-.77-.92z" />
        </svg>
      </div>

      {/* Shopping Bag button with live counter */}
      <button
        type="button"
        aria-label={`Shopping bag containing ${count} items`}
        className="w-10 h-10 flex items-center justify-center -mr-2 relative text-black hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-full transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.67 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
          />
        </svg>
        {count > 0 && (
          <span
            className="absolute top-1 right-1 bg-black text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center border-2 border-white animate-scale-in"
            aria-live="polite"
          >
            {count}
          </span>
        )}
      </button>
    </header>
  );
}
