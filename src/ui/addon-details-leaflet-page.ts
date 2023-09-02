import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import TypedBuilder from '../utils/typed-builder.js';
import { APP_RDNN } from '../utils/const.js';
import { param_spec_variant, registerClass } from '../steam-vpk-utils/utils.js';

export class BuilderData extends GObject.Object {
  static [GObject.properties] = {
    id: param_spec_variant({
      name: 'id',
      type: GLib.VariantType.new('s'),
      default_value: GLib.Variant.new_string('identifier'),
    }),
    steamid: param_spec_variant({
      name: 'steamid',
      type: GLib.VariantType.new('s'),
      default_value: GLib.Variant.new_string('steam id'),
    }),
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

export default function AddonDetailsLeafletPage(
{ leaflet_page_entry

}:
{ leaflet_page_entry: Adw.Bin;

}) {
  GObject.type_ensure(BuilderData.$gtype);
  const builder = new TypedBuilder();
  builder.add_from_resource(`${APP_RDNN}/ui/addon-details.ui`);
  const page = builder.get_typed_object<Gtk.Box>('page');
  leaflet_page_entry.child = page;
  return builder;
}
