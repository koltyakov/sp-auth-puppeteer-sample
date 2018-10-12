import * as puppeteer from 'puppeteer';
import { authPuppeteer } from './auth';

(async () => {

  const browser: puppeteer.Browser = await puppeteer.launch();

  try {

    const page = await browser.newPage();
    const siteUrl = await authPuppeteer(page);

    await page.goto(siteUrl);

    /* Here comes puppeteer logic: UI tests, screenshots, etc. */

    // Create site page screenshot
    // await page.waitFor(3000);
    // await page.screenshot({ path: 'example.png' });

    const pageTitle = await page.title();
    console.log('Page title:', pageTitle);

  } catch { /**/ } finally {
    await browser.close();
  }

})();
