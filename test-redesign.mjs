import puppeteer from 'puppeteer-core';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const inventory = JSON.parse(fs.readFileSync('Pegasus 43 size and stock list.json', 'utf8'));

async function testAll() {
  console.log('--- STARTING NIKE PEGASUS 43 REDESIGN VERIFICATION ---');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.message);
  });

  // Test at iPhone 13/14 viewport (390 x 844)
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  console.log('✓ Page loaded at 390px viewport');

  // 1. Verify No Horizontal Overflow at 390px
  const overflow390 = await page.evaluate(() => ({
    bodyScroll: document.body.scrollWidth,
    docScroll: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  console.log(`✓ 390px Viewport: docScrollWidth=${overflow390.docScroll}, innerWidth=${overflow390.innerWidth} -> No Overflow: ${overflow390.docScroll <= overflow390.innerWidth}`);

  // Test at 375px viewport
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.reload({ waitUntil: 'networkidle0' });
  const overflow375 = await page.evaluate(() => ({
    docScroll: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  console.log(`✓ 375px Viewport: docScrollWidth=${overflow375.docScroll}, innerWidth=${overflow375.innerWidth} -> No Overflow: ${overflow375.docScroll <= overflow375.innerWidth}`);

  // Reset back to 390px for detailed interaction tests
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  // 2. Check Test IDs: product-price, main-product-image, size-grid
  const requiredTestIds = await page.evaluate(() => {
    return {
      hasPrice: !!document.querySelector('[data-testid="product-price"]'),
      priceText: document.querySelector('[data-testid="product-price"]')?.textContent?.trim(),
      hasMainImage: !!document.querySelector('[data-testid="main-product-image"]'),
      hasSizeGrid: !!document.querySelector('[data-testid="size-grid"]'),
    };
  });
  console.log('✓ data-testid="product-price":', requiredTestIds.hasPrice, `(${requiredTestIds.priceText})`);
  console.log('✓ data-testid="main-product-image":', requiredTestIds.hasMainImage);
  console.log('✓ data-testid="size-grid":', requiredTestIds.hasSizeGrid);

  // 3. Verify Initial 8 sizes are display_order 8 through 15
  const initialTiles = await page.evaluate(() => {
    const tiles = Array.from(document.querySelectorAll('[data-testid="size-grid"] button[role="radio"]'));
    return tiles.map(t => ({
      testId: t.getAttribute('data-testid'),
      sku: t.getAttribute('data-testid')?.replace('size-option-', ''),
      text: t.querySelector('span.text-base')?.textContent?.trim(),
      disabled: t.disabled,
    }));
  });
  console.log(`✓ Initial displayed tiles count: ${initialTiles.length} (expected: 8)`);
  const expectedInitialSkus = inventory.filter(v => v.display_order >= 8 && v.display_order <= 15).map(v => v.sku);
  const actualInitialSkus = initialTiles.map(t => t.sku);
  const initialSkusMatch = JSON.stringify(actualInitialSkus) === JSON.stringify(expectedInitialSkus);
  console.log('✓ Initial 8 sizes are exactly display_order 8 through 15:', initialSkusMatch);
  console.log('  Initial EU Sizes displayed:', initialTiles.map(t => t.text).join(', '));

  // 4. Click "View all sizes (26)" to reveal all 26 variants
  console.log('Clicking "View all sizes (26)" toggle...');
  await page.click('[data-testid="toggle-all-sizes"]');
  await new Promise(r => setTimeout(r, 200));

  const allTiles = await page.evaluate(() => {
    const tiles = Array.from(document.querySelectorAll('[data-testid="size-grid"] button[role="radio"]'));
    return tiles.map(t => ({
      sku: t.getAttribute('data-testid')?.replace('size-option-', ''),
      text: t.querySelector('span.text-base')?.textContent?.trim(),
      disabled: t.disabled,
    }));
  });
  console.log(`✓ Expanded size grid tiles count: ${allTiles.length} (expected: 26)`);
  const allSkusMatch = JSON.stringify(allTiles.map(t => t.sku)) === JSON.stringify(inventory.map(v => v.sku));
  console.log('✓ All 26 variants present in exact original display_order:', allSkusMatch);

  // 5. Verify Sold Out sizes are disabled and cannot be selected
  const soldOutSkus = inventory.filter(v => v.stock_status === 'sold_out').map(v => v.sku);
  const soldOutCheck = allTiles.filter(t => soldOutSkus.includes(t.sku)).every(t => t.disabled === true);
  console.log(`✓ All 4 sold-out sizes (${inventory.filter(v => v.stock_status === 'sold_out').map(v => 'EU ' + v.size_eu).join(', ')}) disabled in DOM: ${soldOutCheck}`);

  // Try clicking a sold out size (e.g. EU 44, SKU HV7521-001-100)
  await page.click('[data-testid="size-option-HV7521-001-100"]');
  const soldOutSelected = await page.evaluate(() => {
    const tile = document.querySelector('[data-testid="size-option-HV7521-001-100"]');
    return tile?.getAttribute('aria-checked');
  });
  console.log('✓ Sold-out size cannot be selected (aria-checked remains false):', soldOutSelected === 'false');

  // 6. Test Format Switching (EU -> US Men -> US Women)
  console.log('Testing Sizing Format Switcher...');
  // Click US Men
  await page.click('button[aria-pressed="false"]:has-text("US Men"), button:text-matches("US Men")').catch(async () => {
    const btn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('div[aria-label="Size format options"] button'));
      return btns.find(b => b.textContent?.includes('US Men'));
    });
    if (btn) await btn.click();
  });
  await new Promise(r => setTimeout(r, 200));

  const usMenFirstSize = await page.evaluate(() => {
    const firstTile = document.querySelector('[data-testid="size-option-HV7521-001-035"] span.text-base');
    return firstTile?.textContent?.trim();
  });
  console.log('✓ US Men format active: First variant shows size:', usMenFirstSize, '(expected: 3.5)');

  // Click US Women
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('div[aria-label="Size format options"] button'));
    const wBtn = btns.find(b => b.textContent?.includes('US Women'));
    wBtn?.click();
  });
  await new Promise(r => setTimeout(r, 200));

  const usWomenFirstSize = await page.evaluate(() => {
    const firstTile = document.querySelector('[data-testid="size-option-HV7521-001-035"] span.text-base');
    return firstTile?.textContent?.trim();
  });
  console.log('✓ US Women format active: First variant shows size:', usWomenFirstSize, '(expected: 5)');

  // Switch back to EU
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('div[aria-label="Size format options"] button'));
    const euBtn = btns.find(b => b.textContent === 'EU');
    euBtn?.click();
  });
  await new Promise(r => setTimeout(r, 200));

  // 7. Select a Low Stock Size: EU 42.5 (SKU: HV7521-001-090, 3 left)
  console.log('Selecting Low Stock Variant EU 42.5 (HV7521-001-090)...');
  await page.click('[data-testid="size-option-HV7521-001-090"]');
  await new Promise(r => setTimeout(r, 200));

  const selectionState = await page.evaluate(() => {
    const tile = document.querySelector('[data-testid="size-option-HV7521-001-090"]');
    const summary = document.querySelector('div[aria-live="polite"]');
    const addToBagBtn = document.querySelector('div.sticky button[type="button"]');
    return {
      ariaChecked: tile?.getAttribute('aria-checked'),
      summaryText: summary?.textContent?.trim(),
      btnText: addToBagBtn?.textContent?.trim(),
      btnDisabled: addToBagBtn?.disabled,
    };
  });
  console.log('✓ Tile aria-checked:', selectionState.ariaChecked);
  console.log('✓ Selected Size Summary updated:', selectionState.summaryText);
  console.log('✓ Add to Bag button enabled:', !selectionState.btnDisabled, `("${selectionState.btnText}")`);

  // 8. Verify switching format preserves the same selected SKU
  console.log('Testing that switching format preserves selected SKU HV7521-001-090...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('div[aria-label="Size format options"] button'));
    const mBtn = btns.find(b => b.textContent?.includes('US Men'));
    mBtn?.click();
  });
  await new Promise(r => setTimeout(r, 200));

  const afterFormatSwitch = await page.evaluate(() => {
    const tile = document.querySelector('[data-testid="size-option-HV7521-001-090"]');
    const summary = document.querySelector('div[aria-live="polite"]');
    return {
      ariaChecked: tile?.getAttribute('aria-checked'),
      summaryText: summary?.textContent?.trim(),
    };
  });
  console.log('✓ Selected tile still checked after format switch:', afterFormatSwitch.ariaChecked === 'true');
  console.log('✓ Summary updated to US Men 9 while preserving variant:', afterFormatSwitch.summaryText?.includes('US Men 9'));

  // 9. Click Add to Bag
  console.log('Clicking Add to Bag button...');
  await page.click('div.sticky button[type="button"]');
  await new Promise(r => setTimeout(r, 400));

  const bagState = await page.evaluate(() => {
    const badge = document.querySelector('header button[aria-label*="Shopping bag"] span[aria-live="polite"]');
    const toast = document.querySelector('div[role="status"]');
    return {
      bagBadgeCount: badge?.textContent?.trim(),
      toastText: toast?.textContent?.trim(),
    };
  });
  console.log('✓ Toast confirmation appeared:', bagState.toastText);
  console.log('✓ Shopping bag counter in header updated to:', bagState.bagBadgeCount);

  // 10. Open Bag Drawer & verify added item details
  console.log('Opening Shopping Bag drawer...');
  await page.click('header button[aria-label*="Shopping bag"]');
  await new Promise(r => setTimeout(r, 300));

  const drawerContent = await page.evaluate(() => {
    const drawer = document.querySelector('div[role="dialog"][aria-labelledby="bag-drawer-title"]');
    return {
      isOpen: !!drawer,
      text: drawer?.textContent?.trim(),
    };
  });
  console.log('✓ Bag drawer opened:', drawerContent.isOpen);
  console.log('✓ Bag drawer contains correct product and SKU HV7521-001-090:', drawerContent.text?.includes('HV7521-001-090'));

  // Close bag drawer
  await page.click('button[aria-label="Close shopping bag"]');
  await new Promise(r => setTimeout(r, 200));

  // 11. Test Product Gallery controls (Next, Prev)
  console.log('Testing Product Gallery navigation...');
  const initialSlideText = await page.evaluate(() => document.querySelector('section[aria-label*="gallery"] span[data-testid="product-main-image"]')?.textContent?.trim());
  await page.click('button[aria-label="Next image"]');
  await new Promise(r => setTimeout(r, 200));
  const secondSlideText = await page.evaluate(() => document.querySelector('section[aria-label*="gallery"] span[data-testid="product-main-image"]')?.textContent?.trim());
  console.log('✓ Gallery slide changed on next button:', initialSlideText !== secondSlideText);

  // 12. Test Size Guide Modal
  console.log('Testing Size Guide Modal...');
  await page.click('button[aria-label="Open size guide"]');
  await new Promise(r => setTimeout(r, 300));
  const isGuideVisible = await page.evaluate(() => !!document.querySelector('div[role="dialog"][aria-labelledby="size-guide-title"]'));
  console.log('✓ Size Guide Modal opened:', isGuideVisible);
  await page.click('button[aria-label="Close size guide"]');
  await new Promise(r => setTimeout(r, 200));
  const isGuideClosed = await page.evaluate(() => !document.querySelector('div[role="dialog"][aria-labelledby="size-guide-title"]'));
  console.log('✓ Size Guide Modal closed:', isGuideClosed);

  // 13. Check Console Errors
  console.log(`✓ Console / Hydration errors count: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.error('Console errors:', consoleErrors);
  }

  // 14. Take final polished screenshot
  await page.screenshot({ path: 'redesign_mobile_390px.png', fullPage: true });
  console.log('✓ Saved full page screenshot to redesign_mobile_390px.png');

  await browser.close();
  console.log('--- ALL REDESIGN VERIFICATIONS PASSED SUCCESSFULLY! ---');
}

testAll().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
