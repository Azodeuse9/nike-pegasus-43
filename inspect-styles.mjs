import puppeteer from 'puppeteer-core';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function checkComputed() {
  const browser = await puppeteer.launch({ executablePath: chromePath, headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  const info = await page.evaluate(() => {
    const tile = document.querySelector('[data-testid="size-option-HV7521-001-035"]');
    const img = document.querySelector('[data-testid="product-main-image"]');
    const grid = document.querySelector('[data-testid="size-grid"]');
    const main = document.querySelector('main');
    return {
      mainWidth: main ? window.getComputedStyle(main).width : null,
      gridWidth: grid ? window.getComputedStyle(grid).width : null,
      gridTemplateColumns: grid ? window.getComputedStyle(grid).gridTemplateColumns : null,
      tileWidth: tile ? window.getComputedStyle(tile).width : null,
      tileHeight: tile ? window.getComputedStyle(tile).height : null,
      tileClasses: tile ? tile.className : null,
      imgWidth: img ? window.getComputedStyle(img).width : null,
      imgHeight: img ? window.getComputedStyle(img).height : null,
      imgClasses: img ? img.className : null,
    };
  });
  console.log('Computed styles:', info);
  await browser.close();
}
checkComputed().catch(console.error);
