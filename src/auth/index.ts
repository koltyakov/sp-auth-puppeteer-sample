import { Page } from 'puppeteer';
import { getAuth, IOnpremiseUserCredentials } from 'node-sp-auth';
import { AuthConfig, IAuthConfigSettings, IAuthContext } from 'node-sp-auth-config';

export const authPuppeteer = async (page: Page, configPath: string = './config/private.json', headlessMode: boolean = false): Promise<string> => {
  const authConfig: IAuthConfigSettings = { configPath, headlessMode };
  const authContext: IAuthContext = await new AuthConfig(authConfig).getContext();

  // OnpremiseUserCredentials == NTML can't operate with cookies
  if (authContext.strategy !== 'OnpremiseUserCredentials') {

    // Authenticates to SharePoint with `node-sp-auth` library
    const auth = await Promise.resolve(getAuth(authContext.siteUrl, authContext.authOptions));
    const url = authContext.siteUrl + '/';

    // Processing auth cookies
    const cookies = (auth.headers.Cookie || '').split('; ').map((c: string) => {
      const index = c.indexOf('=');
      const name = c.substring(0, index);
      const value = c.substring(index + 1, c.length);
      return { url, name, value };
    });

    // Setting cookies to the session
    await page.setCookie(...cookies);

  } else {

    // NTML auth
    const { username, password } = authContext.authOptions as IOnpremiseUserCredentials;
    await page.authenticate({ username, password });

  }

  return authContext.siteUrl;
};
