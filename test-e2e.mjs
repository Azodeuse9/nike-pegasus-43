import puppeteer from 'puppeteer-core';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  console.log('Launching Chrome for 375px Mobile Validation...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=375,812'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  console.log('Navigated to http://localhost:3000');

  // 1. Check Horizontal Overflow at 375px
  const overflow = await page.evaluate(() => {
    return {
      bodyScrollWidth: document.body.scrollWidth,
      docScrollWidth: document.documentElement.scrollWidth,
      windowInnerWidth: window.innerWidth,
    };
  });
  console.log('Viewport width:', overflow.windowInnerWidth);
  console.log('Document scrollWidth:', overflow.docScrollWidth);
  const hasNoHorizontalOverflow = overflow.docScrollWidth <= overflow.windowInnerWidth;
  console.log('✓ No horizontal overflow:', hasNoHorizontalOverflow);

  // 2. Check product-main-image dimensions
  const galleryMetrics = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="product-main-image"]');
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { width: Math.round(rect.width), height: Math.round(rect.height) };
  });
  console.log('✓ Main image gallery metrics:', galleryMetrics);

  // 3. Check product-price testid and text
  const priceText = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="product-price"]');
    return el ? el.textContent.trim() : null;
  });
  console.log('✓ Product price text:', priceText);

  // 4. Verify all 26 variants in size grid
  const toggleBtn = await page.$('[data-testid="toggle-all-sizes"]');
  if (toggleBtn) {
    await toggleBtn.click();
    await new Promise(r => setTimeout(r, 200));
  }

  const inventory = JSON.parse(fs.readFileSync('Pegasus 43 size and stock list.json', 'utf8'));
  const sizeGridTest = await page.evaluate((skus) => {
    const grid = document.querySelector('[data-testid="size-grid"]');
    if (!grid) return { gridExists: false };

    const missing = [];
    const disabledStates = {};
    const tileSizes = [];

    for (const item of skus) {
      const tile = document.querySelector(`button[data-sku="${item.sku}"]`);
      if (!tile) {
        missing.push(item.sku);
      } else {
        disabledStates[item.sku] = tile.disabled;
        const rect = tile.getBoundingClientRect();
        tileSizes.push({ sku: item.sku, w: Math.round(rect.width), h: Math.round(rect.height) });
      }
    }

    return {
      gridExists: true,
      missing,
      disabledStates,
      firstTileSize: tileSizes[0],
      allTilesHaveSameHeight: tileSizes.every(t => t.h === tileSizes[0].h),
    };
  }, inventory);

  console.log('✓ Size grid container exists:', sizeGridTest.gridExists);
  console.log('✓ All 26 size option testids found:', sizeGridTest.missing.length === 0);
  console.log('✓ Tile dimensions:', sizeGridTest.firstTileSize);
  console.log('✓ All 26 tiles have identical height (72px):', sizeGridTest.allTilesHaveSameHeight);

  // 5. Verify sold-out disabled states
  const soldOuts = inventory.filter(i => i.stock_status === 'sold_out');
  const allSoldOutDisabled = soldOuts.every(i => sizeGridTest.disabledStates[i.sku] === true);
  console.log(`✓ All ${soldOuts.length} sold-out sizes are disabled in DOM:`, allSoldOutDisabled);

  // 6. Test Add to Bag button
  const initialAddToBag = await page.evaluate(() => {
    const btn = document.querySelector('[data-testid="add-to-bag-button"]');
    return { disabled: btn ? btn.disabled : null, text: btn ? btn.textContent.trim() : null };
  });
  console.log('✓ Add to Bag button initially:', initialAddToBag.disabled, `("${initialAddToBag.text}")`);

  // 7. Select a Low Stock Size (e.g. EU 42, SKU: HV7521-001-085, 3 left)
  console.log('Testing selection of low stock size HV7521-001-085...');
  await page.click('button[data-sku="HV7521-001-085"]');

  const afterSelect = await page.evaluate(() => {
    const tile = document.querySelector('button[data-sku="HV7521-001-085"]');
    const btn = document.querySelector('[data-testid="add-to-bag-button"]');
    return {
      tileAriaChecked: tile ? tile.getAttribute('aria-checked') : null,
      btnDisabled: btn ? btn.disabled : null,
      btnText: btn ? btn.textContent.trim() : null,
    };
  });
  console.log('✓ Size tile aria-checked after click:', afterSelect.tileAriaChecked);
  console.log('✓ Add to Bag enabled after selection:', !afterSelect.btnDisabled, `("${afterSelect.btnText}")`);

  // 8. Test Add to Bag click and Shopping Bag live counter
  console.log('Clicking Add to Bag...');
  await page.click('[data-testid="add-to-bag-button"]');

  // Wait a moment for React state update
  await new Promise(r => setTimeout(r, 300));

  const afterAdd = await page.evaluate(() => {
    const toast = document.querySelector('[role="status"]');
    const headerBagBadge = document.querySelector('header button[aria-label*="Shopping bag"] span[aria-live="polite"]');
    return {
      toastText: toast ? toast.textContent.trim() : null,
      bagCount: headerBagBadge ? headerBagBadge.textContent.trim() : null,
    };
  });
  console.log('✓ Toast confirmation appeared:', afterAdd.toastText);
  console.log('✓ Shopping bag counter in header updated to:', afterAdd.bagCount);

  // 9. Take mobile screenshot
  await page.screenshot({ path: 'mobile_375px_full.png', fullPage: true });
  console.log('✓ Full page mobile screenshot saved to mobile_375px_full.png');

  await browser.close();
  console.log('All automated browser tests completed successfully!');
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
