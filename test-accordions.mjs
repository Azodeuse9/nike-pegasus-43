import puppeteer from 'puppeteer-core';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function checkAccordions() {
  const browser = await puppeteer.launch({ executablePath: chromePath, headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Open delivery and reviews accordions so all three sections can be viewed
  const buttons = await page.$$('button[aria-expanded="false"]');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Delivery') || text.includes('Reviews')) {
      await btn.click();
      await new Promise(r => setTimeout(r, 150));
    }
  }

  // Scroll to accordions
  await page.evaluate(() => {
    const acc = document.querySelector('section[aria-label*="accordions"]');
    acc?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });

  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'public/improved_accordions.png' });
  console.log('✓ Screenshot saved to public/improved_accordions.png');

  // Verify text contents
  const content = await page.evaluate(() => {
    const section = document.querySelector('section[aria-label*="accordions"]');
    return section?.innerText;
  });

  console.log('--- Accordion Content Preview ---');
  console.log(content.slice(0, 300) + '...');

  await browser.close();
}

checkAccordions().catch(console.error);
