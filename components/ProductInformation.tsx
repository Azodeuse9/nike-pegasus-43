import { productInfo } from "@/data/inventory";

export default function ProductInformation() {
  return (
    <section
      aria-label="Product overview"
      className="w-full max-w-[343px] mx-auto mt-4 h-[88px] flex flex-col justify-between"
    >
      <div>
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-black tracking-tight text-neutral-900 leading-none">
            {productInfo.name}
          </h1>
          <span
            data-testid="product-price"
            className="text-xl font-bold text-neutral-900"
          >
            ${productInfo.price}
          </span>
        </div>
        <p className="text-sm font-medium text-neutral-600 mt-1">
          {productInfo.colorway}
        </p>
      </div>

      <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono border-t border-neutral-100 pt-1.5">
        <span>Style: {productInfo.styleCode}</span>
        <span>Launch: {productInfo.launchDate}</span>
      </div>
    </section>
  );
}
