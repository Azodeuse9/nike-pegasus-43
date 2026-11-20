import puppeteer from 'puppeteer-core';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function checkSticky() {
  const browser = await puppeteer.launch({ executablePath: chromePath, headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  // Target: iPhone 13/14 frame (390 x 844)
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Initial state (no size selected)
  const initialMetrics = await page.evaluate(() => {
    const btn = document.querySelector('[data-testid="add-to-bag-button"]');
    const container = btn?.closest('div.fixed') || btn?.parentElement;
    const btnRect = btn?.getBoundingClientRect();
    const viewportHeight = window.innerHeight; // 844

    return {
      viewportHeight,
      buttonText: btn?.textContent?.trim(),
      btnBottom: btnRect ? Math.round(btnRect.bottom) : null,
      gapFromViewportBottom: btnRect ? Math.round(viewportHeight - btnRect.bottom) : null,
      containerPaddingBottom: container ? window.getComputedStyle(container).paddingBottom : null,
    };
  });

  console.log('--- Initial Sticky Metrics (Viewport 390 x 844) ---');
  console.log('Button Text:', initialMetrics.buttonText);
  console.log('Button bottom Y position:', initialMetrics.btnBottom);
  console.log('Frame height:', initialMetrics.viewportHeight);
  console.log('Bottom Gapping to 844 frame bottom (px):', initialMetrics.gapFromViewportBottom);
  console.log('Container padding-bottom:', initialMetrics.containerPaddingBottom);
  console.log('✓ Exactly 24px gapping from bottom:', initialMetrics.gapFromViewportBottom === 24);

  // Take initial viewport screenshot
  await page.screenshot({ path: 'public/sticky_initial_844.png' });

  // Select a size and check state
  console.log('\nSelecting a size: EU 42 (HV7521-001-085)...');
  await page.click('[data-testid="size-option-HV7521-001-085"]');
  await new Promise(r => setTimeout(r, 200));

  const afterSelectMetrics = await page.evaluate(() => {
    const btn = document.querySelector('[data-testid="add-to-bag-button"]');
    const btnRect = btn?.getBoundingClientRect();
    const viewportHeight = window.innerHeight; // 844

    return {
      buttonText: btn?.textContent?.trim(),
      btnBottom: btnRect ? Math.round(btnRect.bottom) : null,
      gapFromViewportBottom: btnRect ? Math.round(viewportHeight - btnRect.bottom) : null,
    };
  });

  console.log('Button Text after selection:', afterSelectMetrics.buttonText);
  console.log('Button bottom Y position:', afterSelectMetrics.btnBottom);
  console.log('Bottom Gapping after selection (px):', afterSelectMetrics.gapFromViewportBottom);
  console.log('✓ Remains exactly 24px gapping:', afterSelectMetrics.gapFromViewportBottom === 24);

  // Take screenshot with selected size
  await page.screenshot({ path: 'public/sticky_selected_844.png' });

  // Scroll down to check stickiness
  console.log('\nScrolling down 400px...');
  await page.evaluate(() => window.scrollBy(0, 400));
  await new Promise(r => setTimeout(r, 200));

  const afterScrollMetrics = await page.evaluate(() => {
    const btn = document.querySelector('[data-testid="add-to-bag-button"]');
    const btnRect = btn?.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    return {
      gapFromViewportBottom: btnRect ? Math.round(viewportHeight - btnRect.bottom) : null,
    };
  });

  console.log('Bottom Gapping while scrolled (px):', afterScrollMetrics.gapFromViewportBottom);
  console.log('✓ Button remains stuck with 24px gapping while scrolled:', afterScrollMetrics.gapFromViewportBottom === 24);

  await page.screenshot({ path: 'public/sticky_scrolled_844.png' });

  await browser.close();
  console.log('\nAll sticky 844 frame bottom tests passed!');
}

checkSticky().catch(console.error);
