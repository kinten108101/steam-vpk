import Gdk from 'gi://Gdk';
import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import * as Adw1 from './utils/adw1.js';

import * as Consts from './const.js';
import * as Utils from './utils.js';
import { AddonStorage } from './addon-storage.js';
import TypedBuilder from './typed-builder.js';
import DiskCapacity from './disk-capacity.js';
import * as Files from './file.js';
import { creators2humanreadable } from './addons.js';
import { FieldRow } from './gtk.js';
import { make_workshop_item_url } from './steam-api.js';

class BuilderData extends GObject.Object {
  static [GObject.properties] = {
    id: GObject.param_spec_variant('id', 'id', 'id', GLib.VariantType.new('s'), GLib.Variant.new_string('s'), Utils.g_param_default),
    steamid: GObject.param_spec_variant('steamid', 'steamid', 'steamid', GLib.VariantType.new('s'), GLib.Variant.new_string('s'), Utils.g_param_default),
    'steamid_copy-url': GObject.param_spec_variant('steam-url', 'steam-url', 'steam-url', GLib.VariantType.new('s'), GLib.Variant.new_string('s'), Utils.g_param_default),
  };

  static {
    Utils.registerClass({}, this);
  }

  id!: GLib.Variant;
  steamid!: GLib.Variant;
  steam_url!: GLib.Variant;
}

Utils.registerClass({
  GTypeName: 'StvpkNavigateRow',
  Template: `resource://${Consts.APP_RDNN}/ui/navigate-row.ui`,
}, class extends Adw.ActionRow {});

/**
 * Implement the addon-details group of actions.
 */
export default function
addon_details_implement(
{ leaflet,
  page_slot,
  addonStorage,
  toaster,
  diskCapacity,
  action_map,
}:
{ leaflet: Adw.Leaflet;
  page_slot: Adw.Bin;
  addonStorage: AddonStorage;
  toaster?: Adw.ToastOverlay;
  diskCapacity: DiskCapacity;
  action_map: Gio.ActionMap;
}) {
  const builder = new TypedBuilder();
  builder.add_from_resource(`${Consts.APP_RDNN}/ui/addon-details.ui`);
  const page = builder.get_typed_object<Gtk.Box>('page');
  page_slot.child = page;

  let currentAddon: string | undefined;
  let explore_uri: string | undefined;

  const seeDetails = new Gio.SimpleAction({
    name: 'addon-details.see-details',
    parameter_type: GLib.VariantType.new('s'),
  });
  seeDetails.connect('activate', (_action, parameter) => {
    console.debug('<<addons.see-details>>');
    const id = Utils.g_variant_unpack<string>(parameter, 'string');
    const addon = addonStorage.get(id);
    if (addon === undefined) {
      console.warn(`Coulnd\'t find add-on \"${id}\". Refuse to navigate. Quitting...`);
      toaster?.add_toast(
        Adw1.Toast.builder()
        .title('Add-on data cannot be found!')
        .build());
      return;
    }
    currentAddon = id;
    const subdir = addonStorage.subdirFolder.get_child(id);
    explore_uri = subdir.get_uri() || undefined;
    const isRemote = addon.steamId !== undefined;

    const steamid = addon.steamId || '';
    const url = make_workshop_item_url(steamid);

    const data = builder.get_typed_object<BuilderData>('data');
    if (parameter !== null) {
      data.id = parameter;
    }
    const title = builder.get_typed_object<Gtk.Label>('title');
    title.set_label(addon.title || 'Untitled add-on');
    const subtitle = builder.get_typed_object<Gtk.Label>('subtitle');
    subtitle.set_label(creators2humanreadable(addon.creators));
    const size = (() => {
      if (addon.subdir)
        return diskCapacity.eval_size(addon.subdir);
      return null;
    })();
    console.debug('Size is', size);
    const used_label = builder.get_typed_object<Gtk.Label>('used');
    used_label.set_label((() => {
          if (size !== null)
            return `${Files.bytes2humanreadable(size)} Used`;
          return 'Unknown size';
        })());

    const stvpkid = builder.get_typed_object<FieldRow>('stvpkid');
    stvpkid.set_value(addon.vanityId);
    data.id = GLib.Variant.new_string(addon.id);

    const steamid_row = builder.get_typed_object<FieldRow>('steamid');
    data.steamid = GLib.Variant.new_string(steamid);
    const website_row = builder.get_typed_object<Adw.ActionRow>('visit-steam-row');
    website_row.set_subtitle(url);
    data.steam_url = GLib.Variant.new_string(url);

    if (isRemote) {
      steamid_row.set_value((() => {
        if (addon.steamId)
          return addon.steamId;
        console.warn(`Add-on ${addon.vanityId} declared as remote despite having no steam id?`);
        return 'Unknown';
      })());
      steamid_row.set_visible(true);
      website_row.set_visible(true);
    }
    else {
      steamid_row.set_visible(false);
      website_row.set_visible(false);
    }

    leaflet.set_visible_child_name('addon-details-page');
    console.debug('>>addons.see-details<<');
  });
  action_map.add_action(seeDetails);

  const visit_website = new Gio.SimpleAction({ name: 'addon-details.visit-website', parameter_type: GLib.VariantType.new('s') });
  visit_website.connect('activate', (_action, parameter) => {
    const url = Utils.g_variant_unpack<string>(parameter, 'string');
    Gtk.show_uri(null, url, Gdk.CURRENT_TIME);
  });
  action_map.add_action(visit_website);

  const copy_string = new Gio.SimpleAction({ name: 'addon-details.copy-string', parameter_type: GLib.VariantType.new('s') });
  copy_string.connect('activate', (_action, parameter) => {
    Utils.promise_wrap(async () => {
      const str = Utils.g_variant_unpack<string>(parameter, 'string');
      const display = Gdk.Display.get_default();
      if (display === null) return;
      const val = new GObject.Value();
      val.init(GObject.TYPE_STRING);
      val.set_string(str);
      display.get_clipboard().set_content(Gdk.ContentProvider.new_for_value(val));
      toaster?.add_toast(
        Adw1.Toast.builder()
        .title('Copied to clipboard')
        .timeout(3)
        .build());
    });
  });
  action_map.add_action(copy_string);

  const explore_button = builder.get_typed_object<Gtk.Button>('explore-button');
  explore_button.connect('clicked', () => {
    if (!explore_uri) return;
    Gtk.show_uri(null, explore_uri, Gdk.CURRENT_TIME);
  });


  addonStorage.connect_after(AddonStorage.Signals.addons_changed, () => {
    if (currentAddon === undefined) {
      return;
    }
    if (addonStorage.idmap.has(currentAddon)) {
      return;
    }

    const back = action_map.lookup_action('back');
    if (back === null) {
      return;
    }
    if (leaflet.get_visible_child_name() !== 'addon-details-page') {
      return;
    }
    back.activate(null);
  });

}
