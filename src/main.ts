import 'gi://Gdk?version=4.0';
import 'gi://Gtk?version=4.0';
import 'gi://Soup?version=3.0';

import { Log, getShortTraceGjs } from './utils/log.js';
Log.init({
  buildtype: Config.config.build_type,
  prefix: Config.config.app_shortname,
  implementations: {
    printRaw: print,
    getShortTrace: getShortTraceGjs,
  },
});

import { Config } from './config.js';
import { Application } from './application.js';

export function main(argv: string[] | null): number {
  const app = new Application({
    application_id: Config.config.app_id,
  });
  return app.run(argv);
}
