"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface BagItem {
  sku: string;
  size_label: string;
  quantity: number;
}

interface BagContextType {
  items: BagItem[];
  count: number;
  addItem: (sku: string, sizeLabel: string) => void;
}

const BagContext = createContext<BagContextType>({
  items: [],
  count: 0,
  addItem: () => {},
});

export function BagProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BagItem[]>([]);
  const [count, setCount] = useState(0);

  const addItem = useCallback((sku: string, sizeLabel: string) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.sku === sku);
      if (existing) {
        return prev.map((item) =>
          item.sku === sku ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { sku, size_label: sizeLabel, quantity: 1 }];
    });
    setCount((prev) => prev + 1);
  }, []);

  return (
    <BagContext.Provider value={{ items, count, addItem }}>
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
