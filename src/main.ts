import 'gi://Gdk?version=4.0';
import 'gi://Gtk?version=4.0';
import 'gi://Soup?version=3.0';

import { BUILD_TYPE, BuildTypes } from './const.js';
import Logger from './logger.js';
Logger.init({ debug: BUILD_TYPE === BuildTypes.debug });
import application_implement from './application.js';

export function main(argv: string[] | null): number {
  const app = application_implement();
  return app.run(argv);
}
