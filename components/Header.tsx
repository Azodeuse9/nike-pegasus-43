"use client";

import { useState } from "react";
import Image from "next/image";
import { useBag } from "@/context/BagContext";

export default function Header() {
  const { count, setIsBagOpen, isBagOpen } = useBag();
  const [isLiked, setIsLiked] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md w-full h-[54px] border-b border-[#E5E5E5] px-5 flex items-center justify-between transition-colors relative">
        {/* Left: Hamburger Menu */}
        <div className="flex items-center z-10">
          <button
            type="button"
            aria-label="Navigation menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 -ml-2 flex items-center justify-center text-[#111111] hover:text-[#707070] active:scale-95 transition-all rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5h16.5M3.75 12h16.5m-16.5 4.5h16.5" />
            </svg>
          </button>
        </div>

        {/* Center: Exactly Centered Nike Swoosh Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-auto">
          <a href="#" aria-label="Nike Home" className="flex items-center justify-center">
            <Image
              src="/assets/nike-swoosh.png"
              alt="Nike"
              width={60}
              height={22}
              className="h-[20px] w-auto object-contain select-none"
              priority
            />
          </a>
        </div>

        {/* Right: Search, Favourite, Bag */}
        <div className="flex items-center gap-1 -mr-2 z-10">
          {/* Search Button */}
          <button
            type="button"
            aria-label="Search products"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="w-9 h-9 flex items-center justify-center text-[#111111] hover:text-[#707070] active:scale-95 transition-all rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Favourite / Wishlist Button */}
          <button
            type="button"
            aria-label={isLiked ? "Remove from favourites" : "Add to favourites"}
            aria-pressed={isLiked}
            onClick={() => setIsLiked(!isLiked)}
            className="w-9 h-9 flex items-center justify-center text-[#111111] hover:text-[#707070] active:scale-95 transition-all rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <svg
              className={`w-5 h-5 transition-colors ${isLiked ? "fill-red-500 text-red-500" : "fill-none text-[#111111]"}`}
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>

          {/* Shopping Bag Button with Live Badge */}
          <button
            type="button"
            aria-label={`Shopping bag containing ${count} items`}
            onClick={() => setIsBagOpen(!isBagOpen)}
            className="w-9 h-9 flex items-center justify-center text-[#111111] hover:text-[#707070] active:scale-95 relative transition-all rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.67 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
              />
            </svg>
            {count > 0 && (
              <span
                className="absolute top-1 right-0.5 bg-[#111111] text-white text-[10px] font-bold rounded-full min-w-[16px] h-[16px] px-1 flex items-center justify-center animate-scale-in"
                aria-live="polite"
              >
                {count}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Slide-out Menu Drawer for Navigation */}
      {isMenuOpen && (
        <div
          role="dialog"
          aria-label="Navigation drawer"
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex animate-fade-in"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="w-[280px] h-full bg-white p-6 flex flex-col justify-between shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#E5E5E5]">
                <Image src="/assets/nike-swoosh.png" alt="Nike" width={48} height={18} className="h-4 w-auto object-contain" />
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#707070] hover:text-[#111111]"
                >
                  &times;
                </button>
              </div>
              <nav className="mt-6 flex flex-col gap-4 text-base font-semibold text-[#111111]">
                <a href="#" className="hover:text-[#707070] transition-colors">Men</a>
                <a href="#" className="hover:text-[#707070] transition-colors">Women</a>
                <a href="#" className="hover:text-[#707070] transition-colors">Kids</a>
                <a href="#" className="hover:text-[#707070] transition-colors">Running</a>
                <a href="#" className="hover:text-[#707070] transition-colors">Sale</a>
              </nav>
            </div>
            <div className="text-xs text-[#707070]">
              <p>Nike Pegasus 43 Mobile Experience</p>
              <p className="mt-1 text-[#A3A3A3]">Zero University Project</p>
            </div>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-x-0 top-[54px] z-30 bg-white border-b border-[#E5E5E5] p-4 shadow-lg animate-fade-in">
          <div className="max-w-[430px] mx-auto flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search Nike shoes, gear..."
                autoFocus
                className="w-full h-10 bg-[#F5F5F5] rounded-full pl-10 pr-4 text-sm text-[#111111] placeholder:text-[#A3A3A3] focus:outline-none focus:ring-1 focus:ring-black"
              />
              <svg className="w-4 h-4 absolute left-3.5 top-3 text-[#707070]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="text-xs font-semibold text-[#707070] hover:text-[#111111] px-2 py-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
