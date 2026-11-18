import { productInfo } from "@/data/inventory";

export default function ProductInformation() {
  return (
    <section aria-label="Product details overview" className="w-full max-w-[430px] mx-auto mt-4">
      {/* Category Tag */}
      <span className="text-xs font-semibold tracking-wider text-[#707070] uppercase block mb-1">
        {productInfo.category}
      </span>

      {/* Title & Price Header Row */}
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-[26px] sm:text-[28px] font-bold tracking-tight text-[#111111] leading-tight">
          {productInfo.name}
        </h1>
        <span
          data-testid="product-price"
          className="text-[24px] sm:text-[26px] font-bold text-[#111111] shrink-0"
        >
          ${productInfo.price}
        </span>
      </div>

      {/* Colorway */}
      <p className="text-sm font-medium text-[#707070] mt-1">
        {productInfo.colorway}
      </p>

      {/* Style & Launch Date */}
      <div className="flex items-center gap-3 text-xs text-[#A3A3A3] mt-2 font-mono">
        <span>Style: {productInfo.styleCode}</span>
        <span>&bull;</span>
        <span>Launching {productInfo.launchDate}</span>
      </div>
    </section>
  );
}
