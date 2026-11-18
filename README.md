# Nike Pegasus 43 — Mobile Product Detail Page

A mobile-first product detail experience built with Next.js App Router, React, TypeScript and Tailwind CSS.

## Design direction

The interface follows the supplied Figma reference: compact Nike-style header, large product gallery, aligned product title and price, one verified colorway, four-column quick-size grid, expandable full inventory, inline stock states, compact information highlights, accordion details and a fixed Add to Bag action.

## Assets

- `public/assets/nike-swoosh.png` — cropped transparent Nike swoosh from the supplied logo asset.
- `public/assets/pegasus-*.png` — five shoe views supplied by the user and used in the gallery and colorway thumbnail.

The supplied shoe photography is used as provided. The page does not claim independent verification of the photographed shoe's style code.

## Inventory source and behavior

`Pegasus 43 size and stock list.json` is the source of truth. `data/inventory.ts` preserves all 26 variants and original display order:

- 17 in stock
- 5 low stock, with exact remaining quantity shown
- 4 sold out, visible and disabled
- One supplied colorway: Black/White-Volt

The initial quick-size view shows display orders 8–15 (men's US 7–10.5) as a convenient middle-range shortcut. This is a UI choice, not a claim about popularity. **View All Sizes (26)** expands the full inventory in original order.

No additional colorways, technical specifications, delivery promises, return policy or customer ratings are invented. Unprovided information is identified as unavailable.

## Interaction and accessibility

- Gallery arrows and pagination controls switch between five supplied views.
- Size tiles expose stock state, selected state and SKU-specific `data-testid` values.
- Sold-out sizes are disabled.
- Add to Bag stays disabled until an available size is selected.
- Product details, delivery/returns and reviews expand independently.
- Required test hooks: `product-main-image`, `product-price`, `size-grid`, `size-option-<SKU>` and `add-to-bag`.

## 375px review notes

- Rebuilt the visual hierarchy around the supplied Figma reference: 10px gallery gutters, 19px gallery radius, compact product information and aligned title/price row.
- Added the supplied shoe photography to the gallery instead of the earlier vector placeholder.
- Added the supplied Nike swoosh logo as a cropped transparent PNG.
- Reworked size tiles into four equal columns with inline green, amber, grey and black availability/selection states.
- Kept one colorway because only one colorway is present in the inventory source. The five shoe photos are gallery views, not five separate color options.
- Replaced unverified delivery/authenticity promises with factual product and inventory highlights.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` and inspect at 375px and 390px widths.

```bash
npm run build
```
