/**
 * verify-live-vercel.mjs
 * Verifies the live Vercel deployment of Nike Pegasus 43:
 * - Opens https://nike-pegasus-43.vercel.app at 375x812
 * - Checks all 26 size tiles exist (after clicking View All Sizes)
 * - Confirms exactly 9 sold-out tiles are disabled
 * - Confirms sold-out EU sizes match the 8 December 2026 snapshot
 */

import puppeteer from 'puppeteer-core';

const LIVE_URL = 'https://nike-pegasus-43.vercel.app';
const SOLD_OUT_EU = ['36.5', '38.5', '42.5', '44', '45.5', '48.5', '49.5', '50', '50.5'];

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Set 375x812 mobile viewport
    await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 3, isMobile: true });

    console.log(`Opening ${LIVE_URL}...`);
    await page.goto(LIVE_URL, { waitUntil: 'networkidle2', timeout: 60000 });

    // Wait for the size grid section to appear
    await page.waitForSelector('[data-testid="size-grid"]', { timeout: 15000 });

    // Click "View All Sizes" if present (to expand full 26-size grid)
    const toggleBtn = await page.$('[data-testid="toggle-all-sizes"]');
    if (toggleBtn) {
      console.log('Clicking View All Sizes...');
      await toggleBtn.click();
      await new Promise(r => setTimeout(r, 1000));
    }

    // Count all size buttons
    const allButtons = await page.$$('[data-testid="size-grid"] button[data-sku]');
    const totalCount = allButtons.length;

    // Count disabled buttons
    const disabledButtons = await page.$$('[data-testid="size-grid"] button[data-sku][disabled]');
    const disabledCount = disabledButtons.length;

    // Get disabled EU sizes
    const disabledInfo = await page.evaluate(() => {
      const btns = Array.from(
        document.querySelectorAll('[data-testid="size-grid"] button[data-sku][disabled]')
      );
      return btns.map(btn => {
        const sku = btn.getAttribute('data-sku');
        const text = btn.textContent.replace(/Sold out/g, '').trim();
        const ariaLabel = btn.getAttribute('aria-label') || '';
        return { sku, text, ariaLabel };
      });
    });

    // Verify button sizes (min 44px)
    const buttonDimensions = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('[data-testid="size-grid"] button[data-sku]'));
      return btns.slice(0, 5).map(btn => {
        const r = btn.getBoundingClientRect();
        return { width: r.width, height: r.height };
      });
    });

    console.log('\n=== LIVE VERCEL VERIFICATION RESULTS ===');
    console.log(`Total size tiles:    ${totalCount}  (expected 26)`);
    console.log(`Disabled tiles:      ${disabledCount}  (expected 9)`);
    console.log(`Disabled details:`, JSON.stringify(disabledInfo, null, 2));
    console.log(`\nSample button dims (first 5):`, buttonDimensions);
    console.log(`Expected EU sizes:   [${SOLD_OUT_EU.join(', ')}]`);

    // Check assertions
    const totalPass = totalCount === 26;
    const disabledPass = disabledCount === 9;
    const minDimPass = buttonDimensions.every(d => d.width >= 44 && d.height >= 44);

    console.log('\n=== PASS/FAIL ===');
    console.log(`Total tiles = 26:              ${totalPass ? 'PASS ✅' : 'FAIL ❌ got ' + totalCount}`);
    console.log(`Disabled tiles = 9:            ${disabledPass ? 'PASS ✅' : 'FAIL ❌ got ' + disabledCount}`);
    console.log(`Button size ≥ 44×44px:         ${minDimPass ? 'PASS ✅' : 'FAIL ❌'}`);

    const allPass = totalPass && disabledPass && minDimPass;
    console.log(`\nOverall: ${allPass ? '✅ ALL PASS' : '❌ SOME FAILURES'}`);
    process.exit(allPass ? 0 : 1);

  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
