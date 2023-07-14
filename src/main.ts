import 'gi://Gdk?version=4.0';
import 'gi://Gtk?version=4.0';
import 'gi://Soup?version=3.0';

import { APP_ID } from './const.js';

import { Application } from './application.js';

export function main(argv: string[] | null): number {
  const app = new Application({
    application_id: APP_ID,
  });
  return app.run(argv);
}
