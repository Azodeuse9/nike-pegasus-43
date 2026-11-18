import puppeteer from 'puppeteer-core';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function checkHeader() {
  const browser = await puppeteer.launch({ executablePath: chromePath, headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  const metrics = await page.evaluate(() => {
    const header = document.querySelector('header');
    const logo = document.querySelector('header a[aria-label="Nike Home"]');
    const headerRect = header ? header.getBoundingClientRect() : null;
    const logoRect = logo ? logo.getBoundingClientRect() : null;
    return {
      headerWidth: headerRect?.width,
      logoLeft: logoRect?.left,
      logoWidth: logoRect?.width,
      logoCenter: logoRect ? logoRect.left + logoRect.width / 2 : null,
      headerCenter: headerRect ? headerRect.left + headerRect.width / 2 : null,
    };
  });
  console.log('Header centering metrics:', metrics);
  const diff = Math.abs((metrics.logoCenter ?? 0) - (metrics.headerCenter ?? 0));
  console.log('Center offset difference (pixels):', diff);
  console.log('Is perfectly centered (diff < 1px)?', diff < 1);

  await page.screenshot({ path: 'public/header_centered_390px.png', clip: { x: 0, y: 0, width: 390, height: 80 } });
  await page.screenshot({ path: 'public/redesign_mobile_390px_v2.png', fullPage: true });
  await browser.close();
}

checkHeader().catch(console.error);
