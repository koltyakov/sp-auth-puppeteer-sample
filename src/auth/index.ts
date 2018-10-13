import { Page } from 'puppeteer';
import { getAuth, IOnpremiseUserCredentials } from 'node-sp-auth';
import { AuthConfig } from 'node-sp-auth-config';

export const authPuppeteer = async (page: Page): Promise<string> => {
  const authContext = await new AuthConfig().getContext();

  if (authContext.strategy !== 'OnpremiseUserCredentials') {

    // Authenticates to SharePoint with `node-sp-auth` library
    const auth = await getAuth(authContext.siteUrl, authContext.authOptions);
    const url = authContext.siteUrl + '/';

    // Processing auth cookies
    const cookies = (auth.headers.Cookie || '').split('; ').map(c => {
      const index = c.indexOf('=');
      const name = c.substring(0, index);
      const value = c.substring(index + 1, c.length);
      return { url, name, value };
    });

    // Auth cookies
    // console.log(cookies);

    // Setting cookies to the session
    await page.setCookie(...cookies);

  } else {

    // NTML auth
    const { username, password } = authContext.authOptions as IOnpremiseUserCredentials;
    await page.authenticate({ username, password });

  }

  return authContext.siteUrl;
};
