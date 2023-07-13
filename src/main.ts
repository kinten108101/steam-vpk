import 'gi://Gdk?version=4.0';
import 'gi://Gtk?version=4.0';
import 'gi://Soup?version=3.0';


import { Config } from './config.js';
import { Application } from './application.js';

export function main(argv: string[] | null): number {
  const app = new Application({
    application_id: Config.config.app_id,
  });
  return app.run(argv);
}
