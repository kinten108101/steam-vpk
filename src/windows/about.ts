import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import { APP_FULLNAME } from '../utils/const.js';
import { globalThis } from '../utils/ts-helper.js';

export default function AboutWindow(
{ parent_window,
}:
{ parent_window?: Gtk.Window;
}) {
  const window = new Adw.AboutWindow({
    application_icon: 'addon-box',
    application_name: APP_FULLNAME,
    license_type: Gtk.License.GPL_3_0,
    version: (globalThis as unknown as globalThis).config.version,
    issue_url: 'https://github.com/kinten108101/steam-vpk/issues',
    developers: [ 'Kinten Le <kinten108101@protonmail.com>' ],
    transient_for: parent_window || null,
    website: 'https://github.com/kinten108101/steam-vpk',
    comments: `Add-on manager for Left 4 Dead 2.

All data is provided by the Add-on Box daemon.`,
    debug_info: String((globalThis as unknown as globalThis).config),
  });

  function present() {
    window.present();
    return builder;
  }

  const builder = {
    present,
    build() {
      return window;
    }
  }

  return builder;
}
