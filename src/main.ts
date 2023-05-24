import 'gi://Gdk?version=4.0';
import 'gi://Gtk?version=4.0';

import { Application } from './application.js';

/**
 * @param {string[] | null} argv - Arguments passed in by OS
 * @returns {number} Process handler of the primary instance (?) of this application (will be used by GLib's Mainloop)
 */
export function main(argv: string[] | null): number {
  const app = new Application({
    'application-id': imports.package.name,
  });
  return app.run(argv);
}
