import * as fs from 'fs';
import * as path from 'path';
import { Page } from 'puppeteer';

export const run = async (page: Page, siteUrl: string): Promise<void> => {
  // Create site page screenshot
  const dir = './screens';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const filename = new Date().toISOString().replace(/(:|\.)/g, '_');
  await page.screenshot({
    path: path.join(dir, `${filename}.png`)
  });
};
