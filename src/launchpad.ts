import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import Pango from 'gi://Pango';

import {
  GtkChildren,
  GtkTemplate,
  param_spec_object,
  param_spec_variant,
  registerClass,
} from './steam-vpk-utils/utils.js';
import { APP_RDNN } from './const.js';
import { MakeCompatPango, SteamMd2Pango } from './markup.js';

class AddonlistPageItem extends GObject.Object {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkAddonlistPageItem',
      Properties: {
        'name': GObject.ParamSpec.string('name', 'name', 'name', GObject.ParamFlags.READWRITE, ''),
        'id': GObject.ParamSpec.string('id', 'id', 'id', GObject.ParamFlags.READWRITE, ''),
        id_gvariant: param_spec_variant({ name: 'id-gvariant', type: GLib.VariantType.new('s') }),
        'enabled': GObject.ParamSpec.boolean('enabled', 'enabled', 'enabled', GObject.ParamFlags.READWRITE, true),
        'description': GObject.ParamSpec.string('description', 'description', 'description', GObject.ParamFlags.READWRITE, ''),
        'description-short': GObject.ParamSpec.string('description-short', '', '', GObject.ParamFlags.READWRITE, ''),
        'last-update': GObject.ParamSpec.string('last-update', 'last-update', 'last-update', GObject.ParamFlags.READWRITE, ''),
        'has-archive': GObject.ParamSpec.boolean('has-archive', 'has-archive', 'has-archive', GObject.ParamFlags.READWRITE, false),
        'install-missing-archive': GObject.ParamSpec.boolean('install_missing_archive', 'install_missing_archive', 'install_missing_archive', GObject.ParamFlags.READWRITE, false),
      },
    }, this);
  }

  static make(params: {
    name?: string;
    id?: string;
    enabled?: boolean;
    description?: string;
    timeUpdated?: Date;
    has_archive?: boolean;
    install_missing_archive?: boolean;
  }) {
    const obj = new AddonlistPageItem();
    obj['name'] = params.name !== undefined ? `${MakeCompatPango(params.name)}` : 'Unnamed';
    obj['id'] = params.id !== undefined ? params.id : '########';
    obj['id_gvariant'] = params.id !== undefined ? GLib.Variant.new_string(params.id) : GLib.Variant.new_string('');
    obj['enabled'] = params.enabled !== undefined ? params.enabled : false;
    obj['description'] = (() => {
      const markup = SteamMd2Pango(params.description || '');
      try {
        Pango.parse_markup(markup, -1, '_');
      } catch (error) {
        return MakeCompatPango(params.description || '');
      }
      return markup;
    })();
    obj['description_short'] = (() => {
      return MakeCompatPango(params.description || '').substring(0, 100);
    })();
    obj['last_update'] = (() => {
      const date = params.timeUpdated;
      if (date === undefined) return '';
      const display = `${date.toDateString()} @ ${date.toLocaleTimeString()}`;
      return display;
    })();
    obj['has_archive'] = params.has_archive || false;
    obj['install_missing_archive'] = params.install_missing_archive || false;
    return obj;
  }

  [key: string]: unknown;
}

export class LaunchpadRow extends Adw.ExpanderRow {
  static [GtkTemplate] = `resource://${APP_RDNN}/ui/launchpad-row.ui`;
  static [GtkChildren] = [
    'title-field',
    'description-field',
    'last-update-field',
    'toggle',
    'see-details',
    'remove-addon',
    'move-section',
    'popover-menu',
    'enter-position',
    'warning',
    'no-archive',
    'install-archive',
    'remove-small',
    'ztitle',
    'zsubtitle',
    'zexcerpt',
  ];

  static {
    registerClass({}, this);
  }

  [key: string]: any;
}

export class LaunchpadPage extends Adw.Bin {
  static [GObject.properties] = {
    loadorder: param_spec_object({ name: 'loadorder', objectType: Gio.ListStore.$gtype }),
  };
  static [GtkTemplate] = `resource://${APP_RDNN}/ui/launchpad-page.ui`;
  static [GtkChildren] = [ 'addonlist', 'stack' ];

