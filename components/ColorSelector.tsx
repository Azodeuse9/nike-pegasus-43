import Image from "next/image";
import { productInfo } from "@/data/inventory";

export default function ColorSelector() {
  return (
    <section aria-label="Product colorway" className="w-full max-w-[430px] mx-auto mt-5">
      <div className="flex items-center justify-between text-xs font-semibold text-[#707070] mb-2.5">
        <span>Colour</span>
        <span className="text-[#111111]">1 Colourway Available</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Active verified colorway thumbnail with selected border */}
        <div className="relative">
          <button
            type="button"
            aria-label={`${productInfo.colorway} (Selected)`}
            aria-pressed="true"
            className="w-16 h-16 rounded-[12px] bg-[#F5F5F5] border-2 border-[#111111] p-1.5 flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <div className="relative w-full h-full">
              <Image
                src="/assets/pegasus-lateral.webp"
                alt={productInfo.colorway}
                fill
                className="object-contain"
              />
            </div>
          </button>
          {/* Subtle selected check badge */}
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#111111] text-white text-[9px] flex items-center justify-center border-2 border-white">
            &#10003;
          </span>
        </div>

        <div className="text-xs">
          <p className="font-semibold text-[#111111]">{productInfo.colorway}</p>
          <p className="text-[#707070] text-[11px] mt-0.5">Original Release Edition</p>
        </div>
      </div>
    </section>
  );
}
