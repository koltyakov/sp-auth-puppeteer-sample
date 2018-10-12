import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { authPuppeteer } from './auth';

(async () => {

  const width = 1920;
  const height = 1080;

  const browser = await puppeteer.launch({
    headless: true,
    args: [ `--window-size=${width},${height}` ]
  });

  try {

    const page = await browser.newPage();
    const siteUrl = await authPuppeteer(page);

    await page.setViewport({ width, height });
    await page.goto(siteUrl, {
      waitUntil: [ 'networkidle0', 'domcontentloaded' ]
    });

    /* Here comes puppeteer logic: UI tests, screenshots, etc. */

    // Create site page screenshot
    const dir = './screens';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const filename = new Date().toISOString().replace(/(:|\.)/g, '_');
    await page.screenshot({
      path: path.join(dir, `${filename}.png`)
    });

    const pageTitle = await page.title();
    console.log('Page title:', pageTitle);

    // const links = await page.$$eval('a', links => {
    //   return links.map(link => link.getAttribute('href'))
    //     .filter(href => {
    //       return href !== null &&
    //         href.indexOf('#') !== 0 &&
    //         href.indexOf('javascript:') !== 0;
    //     });
    // });
    // console.log('Links on page:', links.join(', '));

  } finally {
    await browser.close();
  }

})();
