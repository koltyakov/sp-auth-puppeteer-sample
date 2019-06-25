import { Page } from 'puppeteer';
import { IUserCredentials } from 'node-sp-auth';
import { AuthConfig } from 'node-sp-auth-config';

/**
 * Interactive auth uses saved username and password for typing them inlto O365 login forms
 */
export const authInteractively = async (page: Page, configPath: string = './config/private.json'): Promise<void> => {
  const authContext = await new AuthConfig({ configPath }).getContext();

  if (authContext.strategy !== 'UserCredentials') {
    throw new Error('Unsupported authentication strategy');
  }

  const creds = authContext.authOptions as IUserCredentials;

  // Firstly, go to an SPO page which always navigates to login screen
  await page.goto(authContext.siteUrl, { waitUntil: 'networkidle0' });

  // Wait for username input and type
  await page.waitForSelector('input[type=email]');
  await page.type('input[type=email]', creds.username);
  await page.click('input[type=submit]');

  // Wait for password input and type
  await page.waitForSelector('input[type=password]');
  await page.type('input[type=password]', creds.password);

  // Wait for first submit button
  // await page.waitForNavigation({ waitUntil: 'networkidle0' });
  await page.waitFor(1000); // networkidle0 got broken with no reason
  await page.click('input[type=submit]');

  // Wait for login confirmation
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  // Check for errors
  const authError = await page.evaluate(() => {
    if (document.querySelector('#passwordError') !== null) {
      return document.querySelector('#passwordError').textContent;
    }
    return null;
  });
  if (authError !== null) {
    throw new Error(authError);
  }

  // Finally, submit O365 login and wait for navigation to SPO
  await page.click('input[type=submit]');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

};
