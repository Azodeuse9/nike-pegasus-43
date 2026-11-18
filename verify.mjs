import fs from 'fs';

async function test() {
  const res = await fetch('http://localhost:3000');
  console.log('HTTP Status:', res.status);
  const rawHtml = await res.text();
  // Strip react SSR comment markers
  const cleanHtml = rawHtml.replace(/<!--[\s\S]*?-->/g, '');

  // Test product-main-image
  const hasMainImage = rawHtml.includes('data-testid="product-main-image"');
  console.log('product-main-image testid present:', hasMainImage);

  // Test product-price
  const hasPrice = rawHtml.includes('data-testid="product-price"');
  console.log('product-price testid present:', hasPrice);
  console.log('price text "$140" present:', cleanHtml.includes('$140'));

  // Test size-grid
  const hasSizeGrid = rawHtml.includes('data-testid="size-grid"');
  console.log('size-grid testid present:', hasSizeGrid);

  // Read inventory JSON
  const inventory = JSON.parse(fs.readFileSync('Pegasus 43 size and stock list.json', 'utf8'));
  console.log('Total variants in JSON:', inventory.length);

  let foundAllSkus = true;
  let inStockCount = 0;
  let lowStockCount = 0;
  let soldOutCount = 0;

  for (const item of inventory) {
    const testid = `data-testid="size-option-${item.sku}"`;
    const found = rawHtml.includes(testid);
    if (!found) {
      console.error('Missing testid for SKU:', item.sku);
      foundAllSkus = false;
    }
    if (item.stock_status === 'in_stock') inStockCount++;
    if (item.stock_status === 'low_stock') lowStockCount++;
    if (item.stock_status === 'sold_out') soldOutCount++;
  }

  console.log('All 26 SKUs verified in rendered HTML:', foundAllSkus);
  console.log(`Counts: in_stock = ${inStockCount} (expected 17), low_stock = ${lowStockCount} (expected 5), sold_out = ${soldOutCount} (expected 4)`);

  // Verify sold-out EU sizes: 35.5, 44, 50, 50.5
  const soldOutSkus = inventory.filter(i => i.stock_status === 'sold_out').map(i => i.size_eu);
  console.log(`Sold out EU sizes in JSON: ${soldOutSkus.join(', ')} (expected 35.5, 44, 50, 50.5)`);

  // Verify low-stock EU sizes: 36, 42.5, 43, 45, 49.5
  const lowStockSkus = inventory.filter(i => i.stock_status === 'low_stock').map(i => i.size_eu);
  console.log(`Low stock EU sizes in JSON: ${lowStockSkus.join(', ')} (expected 36, 42.5, 43, 45, 49.5)`);

  // Check disabled attribute on sold out tiles
  let allSoldOutDisabled = true;
  for (const item of inventory.filter(i => i.stock_status === 'sold_out')) {
    const regex1 = new RegExp(`<button[^>]*data-testid="size-option-${item.sku}"[^>]*disabled`, 'i');
    const regex2 = new RegExp(`<button[^>]*disabled[^>]*data-testid="size-option-${item.sku}"`, 'i');
    const isDisabled = regex1.test(rawHtml) || regex2.test(rawHtml);
    if (!isDisabled) {
      console.error('Sold out SKU not disabled in HTML:', item.sku);
      allSoldOutDisabled = false;
    }
  }
  console.log('All sold-out buttons disabled in HTML:', allSoldOutDisabled);

  // Check low stock labels
  let allLowStockLabelled = true;
  for (const item of inventory.filter(i => i.stock_status === 'low_stock')) {
    const label = `Only ${item.stock_quantity} left`;
    if (!cleanHtml.includes(label)) {
      console.error(`Missing low stock label "${label}" for SKU: ${item.sku}`);
      allLowStockLabelled = false;
    }
  }
  console.log('All low-stock labels present with exact quantities:', allLowStockLabelled);
}

test().catch(console.error);
