"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export interface BagItem {
  sku: string;
  productName: string;
  sizeLabel: string;
  sizeEu: string;
  price: number;
  quantity: number;
  image?: string;
}

interface BagContextType {
  items: BagItem[];
  count: number;
  isBagOpen: boolean;
  setIsBagOpen: (open: boolean) => void;
  addItem: (item: {
    sku: string;
    productName?: string;
    sizeLabel: string;
    sizeEu?: string;
    price?: number;
    image?: string;
  }) => void;
  removeItem: (sku: string) => void;
  clearBag: () => void;
}

const BagContext = createContext<BagContextType>({
  items: [],
  count: 0,
  isBagOpen: false,
  setIsBagOpen: () => {},
  addItem: () => {},
  removeItem: () => {},
  clearBag: () => {},
});

export function BagProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BagItem[]>([]);
  const [isBagOpen, setIsBagOpen] = useState(false);

  // Derived total item count without cascading effect renders
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = useCallback(
    (item: {
      sku: string;
      productName?: string;
      sizeLabel: string;
      sizeEu?: string;
      price?: number;
      image?: string;
    }) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.sku === item.sku);
        if (existing) {
          return prev.map((i) =>
            i.sku === item.sku ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        return [
          ...prev,
          {
            sku: item.sku,
            productName: item.productName || "Nike Pegasus 43",
            sizeLabel: item.sizeLabel,
            sizeEu: item.sizeEu || "",
            price: item.price || 140,
            quantity: 1,
            image: item.image || "/assets/pegasus-lateral.webp",
          },
        ];
      });
    },
    []
  );

  const removeItem = useCallback((sku: string) => {
    setItems((prev) => prev.filter((item) => item.sku !== sku));
  }, []);

  const clearBag = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <BagContext.Provider
      value={{
        items,
        count,
        isBagOpen,
        setIsBagOpen,
        addItem,
        removeItem,
        clearBag,
      }}
    >
      {children}
    </BagContext.Provider>
  );
}

export function useBag() {
  const context = useContext(BagContext);
  if (!context) {
    throw new Error("useBag must be used within a BagProvider");
  }
  return context;
}
