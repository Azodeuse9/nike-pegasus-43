import type { Metadata } from "next";
import "./globals.css";
import { BagProvider } from "@/context/BagContext";

export const metadata: Metadata = {
  title: "Nike Pegasus 43 — Black/White-Volt",
  description: "Nike Pegasus 43 in Black/White-Volt. Product details and size availability.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><BagProvider>{children}</BagProvider></body></html>;
}
