import { Page } from 'puppeteer';

export const run = async (page: Page, siteUrl: string): Promise<void> => {
  // Print page title
  const pageTitle = await page.title();
  console.log('Page title:', pageTitle);
};
