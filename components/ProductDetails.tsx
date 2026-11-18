import { productInfo } from "@/data/inventory";

export default function ProductDetails() {
  return (
    <section
      aria-label="Technology and product details"
      className="w-full max-w-[343px] mx-auto mt-6"
    >
      {/* Reserved 220px container */}
      <div className="w-[343px] max-w-full h-[220px] rounded-2xl bg-neutral-50 border border-neutral-200/80 p-4 flex flex-col justify-between box-border">
        {/* Heading: 32px */}
        <div className="h-[32px] flex items-center justify-between border-b border-neutral-200/60 pb-2">
          <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-900">
            Technology &amp; Product Details
          </h3>
          <span className="text-[10px] font-semibold bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full">
            Specification Notice
          </span>
        </div>

        {/* Feature content placeholder: 120px */}
        <div className="h-[120px] flex flex-col justify-center text-xs text-neutral-600 leading-relaxed bg-white rounded-xl p-3 border border-neutral-200/50 shadow-xs">
          <p className="font-semibold text-neutral-800 mb-1">
            Official Technical Specifications Pending
          </p>
          <p className="text-[11px] text-neutral-500">
            Manufacturer technical details regarding midsole cushioning foam, stack heights, plate geometry, and upper textiles will be confirmed upon product launch.
          </p>
        </div>

        {/* Supporting description / metadata: 52px */}
        <div className="h-[44px] flex items-center justify-between text-[11px] text-neutral-500 pt-1">
          <div>
            <span className="block text-neutral-400 text-[10px]">STYLE CODE</span>
            <span className="font-mono font-medium text-neutral-800">{productInfo.styleCode}</span>
          </div>
          <div className="text-right">
            <span className="block text-neutral-400 text-[10px]">OFFICIAL LAUNCH</span>
            <span className="font-medium text-neutral-800">{productInfo.launchDate}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
