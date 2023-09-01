import 'gi://Gdk?version=4.0';
import 'gi://Gtk?version=4.0';
import 'gi://Soup?version=3.0';

import { getApplication } from './application.js';

export function main(argv: string[] | null): number {
  const app = getApplication();
  return app.run(argv);
}
