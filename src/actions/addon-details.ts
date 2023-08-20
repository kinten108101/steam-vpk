import Gdk from 'gi://Gdk';
import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import {
  g_variant_unpack,
  promise_wrap,
} from '../steam-vpk-utils/utils.js';
import { Toast } from '../toast-builder.js';
import { TOAST_TIMEOUT_SHORT } from '../gtk.js';

Gio._promisify(Gtk.UriLauncher.prototype, 'launch', 'launch_finish');

/**
 * Implement the addon-details group of actions.
 */
export default function
AddonDetailsActions(
{ toaster,
  action_map,
  parent_window,
  present_details,
}:
{ toaster?: Adw.ToastOverlay;
  action_map: Gio.ActionMap;
  parent_window?: Gtk.Window;
  present_details?: (arg0: string) => any;
}) {
  if (present_details !== undefined) {
    const seeDetails = new Gio.SimpleAction({
      name: 'addon-details.see-details',
      parameter_type: GLib.VariantType.new('s'),
    });
    seeDetails.connect('activate', (_action, parameter) => {
      promise_wrap(async () => {
        const id = g_variant_unpack<string>(parameter, 'string');
        await present_details(id);
      });
    });
    action_map.add_action(seeDetails);
  } else {
    console.log('Skipped implementation of addon-details.see-details.')
  }

  const visit_website = new Gio.SimpleAction({
    name: 'addon-details.visit-website',
    parameter_type: GLib.VariantType.new('s'),
  });
  visit_website.connect('activate', (_action, parameter) => {
    const url = g_variant_unpack<string>(parameter, 'string');
    Gtk.show_uri(parent_window || null, url, Gdk.CURRENT_TIME);
  });
  action_map.add_action(visit_website);

  const copy_string = new Gio.SimpleAction({
    name: 'addon-details.copy-string',
    parameter_type: GLib.VariantType.new('s'),
  });
  copy_string.connect('activate', (_action, parameter) => {
    promise_wrap(async () => {
      const str = g_variant_unpack<string>(parameter, 'string');
      const display = Gdk.Display.get_default();
      if (display === null) return;
      const val = new GObject.Value();
      val.init(GObject.TYPE_STRING);
      val.set_string(str);
      display.get_clipboard().set_content(Gdk.ContentProvider.new_for_value(val));
      toaster?.add_toast(
        Toast.builder()
        .title('Copied to clipboard')
        .timeout(TOAST_TIMEOUT_SHORT)
        .build());
    });
  });
  action_map.add_action(copy_string);

  const explore_fs = new Gio.SimpleAction({
    name: 'addon-details.explore-fs',
    parameter_type: GLib.VariantType.new('s'),
  });
  explore_fs.connect('activate', (_action, parameter) => {
    promise_wrap(async () => {
      const path = g_variant_unpack<string>(parameter, 'string');
      Gtk.show_uri(parent_window || null, `file://${path}`, Gdk.CURRENT_TIME);
    });
  });
  action_map.add_action(explore_fs);
}
