import { Page } from 'puppeteer';

export const run = async (page: Page, siteUrl: string): Promise<void> => {
  // Open workbench
  await page.goto(`${siteUrl}/_layouts/15/workbench.aspx`, {
    waitUntil: [ 'networkidle0', 'domcontentloaded' ]
  });

  // Check gulp serve dialog
  await page.$$eval(`button[data-automation-id='GulpServeWarningOkButton']`, (buttons) => {
    if (buttons.length > 0) {
      (buttons[0] as HTMLButtonElement).click();
    }
  });

  // Add webpart
  const webpartTitle = process.env.WEBPART_NAME || 'Text';
  await page.$$eval(`button[data-automation-id='toolboxHint-webPart']`, (buttons) => {
    if (buttons.length > 0) {
      (buttons[0] as HTMLButtonElement).click();
    }
  });
  await page.waitForSelector(`input[data-automation-id='toolbox-searchBox']`);
  await page.type(`input[data-automation-id='toolbox-searchBox']`, webpartTitle);
  await page.waitFor(500);
  await page.click(`div[data-automation-id='spPageCanvasLargeToolboxBody'] button[aria-label='${webpartTitle}']`);
  await page.waitFor(1000);

};
