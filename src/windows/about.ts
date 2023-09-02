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
    developer_name: `Kinten Le`,
    license_type: Gtk.License.GPL_3_0,
    version: VERSION,
    issue_url: 'https://github.com/kinten108101/steam-vpk/issues',
    developers: [ 'Kinten Le <kinten108101@protonmail.com>' ],
    transient_for: parent_window || null,
    website: 'https://github.com/kinten108101/steam-vpk',
    release_notes: `
<p>Portals!</p>
<ul>
<li>The application should be divided into two components: the front-end (this) and the back-end (Add-on Box). This is so that the async pattern is enforced and so that the project can be extended with external tools and other clients.</li>
<li>Main window UI renovation.</li>
</ul>
`,
    comments: `<span weight=\'bold\' line_height=\'1.6\'>Philosophy</span>
Steam VPK is an add-on manager that attempts to replace the Steam Workshop add-on system. Users download the add-ons once (from Steam Workshop, Gamemaps, etc) then control these add-ons on a filesystem level through this application.

<span weight=\'bold\' line_height=\'1.6\'>The Back-end</span>
Behind the scene, all data shown on Steam VPK is provided by the Add-on Box daemon.

<span weight=\'bold\' line_height=\'1.6\'>The Name</span>
<tt>steam-vpk</tt> was an ad-hoc name for a shell-script program I wrote back in 2022, and the name stuck.
`,
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
