import '../@types/Gjs/index';
import 'gi://Gdk?version=4.0';
import 'gi://Gtk?version=4.0';
import 'gi://Adw';

import { Application } from './application.js';

export function main(argv: string[] | null) {
  const app = new Application({
    'application-id': imports.package.name,
  });
  return app.run(argv);
}
