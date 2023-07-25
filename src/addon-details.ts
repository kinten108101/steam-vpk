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

class BuilderData extends GObject.Object {
  static {
    Utils.registerClass({
      Properties: {
        id: GObject.param_spec_variant('id', 'id', 'id', GLib.VariantType.new('s'), GLib.Variant.new_string('s'), Utils.g_param_default),
      }
    }, this);
  }

  id!: GLib.Variant;

  constructor(params: { id: GLib.Variant }) {
    super(params);
  }
}

class FieldRow extends Adw.ActionRow {
  static {
    Utils.registerClass({
      Properties: {
        value: GObject.ParamSpec.string('value', 'value', 'value', Utils.g_param_default, null),
      },
      Template: `resource://${Consts.APP_RDNN}/ui/field-row.ui`,
    }, this);
  }

  value!: string;

  set_value(val: string) {
    this.value = val;
  }
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
{ main_window,
  leaflet,
  page_slot,
  addonStorage,
  toaster,
  diskCapacity,
  action_map,
}:
{ main_window: Gtk.Window,
  leaflet: Adw.Leaflet,
  page_slot: Adw.Bin,
  addonStorage: AddonStorage,
  toaster: Adw.ToastOverlay,
  diskCapacity: DiskCapacity,
  action_map: Gio.ActionMap,
}) {
  const addonActionGroup = new Gio.SimpleActionGroup();
  main_window.insert_action_group('addon-details', addonActionGroup);

  const builder = new TypedBuilder();
  builder.add_from_resource(`${Consts.APP_RDNN}/ui/addon-details.ui`);
  const page = builder.get_typed_object<Gtk.Box>('page');
  page_slot.child = page;

  let currentAddon: string | undefined;

  const seeDetails = new Gio.SimpleAction({
    name: 'see-details',
    parameter_type: GLib.VariantType.new('s'),
  });
  seeDetails.connect('activate', (_action, parameter) => {
    console.debug('<<addons.see-details>>');
    const id = Utils.g_variant_unpack<string>(parameter, 'string');
    const addon = addonStorage.get(id);
    if (addon === undefined) {
      console.warn(`Coulnd\'t find add-on \"${id}\". Refuse to navigate. Quitting...`);
      toaster.add_toast(
        Adw1.Toast.builder()
        .title('Add-on data cannot be found!')
        .build());
      return;
    }
    currentAddon = id;
    const isRemote = addon.steamId !== undefined;

    const data = builder.get_typed_object<BuilderData>('data');
    if (parameter !== null) {
      data.id = parameter;
    }
    const title = builder.get_typed_object<Gtk.Label>('title');
    title.set_label(addon.title || 'Untitled add-on');
    const subtitle = builder.get_typed_object<Gtk.Label>('subtitle');
    subtitle.set_label(addon.vanityId);
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

    const steamid = builder.get_typed_object<FieldRow>('steamid');
    if (isRemote) {
      steamid.set_value((() => {
        if (addon.steamId)
          return addon.steamId;
        console.warn(`Add-on ${addon.vanityId} declared as remote despite having no steam id?`);
        return 'Unknown';
      })());
      steamid.set_visible(true);
    } else {
      steamid.set_visible(false);
    }



    leaflet.navigate(Adw.NavigationDirection.FORWARD);
    console.debug('>>addons.see-details<<');
  });
  addonActionGroup.add_action(seeDetails);

  addonStorage.connect(AddonStorage.Signals.addons_changed, () => {
    if (currentAddon === undefined) return;
    if (addonStorage.idmap.has(currentAddon)) return;

    const back = action_map.lookup_action('back');
    if (back === null) {
      console.warn('Back action is not implemented!');
      return;
    }
    // FIXME(kinten): Also check if we're still at this page
    if (leaflet.get_visible_child() !== page) return;
    back.activate(null);
  });

}
