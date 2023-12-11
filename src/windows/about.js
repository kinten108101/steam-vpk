import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

/**
 * @param {{
 *   gsettings: Gio.Settings;
 *   parent_window?: Gtk.Window;
 * }} params
 */
export default function AboutWindow({ gsettings, parent_window, }) {
  const window = new Adw.AboutWindow({
    application_name: 'Steam VPK',
    license_type: Gtk.License.GPL_3_0,
    version: globalThis.config.version,
    issue_url: 'https://github.com/kinten108101/steam-vpk/issues',
    developers: ['Kinten Le <kinten108101@protonmail.com>'],
    transient_for: parent_window || null,
    website: 'https://github.com/kinten108101/steam-vpk',
    comments: `Add-on manager for Left 4 Dead 2.

All data is provided by the Add-on Box daemon.`,
    debug_info: globalThis.config.toString(),
  });

  function on_enable_devel_style_changed() {
    window.set_application_icon(gsettings.get_boolean('enable-devel-style') ? 'addon-box-devel' : 'addon-box');
  }
  gsettings.connect('changed::enable-devel-style', on_enable_devel_style_changed);
  on_enable_devel_style_changed();

  return window;
}
