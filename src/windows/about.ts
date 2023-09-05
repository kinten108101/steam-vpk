import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import { APP_FULLNAME, VERSION } from '../utils/const.js';

export default function AboutWindow(
{ parent_window,
}:
{ parent_window?: Gtk.Window;
}) {
  const window = new Adw.AboutWindow({
    application_icon: 'addon-box',
    application_name: APP_FULLNAME,
    license_type: Gtk.License.GPL_3_0,
    version: VERSION,
    issue_url: 'https://github.com/kinten108101/steam-vpk/issues',
    developers: [ 'Kinten Le <kinten108101@protonmail.com>' ],
    transient_for: parent_window || null,
    website: 'https://github.com/kinten108101/steam-vpk',
    comments: `Add-on manager for Left 4 Dead 2.

All data is provided by the Add-on Box daemon.`,
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
