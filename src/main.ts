import 'gi://Gdk?version=4.0';
import 'gi://Gtk?version=4.0';
import 'gi://Soup?version=3.0';

import { APP_ID, BUILD_TYPE, BuildTypes } from './const.js';
import Logger from './logger.js';
Logger.init({ debug: BUILD_TYPE === BuildTypes.debug });

import { Application } from './application.js';

export function main(argv: string[] | null): number {
  const app = new Application({
    application_id: APP_ID,
  });
  return app.run(argv);
}
