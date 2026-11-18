"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ProductGallery from "@/components/ProductGallery";
import ProductInformation from "@/components/ProductInformation";
import SizeSelector from "@/components/SizeSelector";
import StockLegend from "@/components/StockLegend";
import AddToBag from "@/components/AddToBag";
import ProductDetails from "@/components/ProductDetails";
import Reviews from "@/components/Reviews";
import { inventory } from "@/data/inventory";

export default function Home() {
  const [selectedSku, setSelectedSku] = useState<string | null>(null);

  const selectedVariant = inventory.find((v) => v.sku === selectedSku);
  const selectedSize = selectedVariant?.size_label ?? "";

  return (
    <div className="min-h-screen bg-neutral-100 sm:py-6 flex justify-center">
      {/* Target 375px Phone Container */}
      <div className="w-full max-w-[375px] min-h-screen bg-white shadow-lg sm:rounded-3xl flex flex-col overflow-x-hidden">
        {/* 1. Header and navigation (375px width, 56px height) */}
        <Header />

        {/* Usable content area: 16px left/right page gutters = 343px usable width */}
        <main className="w-full px-4 flex flex-col items-center pb-10">
          {/* 2. Product photo gallery (343px × 343px) */}
          <ProductGallery />

          {/* 3. Product name, colorway and price (343px × 88px) */}
          <ProductInformation />

          {/* 4. Size selector heading + 3-column size grid (343px × 712px) */}
          <SizeSelector selectedSku={selectedSku} onSelectSku={setSelectedSku} />

          {/* 5. Stock legend (343px × 24px) */}
          <StockLegend />

          {/* 6. Add to Bag button (343px × 56px) */}
          <AddToBag selectedSku={selectedSku} selectedSize={selectedSize} />

          {/* 7. Technology and product details (343px × 220px) */}
          <ProductDetails />

          {/* 8. Customer reviews (343px × 240px) */}
          <Reviews />
        </main>
      </div>
    </div>
  );
}
