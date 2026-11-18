"use client";

import { useState } from "react";
import { productInfo } from "@/data/inventory";

interface SectionItem {
  id: string;
  title: string;
  badge?: string;
  content: React.ReactNode;
}

export default function ProductAccordion() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    details: true, // open by default to showcase premium specs
    delivery: false,
    reviews: false,
  });

  const [copiedSku, setCopiedSku] = useState(false);

  const toggle = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopySku = () => {
    navigator.clipboard?.writeText(productInfo.styleCode);
    setCopiedSku(true);
    setTimeout(() => setCopiedSku(false), 2000);
  };

  const sections: SectionItem[] = [
    {
      id: "details",
      title: "Product Details & Technology",
      content: (
        <div className="space-y-4 pt-1 pb-2 text-xs leading-relaxed">
          {/* Editorial lead */}
          <p className="text-[#333333] font-normal leading-relaxed">
            The <span className="font-semibold text-[#111111]">Nike Pegasus 43</span> in{" "}
            <span className="font-semibold text-[#111111]">{productInfo.colorway}</span> continues
            Nike&apos;s longest-running performance running franchise. Built for daily training, long
            mileage, and responsive energy return with an all-new dual Air Zoom setup.
          </p>

          {/* Key Innovations Grid */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#707070]">
              Key Performance Benefits
            </h4>

            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#F9F9F9] border border-[#EBEBEB]">
                <div className="w-7 h-7 rounded-lg bg-[#C7F000]/25 text-[#111111] flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-[#111111]">Dual Zoom Air Units</p>
                  <p className="text-[11px] text-[#707070] leading-snug">
                    Forefoot and heel pressurized Air pods deliver energetic snapback on toe-off.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#F9F9F9] border border-[#EBEBEB]">
                <div className="w-7 h-7 rounded-lg bg-[#111111]/5 text-[#111111] flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-[#111111]">Engineered Circular Mesh</p>
                  <p className="text-[11px] text-[#707070] leading-snug">
                    Targeted open knit zones promote natural airflow while keeping the midfoot securely locked.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#F9F9F9] border border-[#EBEBEB]">
                <div className="w-7 h-7 rounded-lg bg-[#111111]/5 text-[#111111] flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-[#111111]">Generative Waffle Outsole</p>
                  <p className="text-[11px] text-[#707070] leading-snug">
                    Durable rubber lugs offer multi-surface traction on road, pavement, and track in wet or dry conditions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications Card */}
          <div className="rounded-xl border border-[#E5E5E5] bg-white p-3.5 space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#F0F0F0] pb-2">
              <span className="text-[11px] font-medium text-[#707070]">Style Code</span>
              <button
                type="button"
                onClick={handleCopySku}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#111111] hover:text-[#707070] bg-[#F5F5F5] px-2 py-0.5 rounded-md transition-colors"
                title="Click to copy SKU"
              >
                <span>{productInfo.styleCode}</span>
                <span className="text-[10px] text-[#707070]">{copiedSku ? "✓ Copied" : "📋"}</span>
              </button>
            </div>

            <div className="flex items-center justify-between border-b border-[#F0F0F0] pb-2">
              <span className="text-[11px] font-medium text-[#707070]">Category</span>
              <span className="text-[11px] font-semibold text-[#111111]">{productInfo.category} (Neutral Daily)</span>
            </div>

            <div className="flex items-center justify-between border-b border-[#F0F0F0] pb-2">
              <span className="text-[11px] font-medium text-[#707070]">Colorway</span>
              <span className="text-[11px] font-semibold text-[#111111]">{productInfo.colorway}</span>
            </div>

            <div className="flex items-center justify-between border-b border-[#F0F0F0] pb-2">
              <span className="text-[11px] font-medium text-[#707070]">Official Launch</span>
              <span className="text-[11px] font-semibold text-[#111111]">{productInfo.launchDate}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#707070]">Weight / Heel Drop</span>
              <span className="text-[11px] font-semibold text-[#111111]">~285g / 10mm Offset</span>
            </div>
          </div>

          {/* Move to Zero Eco Banner */}
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-900">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
              🌱
            </span>
            <p className="leading-snug">
              <span className="font-semibold">Move to Zero:</span> Made with at least 20% recycled material by weight to reduce waste and carbon footprint.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "delivery",
      title: "Delivery & Returns",
      badge: "Free 60-Day Trial",
      content: (
        <div className="space-y-3 pt-1 pb-2 text-xs leading-relaxed">
          {/* Shipping highlight 1 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F9F9F9] border border-[#EBEBEB]">
            <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25H4.5A2.25 2.25 0 002.25 9.75v6a2.25 2.25 0 002.25 2.25M14.25 7.5v11.25" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-[12px] text-[#111111]">Free Standard Delivery</p>
              <p className="text-[11px] text-[#707070] mt-0.5">
                Complimentary for all Nike Members. Arrives in 2–4 business days with end-to-end tracking.
              </p>
            </div>
          </div>

          {/* Returns highlight 2 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F9F9F9] border border-[#EBEBEB]">
            <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-[12px] text-[#111111]">60-Day Wear-Test Returns</p>
              <p className="text-[11px] text-[#707070] mt-0.5">
                Wear them, run in them, keep what you love. Return them for free within 60 days with no questions asked.
              </p>
            </div>
          </div>

          {/* Store pickup highlight 3 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F9F9F9] border border-[#EBEBEB]">
            <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.25A2.25 2.25 0 010 18.75V10.5m18 10.5h2.25A2.25 2.25 0 0022.5 18.75V10.5M3 10.5l9-6 9 6" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-[12px] text-[#111111]">Free Store Pick Up</p>
              <p className="text-[11px] text-[#707070] mt-0.5">
                Pick up ready in 2 hours at your local official Nike retail location.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "reviews",
      title: "Customer Reviews (0)",
      content: (
        <div className="space-y-4 pt-1 pb-2 text-xs leading-relaxed">
          {/* Rating Summary Header */}
          <div className="flex items-center justify-between bg-[#F9F9F9] border border-[#EBEBEB] rounded-2xl p-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#111111] tracking-tight">0.0</span>
                <span className="text-xs text-[#707070]">out of 5 stars</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-[#D4D4D4]">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-[11px] text-[#707070] mt-1 font-medium">0 verified runner ratings</p>
            </div>

            {/* Rating breakdown bars */}
            <div className="w-32 space-y-1">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-1.5 text-[10px] text-[#707070]">
                  <span className="w-2">{stars}</span>
                  <div className="flex-1 h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
                    <div className="h-full bg-[#111111] rounded-full w-0" />
                  </div>
                  <span className="w-2 text-right">0</span>
                </div>
              ))}
            </div>
          </div>

          {/* Wear-tester empty callout card */}
          <div className="text-center p-4 rounded-xl border border-dashed border-[#CCCCCC] bg-white space-y-2">
            <p className="font-bold text-[13px] text-[#111111]">Be the first to wear-test the Pegasus 43</p>
            <p className="text-[11px] text-[#707070] max-w-xs mx-auto">
              Verified runner reviews, fit analysis, and on-road impressions will officially open on launch day ({productInfo.launchDate}).
            </p>
            <button
              type="button"
              disabled
              className="mt-1 inline-flex items-center justify-center px-4 py-2 rounded-full border border-[#E5E5E5] bg-[#F5F5F5] text-[#A3A3A3] text-xs font-semibold cursor-not-allowed"
            >
              Write a Review (Opens Launch Day)
            </button>
          </div>
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
          <div key={sec.id} className="py-2">
            <button
              type="button"
              onClick={() => toggle(sec.id)}
              aria-expanded={isOpen}
              className="w-full py-3.5 px-1 flex items-center justify-between text-left text-sm font-bold text-[#111111] hover:text-[#707070] transition-colors rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2 select-none group"
            >
              <div className="flex items-center gap-2">
                <span>{sec.title}</span>
                {sec.badge && (
                  <span className="text-[10px] font-bold bg-[#C7F000]/30 text-[#111111] px-2 py-0.5 rounded-full border border-[#C7F000]">
                    {sec.badge}
                  </span>
                )}
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  isOpen ? "bg-[#111111] text-white" : "bg-[#F5F5F5] text-[#111111] group-hover:bg-[#E5E5E5]"
                }`}
              >
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </button>
            {isOpen && (
              <div className="px-1 animate-fade-in">{sec.content}</div>
            )}
          </div>
        );
      })}
    </section>
  );
}
