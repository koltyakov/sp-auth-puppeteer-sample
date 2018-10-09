import * as puppeteer from 'puppeteer';
import { authPuppeteer } from './auth';

let browser: puppeteer.Browser = null;

(async () => {

  browser = await puppeteer.launch();
  const page = await browser.newPage();
  const siteUrl = await authPuppeteer(page);

  await page.goto(siteUrl);

  /* Here comes puppeteer logic: UI tests, screenshots, etc. */

  // Create site page screenshot
  // await page.waitFor(3000);
  // await page.screenshot({ path: 'example.png' });

  const pageTitle = await page.title();
  console.log('Page title:', pageTitle);

  await browser.close();

})()
  .catch(error => {
    try {
      browser.close();
    } catch (ex) { /**/ }
    console.error(error);
  });
