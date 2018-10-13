import { Page } from 'puppeteer';
import { IUserCredentials } from 'node-sp-auth';
import { AuthConfig } from 'node-sp-auth-config';

export const authInteractively = async (page: Page): Promise<void> => {
  const authContext = await new AuthConfig().getContext();

  if (authContext.strategy !== 'UserCredentials') {
    throw new Error('Unsupported authentication strategy');
  }

  const creds = authContext.authOptions as IUserCredentials;

  await page.goto(authContext.siteUrl, {
    waitUntil: [ 'networkidle0', 'domcontentloaded' ]
  });

  await page.waitForSelector('input[type=email]');
  await page.type('input[type=email]', creds.username);
  await page.click('input[type=submit]');

  await page.waitForSelector('input[type=password]');
  await page.type('input[type=password]', creds.password);
  // await page.waitFor(1000);
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  await page.click('input[type=submit]');
  // await page.waitFor(1000);
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  const authError = await page.evaluate(() => {
    if (document.querySelector('#passwordError') !== null) {
      return document.querySelector('#passwordError').textContent;
    }
    return null;
  });
  if (authError !== null) {
    throw new Error(authError);
  }
  await page.click('input[type=submit]');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

};
