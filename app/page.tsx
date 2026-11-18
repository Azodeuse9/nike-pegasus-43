"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ProductGallery from "@/components/ProductGallery";
import ProductInformation from "@/components/ProductInformation";
import ColorSelector from "@/components/ColorSelector";
import SizeSelector from "@/components/SizeSelector";
import SelectedSizeSummary from "@/components/SelectedSizeSummary";
import AddToBag from "@/components/AddToBag";
import ProductAccordion from "@/components/ProductAccordion";
import BagDrawer from "@/components/BagDrawer";
import { inventory, SizeFormat } from "@/data/inventory";

export default function Home() {
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [format, setFormat] = useState<SizeFormat>("EU");

  const selectedVariant = inventory.find((v) => v.sku === selectedSku);

  return (
    <div className="min-h-screen bg-[#F5F5F5] sm:py-6 flex justify-center">
      {/* Target Container: Clean 430px mobile envelope or full mobile screen */}
      <div className="w-full max-w-[430px] min-h-screen bg-white sm:shadow-xl sm:rounded-[32px] flex flex-col overflow-x-hidden relative">
        {/* Navigation Header */}
        <Header />

        {/* Main Product Content */}
        <main className="w-full px-5 pt-3 pb-8 flex flex-col flex-1">
          {/* 1. Product Gallery with Actual Photography */}
          <ProductGallery />

          {/* 2. Product Information (Running, Title, Price, Colorway, Metadata) */}
          <ProductInformation />

          {/* 3. Colour Selection (Single verified Black / White-Volt) */}
          <ColorSelector />

          {/* 4. Redesigned Size Selector (4-col grid, EU default, Switcher, 8 initial, View All 26) */}
          <SizeSelector
            selectedSku={selectedSku}
            onSelectSku={setSelectedSku}
            format={format}
            onFormatChange={setFormat}
          />

          {/* 5. Selected Size Confirmation Summary */}
          <SelectedSizeSummary
            selectedVariant={selectedVariant}
            format={format}
          />

          {/* 6. Expandable Accordions: Details, Delivery & Returns, Reviews */}
          <ProductAccordion />
        </main>

        {/* 7. Sticky Add to Bag Button */}
        <AddToBag selectedVariant={selectedVariant} />

        {/* Slide-over Bag Drawer */}
        <BagDrawer />
      </div>
    </div>
  );
}
