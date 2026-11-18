"use client";

import { useState } from "react";
import { productInfo } from "@/data/inventory";

interface SectionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export default function ProductAccordion() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    details: false,
    delivery: false,
    reviews: false,
  });

  const toggle = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const sections: SectionItem[] = [
    {
      id: "details",
      title: "Product Details",
      content: (
        <div className="space-y-3 text-xs text-[#707070] leading-relaxed">
          <p>
            The Nike Pegasus 43 in {productInfo.colorway} continues Nike&apos;s longest-running performance franchise.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-3 border border-[#E5E5E5]/60 text-[11px] space-y-1 font-mono">
            <div><span className="font-semibold text-[#111111]">Style Code:</span> {productInfo.styleCode}</div>
            <div><span className="font-semibold text-[#111111]">Category:</span> {productInfo.category}</div>
            <div><span className="font-semibold text-[#111111]">Colorway:</span> {productInfo.colorway}</div>
            <div><span className="font-semibold text-[#111111]">Official Launch:</span> {productInfo.launchDate}</div>
          </div>
          <p className="text-[11px] text-[#A3A3A3]">
            Verified manufacturer specifications regarding midsole foam formulation, stack heights, and textile technologies will be published upon official launch.
          </p>
        </div>
      ),
    },
    {
      id: "delivery",
      title: "Delivery & Returns",
      content: (
        <div className="space-y-2 text-xs text-[#707070] leading-relaxed">
          <p>
            Standard shipping and store pickup options are available at checkout.
          </p>
          <p className="text-[11px] text-[#A3A3A3]">
            Specific delivery timelines, shipping rates, and return policies will be confirmed by Nike upon launch on {productInfo.launchDate}.
          </p>
        </div>
      ),
    },
    {
      id: "reviews",
      title: "Customer Reviews (0)",
      content: (
        <div className="space-y-2 text-xs text-[#707070] leading-relaxed">
          <div className="flex items-center gap-1 text-[#A3A3A3]">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg key={s} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs font-medium text-[#707070] ml-1">No ratings yet</span>
          </div>
          <p className="text-[11px] text-[#A3A3A3]">
            Customer reviews and verified runner ratings will open following the {productInfo.launchDate} launch.
          </p>
        </div>
      ),
    },
  ];

  return (
    <section
      aria-label="Product specifications and policy accordions"
      className="w-full max-w-[430px] mx-auto mt-8 border-t border-[#E5E5E5] divide-y divide-[#E5E5E5]"
    >
      {sections.map((sec) => {
        const isOpen = openSections[sec.id];
        return (
          <div key={sec.id} className="py-4">
            <button
              type="button"
              onClick={() => toggle(sec.id)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between text-left text-sm font-semibold text-[#111111] hover:text-[#707070] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-black"
            >
              <span>{sec.title}</span>
              <svg
                className={`w-4 h-4 text-[#707070] transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>
            {isOpen && (
              <div className="mt-3 pt-1 animate-fade-in">{sec.content}</div>
            )}
          </div>
        );
      })}
    </section>
  );
}
