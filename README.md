# Puppeteer & node-sp-auth example

> Demonstrates a way of headless browser automation with SharePoint.

## About Puppeteer

[Puppeteer](https://github.com/GoogleChrome/puppeteer) is a Node library which provides a high-level API to control Chrome or Chromium over the DevTools Protocol. Puppeteer runs headless by default, but can be configured to run full (non-headless) Chrome or Chromium.

## Dependencies

```bash
npm install
```

## Auth

```bash
npm run auth
```

Provide auth options for SPO or On-Prem SharePoint site.

Auth options are stored in `./config/private.json`

See more [here](https://github.com/koltyakov/node-sp-auth-config).

## Run

```bash
npm run start
```

Should start the Puppeteer (in headless mode) authenticated to SharePoint with [node-sp-auth](https://github.com/s-KaiNet/node-sp-auth).

## Sample

```typescript
import * as puppeteer from 'puppeteer';
import { authPuppeteer } from './auth';

let browser: puppeteer.Browser = null;

(async () => {

  browser = await puppeteer.launch();
  const page = await browser.newPage();
  const siteUrl = await authPuppeteer(page);
  // Since this time page is authenticated in SharePoint

  await page.goto(siteUrl, {
    waitUntil: 'networkidle2'
  });

  /* Here comes Puppeteer logic: UI tests, screenshots, etc. */

  // Save a screenshot of SharePoint page as PDF
  await page.pdf({ path: 'sp.pdf', format: 'A4' });

  // For other goodies check for Puppeteer API:
  // https://github.com/GoogleChrome/puppeteer/blob/v1.9.0/docs/api.md

  await browser.close();

})();
```