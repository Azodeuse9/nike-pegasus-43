import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const evidenceDir = path.resolve('performance-evidence');

if (!fs.existsSync(evidenceDir)) {
  fs.mkdirSync(evidenceDir, { recursive: true });
}

async function runAudit() {
  console.log('===============================================================');
  console.log('NIKE PEGASUS 43 — SLOW 4G CONTINUOUS PERFORMANCE AUDIT');
  console.log('===============================================================\n');

  // --- 1. VERIFY SPEED BUDGET SPECIFICATION ---
  const budgetPath = 'speed-budget.json';
  const budget = JSON.parse(fs.readFileSync(budgetPath, 'utf8'));
  console.log('Target Performance Budget (speed-budget.json):');
  console.log(JSON.stringify(budget, null, 2));

  // --- 2. LAUNCH BROWSER & CONFIGURE EXACT SLOW 4G CDP PROFILE ---
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Viewport: 375 × 812 CSS px, DPR: 3, Mobile: enabled
  await page.setViewport({
    width: 375,
    height: 812,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });

  const client = await page.target().createCDPSession();

  // Exact Slow 4G CDP profile settings:
  // Latency: 562.5ms, Download: 1474.56 Kbps, Upload: 675 Kbps, CPU: 4x slowdown
  const slow4gConfig = {
    offline: false,
    latency: 562.5, // 562.5 ms
    downloadThroughput: (1474.56 * 1024) / 8, // 1474.56 Kbps = 188,743.68 bytes/sec
    uploadThroughput: (675 * 1024) / 8, // 675 Kbps = 86,400 bytes/sec
  };

  await client.send('Network.enable');
  await client.send('Network.emulateNetworkConditions', slow4gConfig);
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  console.log('\nConfigured Chrome DevTools Protocol Settings:');
  console.log('- Viewport: 375 × 812 (DPR: 3, Mobile emulation: true)');
  console.log(`- Network latency: ${slow4gConfig.latency} ms`);
  console.log(`- Download throughput: 1474.56 Kbps (${slow4gConfig.downloadThroughput} bytes/sec)`);
  console.log(`- Upload throughput: 675 Kbps (${slow4gConfig.uploadThroughput} bytes/sec)`);
  console.log('- CPU slowdown: 4x\n');

  // --- 3. INJECT CONTINUOUS RAF + PERFORMANCE OBSERVER TRACKING ---
  await page.evaluateOnNewDocument(() => {
    window.__clsScore = 0;
    window.__layoutShifts = [];
    window.__longTasks = [];
    window.__gridTracking = {
      firstY: null,
      lastY: null,
      positions: [], // Array of { time, y } for EVERY requestAnimationFrame
      maxY: null,
      minY: null,
      maxDisplacement: 0,
      rafCount: 0,
    };

    // Cumulative Layout Shift tracking
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          window.__clsScore += entry.value;
          window.__layoutShifts.push({
            value: entry.value,
            time: entry.startTime,
            sources: entry.sources ? entry.sources.map(s => s.node?.nodeName || 'unknown') : [],
          });
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });

    // Long Task tracking (>50ms)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.duration > 50) {
          window.__longTasks.push({
            duration: entry.duration,
            startTime: entry.startTime,
            name: entry.name,
          });
        }
      }
    }).observe({ type: 'longtask', buffered: true });

    // Continuous requestAnimationFrame tracking from first appearance
    function trackSizeGrid() {
      const grid = document.querySelector('[data-testid="size-grid"]');
      if (grid) {
        const rect = grid.getBoundingClientRect();
        const currentY = rect.top + window.scrollY;
        const t = performance.now();
        const tr = window.__gridTracking;

        if (tr.firstY === null) {
          tr.firstY = currentY;
          tr.minY = currentY;
          tr.maxY = currentY;
        } else {
          if (currentY < tr.minY) tr.minY = currentY;
          if (currentY > tr.maxY) tr.maxY = currentY;
          tr.maxDisplacement = Math.max(tr.maxDisplacement, Math.abs(currentY - tr.firstY));
        }
        tr.lastY = currentY;
        tr.positions.push({
          frame: tr.rafCount,
          time: Math.round(t * 10) / 10,
          y: Math.round(currentY * 100) / 100,
        });
      }
      window.__gridTracking.rafCount++;
      window.__rafHandle = requestAnimationFrame(trackSizeGrid);
    }

    window.__rafHandle = requestAnimationFrame(trackSizeGrid);
  });

  // --- 4. START REAL CHROME PERFORMANCE TRACE ---
  console.log('Starting Chrome DevTools Performance Trace...');
  const traceEvents = [];
  await client.send('Tracing.start', {
    categories: 'devtools.timeline,blink.user_timing,v8.execute,disabled-by-default-devtools.timeline,disabled-by-default-devtools.timeline.frame',
    transferMode: 'ReportEvents',
  });
  client.on('Tracing.dataCollected', (event) => {
    traceEvents.push(...event.value);
  });

  // Navigate to target under Slow 4G + 4x CPU slowdown
  console.log('Navigating to http://localhost:3000...');
  const navStart = Date.now();
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  const dclTime = Date.now() - navStart;
  console.log(`- DOMContentLoaded reached in ${dclTime} ms`);

  // Wait for all assets (fonts, images, chunks) to completely load over Slow 4G
  await page.waitForNetworkIdle({ idleTime: 1000, timeout: 35000 }).catch(() => {
    console.log('- Network idle wait timed out, continuing with loaded content...');
  });
  const fullLoadTime = Date.now() - navStart;
  console.log(`- Page load fully settled in ${fullLoadTime} ms`);

  // Execute interactive scroll under 4x CPU slowdown to test real frame rendering
  console.log('Executing bidirectional scroll interaction under 4x CPU slowdown...');
  await page.evaluate(async () => {
    for (let y = 0; y <= 600; y += 25) {
      window.scrollTo(0, y);
      await new Promise(r => requestAnimationFrame(r));
    }
    for (let y = 600; y >= 0; y -= 25) {
      window.scrollTo(0, y);
      await new Promise(r => requestAnimationFrame(r));
    }
  });

  // Stop RAF tracking in page
  await page.evaluate(() => {
    if (window.__rafHandle) cancelAnimationFrame(window.__rafHandle);
  });

  // Stop Chrome DevTools Performance Trace
  await new Promise((resolve) => {
    client.on('Tracing.tracingComplete', resolve);
    client.send('Tracing.end');
  });

  // Save the real performance trace file
  const traceFilename = 'chrome-performance-trace.json';
  const traceFilePath = path.join(evidenceDir, traceFilename);
  fs.writeFileSync(traceFilePath, JSON.stringify({ traceEvents }, null, 2));
  console.log(`✓ Performance trace saved to: performance-evidence/${traceFilename}`);
  console.log(`✓ Total trace events collected: ${traceEvents.length}`);

  // --- 5. EXTRACT CONTINUOUS LAYOUT STABILITY RESULTS ---
  const trackingData = await page.evaluate(() => ({
    tracking: window.__gridTracking,
    cls: window.__clsScore,
    layoutShifts: window.__layoutShifts,
    longTasks: window.__longTasks,
  }));

  const { tracking, cls, longTasks } = trackingData;

  console.log('\n=== CONTINUOUS LAYOUT STABILITY RESULTS ===');
  console.log(`- Continuous RAF frames measured: ${tracking.positions.length}`);
  console.log(`- First observed Y position: ${tracking.firstY}px`);
  console.log(`- Final Y position: ${tracking.lastY}px`);
  console.log(`- Minimum recorded Y position: ${tracking.minY}px`);
  console.log(`- Maximum recorded Y position: ${tracking.maxY}px`);
  console.log(`- Maximum vertical displacement: ${tracking.maxDisplacement}px`);
  console.log(`- Cumulative Layout Shift (CLS): ${cls.toFixed(4)}`);
  console.log(`- Layout stability verdict: ${tracking.maxDisplacement <= budget.size_grid_shift_px_max ? '✓ PASS' : '✗ FAIL'}`);

  if (tracking.positions.length > 0) {
    console.log('\nSample continuous measurements (first 5, middle 3, last 5 frames):');
    const samples = [
      ...tracking.positions.slice(0, 5),
      ...tracking.positions.slice(Math.floor(tracking.positions.length / 2) - 1, Math.floor(tracking.positions.length / 2) + 2),
      ...tracking.positions.slice(-5),
    ];
    samples.forEach(s => console.log(`  Frame #${s.frame} at ${s.time}ms: Y = ${s.y}px`));
  }

  // --- 6. AUDIT SIZE BUTTONS & ALL 26 INVENTORY VARIANTS ---
  console.log('\n=== SIZE SELECTOR & 26 INVENTORY VARIANTS AUDIT ===');
  const inventory = JSON.parse(fs.readFileSync('Pegasus 43 size and stock list.json', 'utf8'));

  // Expand to check all 26 buttons
  const toggleBtn = await page.$('[data-testid="toggle-all-sizes"]');
  if (toggleBtn) {
    await toggleBtn.click();
    await new Promise(r => setTimeout(r, 400));
  }

  const buttonMetrics = await page.evaluate((expectedVariants) => {
    const results = [];
    for (const v of expectedVariants) {
      const el = document.querySelector(`[data-testid="size-option-${v.sku}"]`);
      const button = el ? (el.tagName === 'BUTTON' ? el : el.closest('button')) : null;
      if (!button) {
        results.push({ sku: v.sku, found: false });
        continue;
      }

      const rect = button.getBoundingClientRect();
      const isSoldOut = v.stock_status === 'sold_out';
      const disabled = button.disabled;
      const ariaDisabled = button.getAttribute('aria-disabled') === 'true';

      results.push({
        sku: v.sku,
        found: true,
        size_eu: v.size_eu,
        stock_status: v.stock_status,
        isSoldOut,
        disabledInDom: disabled || ariaDisabled,
        width: Math.round(rect.width * 100) / 100,
        height: Math.round(rect.height * 100) / 100,
        meetsMin44: rect.width >= 44 && rect.height >= 44,
      });
    }
    return results;
  }, inventory);

  const missing = buttonMetrics.filter(b => !b.found);
  const sizeFailures = buttonMetrics.filter(b => b.found && !b.meetsMin44);
  const soldOutUnchecked = buttonMetrics.filter(b => b.found && b.isSoldOut && !b.disabledInDom);

  console.log(`Total variants audited: ${buttonMetrics.length} / 26`);
  console.log(`- All variants present in DOM: ${missing.length === 0 ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`- All ${inventory.filter(v => v.stock_status === 'sold_out').length} sold-out sizes disabled: ${soldOutUnchecked.length === 0 ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`- All 26 buttons >= 44x44 CSS px: ${sizeFailures.length === 0 ? '✓ PASS' : '✗ FAIL'}`);

  const minW = Math.min(...buttonMetrics.map(b => b.width));
  const minH = Math.min(...buttonMetrics.map(b => b.height));
  console.log(`  Minimum button dimension found: ${minW}px width × ${minH}px height`);

  // --- 7. GALLERY VISUAL CHECK ---
  console.log('\n=== GALLERY VISUAL CHECK ===');
  const galleryMetrics = await page.evaluate(() => {
    const mainPhoto = document.querySelector('[data-testid="main-photo"]');
    const photoRect = mainPhoto?.getBoundingClientRect();
    const wrapper = mainPhoto?.querySelector('.relative.w-\\[90\\%\\].h-\\[90\\%\\]') || mainPhoto?.querySelector('img')?.parentElement;
    const wrapperRect = wrapper?.getBoundingClientRect();
    const img = mainPhoto?.querySelector('img');

    const cImg = img ? window.getComputedStyle(img) : null;
    const cPhoto = mainPhoto ? window.getComputedStyle(mainPhoto) : null;

    return {
      cardWidth: photoRect ? Math.round(photoRect.width) : null,
      cardHeight: photoRect ? Math.round(photoRect.height) : null,
      wrapperWidth: wrapperRect ? Math.round(wrapperRect.width) : null,
      wrapperHeight: wrapperRect ? Math.round(wrapperRect.height) : null,
      scaleRatio: wrapperRect && photoRect ? (wrapperRect.width / photoRect.width).toFixed(3) : null,
      imgSrc: img?.src,
      imgFilter: cImg?.filter,
      imgBoxShadow: cImg?.boxShadow,
      galleryBg: cPhoto?.backgroundColor,
    };
  });

  console.log(`- Gallery card dimensions: ${galleryMetrics.cardWidth}px × ${galleryMetrics.cardHeight}px`);
  console.log(`- Image wrapper dimensions: ${galleryMetrics.wrapperWidth}px × ${galleryMetrics.wrapperHeight}px`);
  console.log(`- Image scale ratio: ${galleryMetrics.scaleRatio} (Target: 0.900 / 90%)`);
  console.log(`- Source format: ${galleryMetrics.imgSrc?.includes('.png') ? '✓ Transparent PNG' : '✗ Non-PNG'}`);
  console.log(`- CSS filter: ${galleryMetrics.imgFilter} (${galleryMetrics.imgFilter === 'none' ? '✓ None' : '✗ Has filter'})`);
  console.log(`- CSS box-shadow: ${galleryMetrics.imgBoxShadow} (${galleryMetrics.imgBoxShadow === 'none' ? '✓ None' : '✗ Has shadow'})`);
  console.log(`- Background: ${galleryMetrics.galleryBg} (#F1F1F1)`);

  // --- 8. TRACE FRAME DATA & DROPPED FRAMES ANALYSIS ---
  console.log('\n=== PERFORMANCE TRACE FRAME ANALYSIS ===');
  console.log(`- Total trace events: ${traceEvents.length}`);

  // Frame event filtering from Chrome trace
  const beginFrameEvents = traceEvents.filter(e => e.name === 'BeginFrame');
  const drawFrameEvents = traceEvents.filter(e => e.name === 'DrawFrame');
  const droppedFrameEvents = traceEvents.filter(e =>
    e.name === 'DroppedFrame' ||
    (e.name === 'PipelineReporter' && e.args && e.args.state === 'Dropped')
  );
  const frameEvents = traceEvents.filter(e => e.name.toLowerCase().includes('frame'));

  console.log(`- BeginFrame events recorded: ${beginFrameEvents.length}`);
  console.log(`- DrawFrame events recorded: ${drawFrameEvents.length}`);
  console.log(`- Total frame-related trace events: ${frameEvents.length}`);
  console.log(`- Dropped frame events in trace: ${droppedFrameEvents.length}`);

  // Long tasks analysis
  console.log(`- Long tasks (>50ms) during run: ${longTasks.length}`);
  longTasks.forEach((t, i) => {
    console.log(`  Long Task ${i + 1}: ${Math.round(t.duration)}ms at ${Math.round(t.startTime)}ms`);
  });

  // Save audit summary
  const summaryReport = {
    timestamp: new Date().toISOString(),
    speedBudget: budget,
    cdpProfile: {
      viewport: '375x812',
      dpr: 3,
      mobile: true,
      latencyMs: slow4gConfig.latency,
      downloadKbps: 1474.56,
      uploadKbps: 675,
      cpuSlowdown: '4x',
    },
    continuousLayoutStability: {
      rafFramesMeasured: tracking.positions.length,
      firstObservedY: tracking.firstY,
      finalY: tracking.lastY,
      minY: tracking.minY,
      maxY: tracking.maxY,
      maxVerticalDisplacementPx: tracking.maxDisplacement,
      cls: cls,
      pass: tracking.maxDisplacement <= budget.size_grid_shift_px_max,
      positionsSample: tracking.positions.slice(0, 20),
    },
    sizeSelector: {
      variantsChecked: buttonMetrics.length,
      allPresent: missing.length === 0,
      allSoldOutDisabled: soldOutUnchecked.length === 0,
      allButtonsMeetMin44px: sizeFailures.length === 0,
      minButtonWidth: minW,
      minButtonHeight: minH,
    },
    galleryVisual: galleryMetrics,
    traceAnalysis: {
      traceFile: `performance-evidence/${traceFilename}`,
      totalEvents: traceEvents.length,
      beginFrameCount: beginFrameEvents.length,
      drawFrameCount: drawFrameEvents.length,
      droppedFrameCount: droppedFrameEvents.length,
      longTasksCount: longTasks.length,
      longTasks: longTasks,
    },
  };

  const summaryFilePath = path.join(evidenceDir, 'audit-summary.json');
  fs.writeFileSync(summaryFilePath, JSON.stringify(summaryReport, null, 2));
  console.log(`✓ Audit summary saved to: performance-evidence/audit-summary.json`);

  await browser.close();

  console.log('\n===============================================================');
  console.log('AUDIT COMPLETED SUCCESSFULLY');
  console.log('===============================================================');
}

runAudit().catch(err => {
  console.error('Audit encountered error:', err);
  process.exit(1);
});
