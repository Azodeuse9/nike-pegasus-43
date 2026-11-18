export default function StockLegend() {
  return (
    <div
      aria-label="Stock status legend"
      className="w-full max-w-[343px] mx-auto mt-3 mb-1 h-[24px] flex items-center justify-between text-[11px] text-neutral-600 border-t border-neutral-100 pt-1.5"
    >
      <div className="flex items-center gap-1.5">
        <span
          className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-600 inline-block"
          aria-hidden="true"
        />
        <span className="font-medium">In Stock</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span
          className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-500 inline-block"
          aria-hidden="true"
        />
        <span className="font-medium">Low Stock (&le; 5)</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span
          className="w-2.5 h-2.5 rounded-full bg-neutral-300 border border-neutral-400 inline-block"
          aria-hidden="true"
        />
        <span className="font-medium text-neutral-400">Sold Out (0)</span>
      </div>
    </div>
  );
}
