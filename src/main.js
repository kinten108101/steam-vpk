import 'gi://Gdk?version=4.0';
import 'gi://Gtk?version=4.0';
import 'gi://Soup?version=3.0';

import './promisify.js';
import './gtype.js';
import { getApplication } from './application.js';

/**
 * @param {string[] | null} argv
 */
export function main(argv) {
  const app = getApplication();
  return app.run(argv);
}
