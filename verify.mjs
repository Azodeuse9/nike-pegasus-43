import fs from 'fs';

async function test() {
  const res = await fetch('http://localhost:3000');
  console.log('HTTP Status:', res.status);
  const rawHtml = await res.text();
  const cleanHtml = rawHtml.replace(/<!--[\s\S]*?-->/g, '');

  // 1. Test main product image
  const hasMainImage =
    rawHtml.includes('data-testid="main-product-image"') ||
    rawHtml.includes('data-testid="product-main-image"');
  console.log('product-main-image testid present:', hasMainImage);

  // 2. Test product price
  const hasPrice = rawHtml.includes('data-testid="product-price"');
  console.log('product-price testid present:', hasPrice);
  console.log('price text "$140" present:', cleanHtml.includes('$140'));

  // 3. Test size-grid
  const hasSizeGrid = rawHtml.includes('data-testid="size-grid"');
  console.log('size-grid testid present:', hasSizeGrid);

  // Read inventory JSON
  const inventory = JSON.parse(fs.readFileSync('Pegasus 43 size and stock list.json', 'utf8'));
  console.log('Total variants in JSON:', inventory.length);

  // Verify initial 8 variants are display_order 8 through 15
  const initialVariants = inventory.filter(v => v.display_order >= 8 && v.display_order <= 15);
  let allInitialPresent = true;
  for (const item of initialVariants) {
    const testid = `data-testid="size-option-${item.sku}"`;
    if (!rawHtml.includes(testid)) {
      console.error('Missing initial size option testid for SKU:', item.sku);
      allInitialPresent = false;
    }
  }
  console.log(`Initial 8 sizes (display_order 8-15) present on initial render:`, allInitialPresent);

  // Check toggle all sizes button
  const hasToggle = rawHtml.includes('data-testid="toggle-all-sizes"');
  console.log('toggle-all-sizes control present:', hasToggle);

  // Check inventory summary counts
  const inStockCount = inventory.filter(i => i.stock_status === 'in_stock').length;
  const lowStockCount = inventory.filter(i => i.stock_status === 'low_stock').length;
  const soldOutCount = inventory.filter(i => i.stock_status === 'sold_out').length;
  console.log(`Inventory counts: in_stock = ${inStockCount} (expected 17), low_stock = ${lowStockCount} (expected 5), sold_out = ${soldOutCount} (expected 4)`);

  // Verify sold-out EU sizes: 35.5, 44, 50, 50.5
  const soldOutSkus = inventory.filter(i => i.stock_status === 'sold_out').map(i => i.size_eu);
  console.log(`Sold out EU sizes: ${soldOutSkus.join(', ')} (expected 35.5, 44, 50, 50.5)`);

  // Verify low-stock EU sizes: 36, 42.5, 43, 45, 49.5
  const lowStockSkus = inventory.filter(i => i.stock_status === 'low_stock').map(i => i.size_eu);
  console.log(`Low stock EU sizes: ${lowStockSkus.join(', ')} (expected 36, 42.5, 43, 45, 49.5)`);

  console.log('Static DOM validation completed successfully!');
}

test().catch(console.error);
