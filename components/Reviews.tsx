import { productInfo } from "@/data/inventory";

export default function Reviews() {
  return (
    <section
      aria-label="Customer reviews"
      className="w-full max-w-[343px] mx-auto mt-6 mb-12"
    >
      {/* Reserved 240px container */}
      <div className="w-[343px] max-w-full h-[240px] rounded-2xl bg-neutral-50 border border-neutral-200/80 p-4 flex flex-col justify-between box-border">
        {/* Reviews heading: 32px */}
        <div className="h-[32px] flex items-center justify-between border-b border-neutral-200/60 pb-2">
          <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-900">
            Customer Reviews
          </h3>
          <span className="text-[10px] font-semibold bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full">
            0 Reviews
          </span>
        </div>

        {/* Rating summary area: 64px */}
        <div className="h-[64px] flex items-center justify-between px-3 bg-white rounded-xl border border-neutral-200/50 shadow-xs">
          <div>
            <span className="text-xs font-semibold text-neutral-800 block">Rating Summary</span>
            <span className="text-[11px] text-neutral-500">Unrated prior to official release</span>
          </div>
          <div className="flex items-center gap-1 text-neutral-300">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Review preview placeholder area: 78px */}
        <div className="h-[78px] flex flex-col justify-center text-center px-3 bg-white/70 rounded-xl border border-neutral-200/40">
          <p className="text-xs font-medium text-neutral-700">
            Reviews will open following launch
          </p>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Verified purchaser ratings for {productInfo.name} will appear here after {productInfo.launchDate}.
          </p>
        </div>

        {/* View all / write action area: 32px */}
        <div className="h-[32px] flex items-center justify-center">
          <button
            type="button"
            disabled
            className="w-full text-xs font-semibold text-neutral-400 cursor-not-allowed py-1"
          >
            Review submission opens on launch day
          </button>
        </div>
      </div>
    </section>
  );
}
