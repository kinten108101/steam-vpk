import Gdk from 'gi://Gdk';
import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import * as Consts from './const.js';
import TypedBuilder from './typed-builder.js';
import { TOAST_TIMEOUT_SHORT } from './gtk.js';
import { g_param_default, g_variant_unpack, param_spec_variant, promise_wrap, registerClass } from './utils.js';
import { Toast } from './toast-builder.js';

export class BuilderData extends GObject.Object {
  static [GObject.properties] = {
    id: GObject.param_spec_variant('id', 'id', 'id', GLib.VariantType.new('s'), GLib.Variant.new_string('s'), g_param_default),
    steamid: GObject.param_spec_variant('steamid', 'steamid', 'steamid', GLib.VariantType.new('s'), GLib.Variant.new_string('s'), g_param_default),
    steam_url: param_spec_variant({
      name: 'steam-url',
      type: GLib.VariantType.new('s'),
      default_value: GLib.Variant.new_string('steam url'),
    }),
    subdir_uri: param_spec_variant({
      name: 'subdir-uri',
      type: GLib.VariantType.new('s'),
      default_value: GLib.Variant.new_string('subdir uri'),
    }),
  };

  static {
    registerClass({}, this);
  }

  id?: GLib.Variant;
  steamid?: GLib.Variant;
  steam_url?: GLib.Variant;
  subdir_uri?: GLib.Variant;
}

registerClass({
  GTypeName: 'StvpkNavigateRow',
  Template: `resource://${Consts.APP_RDNN}/ui/navigate-row.ui`,
}, class extends Adw.ActionRow {});

/**
 * Implement the addon-details group of actions.
 */
export default function
AddonDetailsPage(
{ page_slot,
  toaster,
  action_map,
  parent_window,
}:
{ page_slot: Adw.Bin;
  toaster?: Adw.ToastOverlay;
  action_map: Gio.ActionMap;
  parent_window?: Gtk.Window;
}) {
  const builder = new TypedBuilder();
  builder.add_from_resource(`${Consts.APP_RDNN}/ui/addon-details.ui`);
  const page = builder.get_typed_object<Gtk.Box>('page');
  page_slot.child = page;

  const present = (_id: string) => {};

  const seeDetails = new Gio.SimpleAction({
    name: 'addon-details.see-details',
    parameter_type: GLib.VariantType.new('s'),
  });
  seeDetails.connect('activate', (_action, parameter) => {
    const id = g_variant_unpack<string>(parameter, 'string');
    present(id);
  });
  action_map.add_action(seeDetails);

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
    const uri = g_variant_unpack<string>(parameter, 'string');
    Gtk.show_uri(parent_window || null, uri, Gdk.CURRENT_TIME);
  });
  action_map.add_action(explore_fs);
}