  static {
    registerClass({}, this);
  }

  addonlist!: Gtk.ListView;
  stack!: Adw.ViewStack;

  loadorder: Gio.ListStore<GObject.Object> = new Gio.ListStore({ item_type: GObject.Object.$gtype });

  constructor(params = {}) {
    super(params);
    this.loadorder.connect('notify::n-items', this.update_list_appearance);
    const factory = new Gtk.SignalListItemFactory();
    const list_item_data = new WeakMap<Gtk.ListItem, {
      bindings: GObject.Binding[];
      signals: number[];
    }>();
    factory.connect('setup', (_obj, list_item: Gtk.ListItem) => {
      const widget = new LaunchpadRow();
      list_item.set_child(widget);
    });
    factory.connect('bind', (_obj, list_item: Gtk.ListItem) => {
      const data = {
        bindings: [] as GObject.Binding[],
        signals: [] as number[],
      }
      list_item_data.set(list_item, data);
      const obj = list_item.item;
      if (!(obj instanceof AddonlistPageItem)) throw new Error;
      const widget = list_item.child as LaunchpadRow;

      (<[string, Gtk.Widget, string][]>
      [
        ['name',        widget['ztitle'],      'label'],
        ['id',          widget['zsubtitle'],   'label'],
        ['description-short', widget['zexcerpt'], 'label'],
        ['name',        widget['title_field'], 'label'],
        ['enabled',     widget['toggle'],      'active'],
        ['description', widget['description_field'], 'label'],
        ['last_update', widget['last_update_field'], 'label'],
        ['has-archive', widget['no_archive'], 'visible'],
        ['install-archive', widget['install_archive'], 'visible'],
        ['id-gvariant', widget['install_archive'], 'action-target'],
        ['id-gvariant', widget['see_details'], 'action-target'],
        ['id-gvariant', widget['remove_addon'], 'action-target'],
      ]).forEach(([source_prop, target, target_prop]) => {
        const flags = GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL;
        const binding = obj.bind_property(source_prop, target, target_prop, flags);
        data.bindings.push(binding);
      });

      const moveUp = new Gio.MenuItem();
      moveUp.set_label('Move Up');
      moveUp.set_action_and_target_value('addons.move-up', obj['id_gvariant'] as GLib.Variant);
      (widget['move_section'] as Gio.Menu).append_item(moveUp);

      const moveDown = new Gio.MenuItem();
      moveDown.set_label('Move Down');
      moveDown.set_action_and_target_value('addons.move-down', obj['id_gvariant'] as GLib.Variant);
      (widget['move_section'] as Gio.Menu).append_item(moveDown);

      const update = () => {
        // target value must be the next state to the current state aka the inverse
        const gvariant = GLib.Variant.new_tuple([
          GLib.Variant.new_string(obj['id'] as string),
          GLib.Variant.new_boolean(!obj['enabled'] as boolean),
        ]);
        (widget['toggle'] as Gtk.Switch).set_action_target_value(gvariant);
      };
      const on_enabled = obj.connect('notify::enabled', update);
      update();
      data.signals.push(on_enabled);
    });
    factory.connect('unbind', (_obj, list_item: Gtk.ListItem) => {
      const data = list_item_data.get(list_item);
      if (data === undefined) throw new Error;
      data.bindings.forEach(x => {
        x.unbind();
      });
      const obj = list_item.item;
      data.signals.forEach(x => {
        obj.disconnect(x);
      });
    });
    factory.connect('teardown', (_obj, _list_item: Gtk.ListItem) => {

    });
    this.addonlist.set_factory(factory);
    this.addonlist.set_model(new Gtk.NoSelection({ model: this.loadorder }));
  }

  vfunc_realize(): void {
    super.vfunc_realize();
    this.update_list_appearance();
  }

  update_list_appearance = () => {
    if (this.loadorder.get_n_items() === 0) {
      this.stack.set_visible_child_name('empty');
    } else {
      this.stack.set_visible_child_name('main');
    }
  }
}
