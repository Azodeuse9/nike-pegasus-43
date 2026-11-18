"use client";
import { useState } from "react";
import { productInfo } from "@/data/inventory";
export default function ProductDetails() {
  const [open, setOpen] = useState(false);
  return <section className="accordion-section" aria-label="Product details">
    <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="accordion-trigger"><span className="accordion-leading">▤</span><b>Product Details</b><span className={`accordion-chevron ${open ? "open" : ""}`}>⌄</span></button>
    {open && <div className="accordion-content"><p>Official technical specifications have not been supplied in the project materials.</p><dl><div><dt>Style code</dt><dd>{productInfo.styleCode}</dd></div><div><dt>Colorway</dt><dd>{productInfo.colorway}</dd></div><div><dt>Launch date</dt><dd>Dec 10, 2026</dd></div></dl></div>}
  </section>;
}
