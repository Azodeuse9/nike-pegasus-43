import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BagProvider } from "@/context/BagContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Nike Pegasus 43 — Black/White-Volt",
  description: "Nike Pegasus 43 in Black/White-Volt. Shop now.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <BagProvider>{children}</BagProvider>
      </body>
    </html>
  );
}
