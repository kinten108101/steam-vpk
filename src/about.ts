import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import { APP_FULLNAME, VERSION } from './const.js';

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
    release_notes: `
<p>Portals!</p>
<ul>
<li>The application should be divided into two components: the front-end (this) and the back-end (Add-on Box). This is so that the async pattern is enforced and so that the project can be extended with external tools and other clients.</li>
<li>Main window UI renovation.</li>
</ul>
`,
    comments: `The Steam VPK add-on manager is an alternative to the Steam Workshop add-on system. You download the add-ons once (from Steam Workshop, Gamemaps, etc) then mangae the add-on files locally right from your disk.\n
Steam VPK also provides a suite of add-on creation and management tools for content creators.\n
Behind the scene, Steam VPK uses a background server called Add-on Box. Add-on Box provides all data and services, and Steam VPK is a GUI client that displays the results.\n
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
