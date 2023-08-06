import Gdk from 'gi://Gdk';
import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import * as Adw1 from './utils/adw1.js';

import * as Consts from './const.js';
import { AddonStorage } from './addon-storage.js';
import TypedBuilder from './typed-builder.js';
import DiskCapacity from './disk-capacity.js';
import * as Files from './file.js';
import { creators2humanreadable } from './addons.js';
import { FieldRow, TOAST_TIMEOUT_SHORT } from './gtk.js';
import { make_workshop_item_url } from './steam-api.js';
import { g_param_default, g_variant_unpack, param_spec_variant, promise_wrap, registerClass } from './utils.js';

class BuilderData extends GObject.Object {
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
addon_details_implement(
{ leaflet,
  leaflet_details_page,
  page_slot,
  addon_storage,
  toaster,
  disk_capacity,
  action_map,
  parent_window,
}:
{ leaflet: Adw.Leaflet;
  leaflet_details_page: string;
  page_slot: Adw.Bin;
  addon_storage: AddonStorage;
  toaster?: Adw.ToastOverlay;
  disk_capacity: DiskCapacity;
  action_map: Gio.ActionMap;
  parent_window?: Gtk.Window;
}) {
  const builder = new TypedBuilder();
  builder.add_from_resource(`${Consts.APP_RDNN}/ui/addon-details.ui`);
  const page = builder.get_typed_object<Gtk.Box>('page');
  page_slot.child = page;

  const present = AddonDetailsPagePresenter({
    addon_storage,
    disk_capacity,
    toaster,
    builder_cont: builder,
    action_map,
    leaflet,
    leaflet_page: leaflet_details_page,
  })

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
        Adw1.Toast.builder()
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

function AddonDetailsPagePresenter(
{ addon_storage,
  disk_capacity,
  toaster,
  builder_cont,
  action_map,
  leaflet,
  leaflet_page,
}:
{ addon_storage: AddonStorage;
  disk_capacity: DiskCapacity;
  toaster?: Adw.ToastOverlay;
  builder_cont?: TypedBuilder;
  action_map: Gio.ActionMap;
  leaflet: Adw.Leaflet;
  leaflet_page: string;
}) {
  const builder = (() => {
    if (builder_cont) return builder_cont;
    const builder = new TypedBuilder();
    builder.add_from_resource(`${Consts.APP_RDNN}/ui/addon-details.ui`);
    return builder;
  })();

  let currentAddon: string | undefined;

  function reset() {

  }

  function present(id: string) {
    reset();
    const addon = addon_storage.get(id);
    if (addon === undefined) {
      console.warn(`Couldn\'t find add-on \"${id}\". Refuse to navigate. Quitting...`);
      toaster?.add_toast(
        Adw1.Toast.builder()
        .title('Add-on data cannot be found!')
        .build());
      return;
    }

    currentAddon = id;
    const id_gvariant = GLib.Variant.new_string(id);
    const isRemote = addon.steamId !== undefined;
    const steamid = addon.steamId || '';
    const url = make_workshop_item_url(steamid);
    const data = builder.get_typed_object<BuilderData>('data');
    data.id = id_gvariant;

    const title = builder.get_typed_object<Gtk.Label>('title');
    title.set_label(addon.title || 'Untitled add-on');
    const subtitle = builder.get_typed_object<Gtk.Label>('subtitle');
    subtitle.set_label(creators2humanreadable(addon.creators));
    const size = (() => {
      if (addon.subdir)
        return disk_capacity.eval_size(addon.subdir);
      return null;
    })();
    const used_label = builder.get_typed_object<Gtk.Label>('used');
    used_label.set_label((() => {
          if (size !== null)
            return `${Files.bytes2humanreadable(size)} Used`;
          return 'Unknown size';
        })());

    const tags = builder.get_typed_object<Gtk.Box>('tags');
    const tag_empty = builder.get_typed_object<Gtk.Button>('tag-empty');
    if (!addon.has_archive_lite()) {
      tag_empty.set_visible(true);
    } else {
      tag_empty.set_visible(false);
    }
    if (tag_empty.get_visible()) {
      tags.set_visible(true);
    } else {
      tags.set_visible(false);
    }

    const stvpkid = builder.get_typed_object<FieldRow>('stvpkid');
    stvpkid.set_value(addon.vanityId);
    data.id = GLib.Variant.new_string(addon.id);

    const steamid_row = builder.get_typed_object<FieldRow>('steamid');
    data.steamid = GLib.Variant.new_string(steamid);
    const website_row = builder.get_typed_object<Adw.ActionRow>('visit-steam-row');
    website_row.set_subtitle(url);
    data.steam_url = GLib.Variant.new_string(url);
    data.subdir_uri = GLib.Variant.new_string(addon.subdir.get_uri());

    if (isRemote) {
      steamid_row.set_value((() => {
        if (addon.steamId)
          return addon.steamId;
        return 'Unknown';
      })());
      steamid_row.set_visible(true);
      website_row.set_visible(true);
    } else {
      steamid_row.set_visible(false);
      website_row.set_visible(false);
    }

    //leaflet.set_visible_child_name('addon-details-page');
    leaflet.set_visible_child_name(leaflet_page);
  }

  addon_storage.connect_after(AddonStorage.Signals.addons_changed, () => {
    if (currentAddon === undefined) {
      return;
    }
    if (addon_storage.idmap.has(currentAddon)) {
      return;
    }

    const back = action_map.lookup_action('back');
    if (back === null) {
      return;
    }
    if (leaflet.get_visible_child_name() !== leaflet_page) {
      return;
    }
    back.activate(null);
  });

  return present;
}
