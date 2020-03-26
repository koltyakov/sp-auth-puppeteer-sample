import * as puppeteer from 'puppeteer';
import * as minimist from 'minimist';
import { config } from 'dotenv';

import { authPuppeteer } from './auth';

interface IArgs {
  headless?: boolean;
  configPath?: string;
  ci?: boolean;
  scenarios?: string;
}

config(); // parse local .env if any
const { headless, configPath, ci, scenarios: scenarios } = minimist(process.argv.slice(2)) as IArgs;
if (ci) { process.env.SPAUTH_ENV = 'production'; }

(async () => {

  // Optional window and viewport dimentions config
  const width = 1920;
  const height = 1080;

  console.time('Execution time');

  const browser = await puppeteer.launch({
    headless: typeof headless !== 'undefined' ? headless : true,
    args: [ `--window-size=${width},${height}` ]
  });

  try {

    const page = await browser.newPage();
    const siteUrl = await authPuppeteer(page, configPath, ci);

    await page.setViewport({ width, height });
    await page.goto(siteUrl, {
      waitUntil: [ 'networkidle0', 'domcontentloaded' ]
    });

    /* Here comes puppeteer logic: UI tests, screenshots, etc. */

    const runScenarios = typeof scenarios === 'undefined'
      ? ['getTitle', 'screenshot', 'links']
      : scenarios.split(',').map((r) => r.trim());

    for (const runPath of runScenarios) {
      try {
        const { run } = await import(`./cases/${runPath}`);
        await run(page, siteUrl);
      } catch (ex) {
        console.log(`Error: ${ex.message}`);
      }
    }

  } catch (ex) {
    console.log(`Error: ${ex.message}`);
  } finally {
    await browser.close();
  }

  console.timeEnd('Execution time');
})()
  .catch(console.warn);
