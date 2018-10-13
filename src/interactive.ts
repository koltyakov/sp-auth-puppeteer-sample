import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { authInteractively } from './auth/o365';

(async () => {

  const width = 1920;
  const height = 1080;

  const browser = await puppeteer.launch({
    headless: true,
    args: [ `--window-size=${width},${height}` ]
  });

  try {

    const page = await browser.newPage();
    const resourceUrl = 'https://forms.office.com/Pages/DesignPage.aspx';
    await authInteractively(page);

    await page.setViewport({ width, height });
    await page.goto(resourceUrl, {
      waitUntil: [ 'networkidle0', 'domcontentloaded' ]
    });

    /* Here comes puppeteer logic: UI tests, screenshots, etc. */

    const pageTitle = await page.title();
    console.log('Page title:', pageTitle);

    const intro = await page.evaluate(() => {
      return document.querySelector('.form-introduction-dialog-close-button') !== null;
    });
    if (intro) {
      await page.click('.form-introduction-dialog-close-button');
    }

    const surveys = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.button-content'))
        .filter(el => el.querySelector('.fl-title') !== null)
        .map(surveyEl => {
          return {
            title: surveyEl.querySelector('.fl-title').textContent.trim(),
            responses: parseInt(surveyEl.querySelector('.fl-response-count-container').textContent.trim().split(' ')[0], 10)
          };
        });
    });

    console.log(surveys);

  } catch (ex) {
    console.log(`Error: ${ex.message}`);
  } finally {
    await browser.close();
  }

})();
