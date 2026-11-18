# Nike Pegasus 43 — Mobile Product Page

A phone-first, responsive Nike Pegasus 43 product detail page built with Next.js (App Router), React, TypeScript, and Tailwind CSS for the Zero University assignment.

## Overview & Technologies

- **Framework**: Next.js 14+ (App Router with Server & Client Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context (`BagContext`) for shopping bag persistence
- **Automated Testing**: Headless Chrome E2E via Puppeteer-core and Node assertion test scripts

## Prompt Excerpt (Specifications & Constraints)

> **Mobile Layout & Usable Width**: Target viewport is exactly 375px wide with 16px horizontal page gutters, providing 343px of usable content width and zero horizontal overflow.
>
> **Page Hierarchy**: Exact page order: (1) Header and navigation, (2) Product photo gallery (343×343px), (3) Product name, colorway ($140) and price, (4) Size selector heading and 3-column size grid (343×712px), (5) Stock legend (343×24px), (6) Add to Bag action (343×56px), (7) Technology & product details (343×220px reserved), (8) Customer reviews (343×240px reserved).
>
> **Inventory & Accuracy**: Single source of truth is the supplied `Pegasus 43 size and stock list.json`. All 26 variants are preserved in original `display_order`. 17 in-stock, 5 low-stock, and 4 sold-out states. Sold-out sizes (EU 35.5, 44, 50, 50.5) remain visible but disabled. Low-stock sizes (EU 36, 42.5, 43, 45, 49.5) remain selectable and display exact remaining quantity.
>
> **Testing Attributes**: `data-testid="product-main-image"`, `data-testid="product-price"`, `data-testid="size-grid"`, and unique `data-testid="size-option-{sku}"` for every variant.

## 375px Mobile Testing Notes

1. **Observations at 375px**:
   - Initial PostCSS configuration was missing, which prevented Tailwind utility classes from compiling and caused the size grid to render unstyled (`grid-template-columns: none`, collapsing tiles to 36px height).
   - Once `@tailwindcss/postcss` was configured, the 375px container rendered with 16px page gutters, exactly 343px usable width, and 109px × 72px tiles with 0 horizontal overflow (`scrollWidth === window.innerWidth === 375px`).
   - We observed that an initial floating toast located immediately above the Add to Bag button temporarily obscured the Stock Legend, so we relocated the confirmation toast to a fixed bottom notification banner (`fixed bottom-6`) while preserving the 56px reserved button height and state feedback.

2. **Fixes & Retained Implementations**:
   - Added PostCSS config with `@tailwindcss/postcss` to ensure full generation of all arbitrary grid and dimension classes (`w-[343px]`, `h-[72px]`, `grid-cols-3`).
   - Retained the strict 72px height reservation and 14px stock status badge slot across all 26 size tiles, preventing any layout shift (CLS) between selected, unselected, low-stock, and sold-out states.

## Installation & Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run production build**:
   ```bash
   npm run build
   ```

3. **Start local server**:
   ```bash
   npm run start
   ```
   The application will be available at `http://localhost:3000`.

4. **Run automated validation suite**:
   ```bash
   # DOM and data-testid validation
   node verify.mjs

   # Full headless Chrome 375px E2E validation & screenshot
   node test-e2e.mjs
   ```
