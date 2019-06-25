import { AuthConfig } from 'node-sp-auth-config';
import * as minimist from 'minimist';

const args = minimist(process.argv.slice(2));

new AuthConfig({
  configPath: args['configPath'] || './config/private.json',
  forcePrompts: true
})
  .getContext().catch(console.error);
