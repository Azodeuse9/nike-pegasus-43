"use client";
import { useState } from "react";
export default function DeliveryReturns() {
  const [open, setOpen] = useState(false);
  return <section className="accordion-section" aria-label="Delivery and returns">
    <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="accordion-trigger"><span className="accordion-leading">♧</span><b>Delivery &amp; Returns</b><span className={`accordion-chevron ${open ? "open" : ""}`}>⌄</span></button>
    {open && <div className="accordion-content">Delivery timelines, charges and return-policy details have not been supplied for this product.</div>}
  </section>;
}
