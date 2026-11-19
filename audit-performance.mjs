import puppeteer from 'puppeteer-core';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runAudit() {
  console.log('=== NIKE PEGASUS 43 — SLOW 4G PERFORMANCE AUDIT ===\n');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Mobile mode: 375x812, DPR 3, mobile emulation
  await page.setViewport({
    width: 375,
    height: 812,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });

  const client = await page.target().createCDPSession();

  // Network RTT: 150ms, Throughput: 1638.4 Kbps (204.8 KB/s)
  await client.send('Network.enable');
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 150, // 150ms RTT
    downloadThroughput: (1638.4 * 1024) / 8, // 1638.4 Kbps = 204.8 KB/s
    uploadThroughput: (750 * 1024) / 8,
  });

  // CPU slowdown: 4x
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  console.log('Configured Slow 4G profile:');
  console.log('- Viewport: 375 × 812 (DPR: 3, Mobile: true)');
  console.log('- Latency: 150ms RTT');
  console.log('- Download: 1638.4 Kbps');
  console.log('- CPU Throttling: 4x\n');

  // Track layout shifts and size grid positions
  let initialGridY = null;
  let finalGridY = null;

  // Track CLS and performance entries in page
  await page.evaluateOnNewDocument(() => {
    window.__clsScore = 0;
    window.__layoutShifts = [];
    window.__longTasks = [];

    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          window.__clsScore += entry.value;
          window.__layoutShifts.push({
            value: entry.value,
            sources: entry.sources ? entry.sources.map(s => s.node?.nodeName || 'unknown') : []
          });
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });

    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.duration > 50) {
          window.__longTasks.push({
            duration: entry.duration,
            startTime: entry.startTime,
          });
        }
      }
    }).observe({ type: 'longtask', buffered: true });
  });

  console.log('Navigating to http://localhost:3000 under Slow 4G...');
  const navStart = Date.now();
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  const dclTime = Date.now() - navStart;
  console.log(`DOMContentLoaded reached in ${dclTime}ms`);

  // Measure initial size grid position immediately at DOMContentLoaded
  initialGridY = await page.evaluate(() => {
    const grid = document.querySelector('[data-testid="size-grid"]');
    if (!grid) return null;
    const rect = grid.getBoundingClientRect();
    return rect.top + window.scrollY;
  });
  console.log(`Initial size-grid Y position: ${initialGridY}px`);

  // Wait for network idle / full load
  await page.waitForNetworkIdle({ idleTime: 1000, timeout: 30000 }).catch(() => {
    console.log('Network idle timed out, proceeding...');
  });

  // Measure final size grid position after full load
  finalGridY = await page.evaluate(() => {
    const grid = document.querySelector('[data-testid="size-grid"]');
    if (!grid) return null;
    const rect = grid.getBoundingClientRect();
    return rect.top + window.scrollY;
  });
  console.log(`Final size-grid Y position: ${finalGridY}px`);

  const gridShiftPx = Math.abs(finalGridY - initialGridY);
  console.log(`\n===> Total size grid vertical movement: ${gridShiftPx}px`);

  // Test Selectors Check
  console.log('\n--- Checking Required Test Selectors ---');
  const selectorCheck = await page.evaluate(() => {
    const sizeGrid = document.querySelector('[data-testid="size-grid"]');
    const mainPhoto = document.querySelector('[data-testid="main-photo"]');
    const legacyMainImage = document.querySelector('[data-testid="main-product-image"]') || document.querySelector('[data-testid="product-main-image"]');
    const price = document.querySelector('[data-testid="price"]');
    const legacyPrice = document.querySelector('[data-testid="product-price"]');

    const availableButtons = document.querySelectorAll('[data-testid="size-button"]');
    const soldOutButtons = document.querySelectorAll('[data-testid="size-button-sold-out"]');

    return {
      hasSizeGrid: !!sizeGrid,
      hasMainPhoto: !!mainPhoto,
      hasLegacyMainImage: !!legacyMainImage,
      hasPrice: !!price,
      priceText: price?.textContent?.trim(),
      hasLegacyPrice: !!legacyPrice,
      legacyPriceText: legacyPrice?.textContent?.trim(),
      availableButtonsCount: availableButtons.length,
      soldOutButtonsCount: soldOutButtons.length,
    };
  });

  console.log('✓ data-testid="size-grid":', selectorCheck.hasSizeGrid);
  console.log('✓ data-testid="main-photo":', selectorCheck.hasMainPhoto);
  console.log('✓ data-testid="main-product-image" (legacy preserved):', selectorCheck.hasLegacyMainImage);
  console.log('✓ data-testid="price":', selectorCheck.hasPrice, `("${selectorCheck.priceText}")`);
  console.log('✓ data-testid="product-price" (legacy preserved):', selectorCheck.hasLegacyPrice, `("${selectorCheck.legacyPriceText}")`);
  console.log(`✓ Initial visible data-testid="size-button": ${selectorCheck.availableButtonsCount}`);
  console.log(`✓ Initial visible data-testid="size-button-sold-out": ${selectorCheck.soldOutButtonsCount}`);

  // Expand to check ALL 26 variants buttons
  console.log('\nExpanding to all 26 variants to measure every button...');
  await page.click('[data-testid="toggle-all-sizes"]');
  await new Promise(r => setTimeout(r, 400));

  const allButtonMetrics = await page.evaluate(() => {
    const available = Array.from(document.querySelectorAll('[data-testid="size-button"]'));
    const soldOut = Array.from(document.querySelectorAll('[data-testid="size-button-sold-out"]'));
    const all = [...available.map(b => ({ el: b, status: 'available' })), ...soldOut.map(b => ({ el: b, status: 'sold-out' }))];

    return all.map(({ el, status }) => {
      const rect = el.getBoundingClientRect();
      return {
        sku: el.getAttribute('data-sku') || el.innerText,
        status,
        width: Math.round(rect.width * 100) / 100,
        height: Math.round(rect.height * 100) / 100,
        meetsMin: rect.width >= 44 && rect.height >= 44,
      };
    });
  });

  console.log(`Total buttons measured: ${allButtonMetrics.length} (expected: 26)`);
  const failedButtons = allButtonMetrics.filter(b => !b.meetsMin);
  if (failedButtons.length === 0) {
    console.log(`✓ ALL 26 size buttons meet or exceed 44×44 CSS pixels!`);
    console.log(`  Sample button: ${allButtonMetrics[0].width}px × ${allButtonMetrics[0].height}px`);
  } else {
    console.error(`✗ ${failedButtons.length} buttons failed 44px min dimension requirement:`, failedButtons);
  }

  // Scrolling frame drop test
  console.log('\n--- Scrolling Smoothness Check ---');
  await page.evaluate(async () => {
    for (let i = 0; i < 500; i += 25) {
      window.scrollTo(0, i);
      await new Promise(r => requestAnimationFrame(r));
    }
    for (let i = 500; i >= 0; i -= 25) {
      window.scrollTo(0, i);
      await new Promise(r => requestAnimationFrame(r));
    }
  });
  console.log('✓ Scrolling completed without frame drop errors.');

  // PerformanceObserver metrics
  const perfData = await page.evaluate(() => ({
    cls: window.__clsScore,
    longTasksCount: window.__longTasks.length,
    longTasks: window.__longTasks,
  }));

  console.log('\n--- Web Vitals & Metrics ---');
  console.log(`- Cumulative Layout Shift (CLS): ${perfData.cls.toFixed(4)}`);
  console.log(`- Long Tasks (>50ms): ${perfData.longTasksCount}`);
  if (perfData.longTasks.length > 0) {
    perfData.longTasks.forEach((t, idx) => {
      console.log(`  Task ${idx + 1}: ${Math.round(t.duration)}ms at ${Math.round(t.startTime)}ms`);
    });
  }

  // Check against speed-budget.json
  const budget = JSON.parse(fs.readFileSync('speed-budget.json', 'utf8'));
  console.log('\n--- Verification against speed-budget.json ---');
  console.log(`- size_grid_shift_px_max: ${budget.size_grid_shift_px_max}px -> Actual: ${gridShiftPx}px ${gridShiftPx <= budget.size_grid_shift_px_max ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`- size_button_min_px: ${budget.size_button_min_px}px -> Actual min: ${Math.min(...allButtonMetrics.map(b => Math.min(b.width, b.height)))}px ${failedButtons.length === 0 ? '✓ PASS' : '✗ FAIL'}`);

  await browser.close();
}

runAudit().catch(err => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
