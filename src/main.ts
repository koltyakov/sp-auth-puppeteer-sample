import * as puppeteer from 'puppeteer';
import { authPuppeteer } from './auth';

(async () => {

  const browser = await puppeteer.launch();

  try {

    const page = await browser.newPage();
    const siteUrl = await authPuppeteer(page);

    await page.goto(siteUrl, { waitUntil: 'networkidle2' });

    /* Here comes puppeteer logic: UI tests, screenshots, etc. */

    // Create site page screenshot
    await page.waitFor(3000);
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
