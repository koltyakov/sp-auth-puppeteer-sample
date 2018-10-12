import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import { authPuppeteer } from './auth';

(async () => {

  const width = 1280;
  const height = 900;

  const browser = await puppeteer.launch({
    headless: true,
    args: [ `--window-size=${width},${height}` ]
  });

  try {

    const page = await browser.newPage();
    const siteUrl = await authPuppeteer(page);

    await page.setViewport({ width, height });
    await page.goto(siteUrl, { waitUntil: 'networkidle2' });

    /* Here comes puppeteer logic: UI tests, screenshots, etc. */

    // Create site page screenshot
    await page.waitFor(3000);
    if (!fs.existsSync('./tmp')) {
      fs.mkdirSync('./tmp');
    }
    await page.screenshot({ path: './tmp/example.png' });

    const pageTitle = await page.title();
    console.log('Page title:', pageTitle);

    const links = await page.$$eval('a', links => {
      return links.map(link => link.getAttribute('href'))
        .filter(href => {
          return href !== null &&
            href.indexOf('#') !== 0 &&
            href.indexOf('javascript:') !== 0;
        });
    });
    console.log('Links on page:', links.join(', '));

  } finally {
    await browser.close();
  }

})();
