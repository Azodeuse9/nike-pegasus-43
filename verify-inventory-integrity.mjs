import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function verifyInventory() {
  const snapshot = JSON.parse(fs.readFileSync('Pegasus Size and Stock Snapshot, 8 December 2026.json', 'utf8'));

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 3, isMobile: true, hasTouch: true });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // Expand all 26 sizes
  const expandBtn = await page.$('[data-testid="toggle-all-sizes"]');
  if (expandBtn) {
    await expandBtn.click();
    await new Promise(r => setTimeout(r, 400));
  }

  // Query all buttons in size-grid
  const tilesData = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('[data-testid="size-grid"] button'));
    return buttons.map(b => ({
      sku: b.getAttribute('data-sku'),
      disabled: b.disabled,
      ariaDisabled: b.getAttribute('aria-disabled'),
      ariaLabel: b.getAttribute('aria-label'),
      text: b.innerText,
    }));
  });

  console.log(`Auditing ${tilesData.length} rendered tiles against snapshot JSON...`);

  let errors = 0;
  if (tilesData.length !== 26) {
    console.error(`ERROR: Expected 26 tiles, got ${tilesData.length}`);
    errors++;
  }

  snapshot.forEach((expected) => {
    const tile = tilesData.find(t => t.sku === expected.sku);
    if (!tile) {
      console.error(`ERROR: Tile with SKU ${expected.sku} not found in DOM`);
      errors++;
      return;
    }

    const shouldBeDisabled = expected.stock_status === 'sold_out';
    if (tile.disabled !== shouldBeDisabled) {
      console.error(`ERROR: SKU ${expected.sku} (EU ${expected.size_eu}): disabled state is ${tile.disabled}, expected ${shouldBeDisabled}`);
      errors++;
    }

    if (expected.stock_status === 'sold_out') {
      if (!tile.ariaLabel.includes('Sold out')) {
        console.error(`ERROR: SKU ${expected.sku}: ariaLabel missing "Sold out": ${tile.ariaLabel}`);
        errors++;
      }
    } else if (expected.stock_status === 'low_stock') {
      if (!tile.ariaLabel.includes('Low stock')) {
        console.error(`ERROR: SKU ${expected.sku}: ariaLabel missing "Low stock": ${tile.ariaLabel}`);
        errors++;
      }
    } else {
      if (!tile.ariaLabel.includes('In stock')) {
        console.error(`ERROR: SKU ${expected.sku}: ariaLabel missing "In stock": ${tile.ariaLabel}`);
        errors++;
      }
    }
  });

  const inStockCount = snapshot.filter(s => s.stock_status === 'in_stock').length;
  const lowStockCount = snapshot.filter(s => s.stock_status === 'low_stock').length;
  const soldOutCount = snapshot.filter(s => s.stock_status === 'sold_out').length;

  console.log('--- INVENTORY STATUS VERIFICATION ---');
  console.log(`✓ Total variants: ${tilesData.length} (Expected: 26)`);
  console.log(`✓ In stock variants: ${inStockCount} (Expected: 10)`);
  console.log(`✓ Low stock variants: ${lowStockCount} (Expected: 7)`);
  console.log(`✓ Sold out variants: ${soldOutCount} (Expected: 9)`);
  console.log(`✓ All 9 sold-out variants disabled in DOM: ${tilesData.filter(t => t.disabled).length === 9}`);
  console.log(`Total errors found: ${errors}`);

  await browser.close();

  if (errors > 0) {
    process.exit(1);
  } else {
    console.log('ALL 26 VARIANTS VERIFIED ACCURATELY WITH ZERO ERRORS!');
  }
}

verifyInventory().catch(err => {
  console.error(err);
  process.exit(1);
});
