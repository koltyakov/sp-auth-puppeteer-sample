import * as puppeteer from 'puppeteer';
import { authInteractively } from './auth/o365';
import * as minimist from 'minimist';

const args = minimist(process.argv.slice(2));

(async () => {

  // Optional viewport size declaration
  const width = 1920;
  const height = 1080;

  console.time('Execution time');

  const browser = await puppeteer.launch({
    headless: args['headless'] === 'false' ? false : true,
    args: [ `--window-size=${width},${height}` ]
  });

  try {

    const page = await browser.newPage();

    // Resource in O365 to navigate to
    // The sample demonstrates MS Forms automation
    const resourceUrl = 'https://forms.office.com/Pages/DesignPage.aspx';

    // Initiate interactive auth
    await authInteractively(page, args['configPath']);

    await page.setViewport({ width, height });
    await page.goto(resourceUrl, {
      waitUntil: [ 'networkidle0', 'domcontentloaded' ]
    });

    /* Here comes puppeteer logic: UI tests, screenshots, etc. */

    // Print page title
    const pageTitle = await page.title();
    console.log('Page title:', pageTitle);

    // Close intro dialog in MS Forms
    const intro = await page.evaluate(() => {
      return document.querySelector('.form-introduction-dialog-close-button') !== null;
    });
    if (intro) {
      await page.click('.form-introduction-dialog-close-button');
    }

    // Retrieve a list of surveys and quizes (visible on a page) and responses counter
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

  console.timeEnd('Execution time');

})()
  .catch(console.warn);
