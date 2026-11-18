"use client";
import { useState } from "react";
export default function Reviews() {
  const [open, setOpen] = useState(false);
  return <section className="accordion-section" aria-label="Customer reviews">
    <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="accordion-trigger"><span className="accordion-leading">☆</span><b>Customer Reviews <span className="review-count">(0)</span></b><span className={`accordion-chevron ${open ? "open" : ""}`}>⌄</span></button>
    {open && <div className="accordion-content">No verified customer reviews are available yet.</div>}
  </section>;
}
