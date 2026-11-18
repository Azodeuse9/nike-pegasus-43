"use client";

import { SizeFormat } from "@/data/inventory";

interface SizeFormatSwitcherProps {
  currentFormat: SizeFormat;
  onFormatChange: (format: SizeFormat) => void;
}

export default function SizeFormatSwitcher({
  currentFormat,
  onFormatChange,
}: SizeFormatSwitcherProps) {
  const formats: { id: SizeFormat; label: string }[] = [
    { id: "EU", label: "EU" },
    { id: "US_MEN", label: "US Men" },
    { id: "US_WOMEN", label: "US Women" },
  ];

  return (
    <div
      role="group"
      aria-label="Size format options"
      className="inline-flex items-center bg-[#F5F5F5] p-1 rounded-full border border-[#E5E5E5]/60"
    >
      {formats.map((fmt) => {
        const isActive = currentFormat === fmt.id;
        return (
          <button
            key={fmt.id}
            type="button"
            onClick={() => onFormatChange(fmt.id)}
            aria-pressed={isActive}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-black ${
              isActive
                ? "bg-[#111111] text-white shadow-xs"
                : "text-[#707070] hover:text-[#111111]"
            }`}
          >
            {fmt.label}
          </button>
        );
      })}
    </div>
  );
}
