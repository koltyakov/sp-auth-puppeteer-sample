import { Page } from 'puppeteer';

export const run = async (page: Page, siteUrl: string): Promise<void> => {
  // Print anchor tags links
  const links = await page.$$eval('a', (links) => {
    return links.map((link) => link.getAttribute('href'))
      .filter((href) => {
        return href !== null &&
          href.indexOf('#') !== 0 &&
          href.indexOf('javascript:') !== 0;
      });
  });
  console.log('Links on page:', links.join(', '));
};
