import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import {
  g_param_default,
  registerClass,
} from '../steam-vpk-utils/utils.js';
import AddonBoxClient from '../backend/client.js';

export class AddonlistPageItem extends GObject.Object {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkAddonlistPageItem',
      Properties: {
        'id': GObject.ParamSpec.string('id', 'id', 'id', GObject.ParamFlags.READWRITE, ''),
        'pos': GObject.ParamSpec.uint64('pos', '', '', g_param_default, 0, Number.MAX_SAFE_INTEGER, 0),
      },
    }, this);
  }

  id!: string;
  pos!: number;

  constructor(params: {
    id: string,
    pos: number,
  }) {
    super(params);
  }
}

export class AddonEntry extends AddonlistPageItem {
  static {
    registerClass({
      Properties: {
        'name': GObject.ParamSpec.string('name', 'name', 'name', GObject.ParamFlags.READWRITE, ''),
        'enabled': GObject.ParamSpec.boolean('enabled', 'enabled', 'enabled', GObject.ParamFlags.READWRITE, true),
        'description': GObject.ParamSpec.string('description', 'description', 'description', GObject.ParamFlags.READWRITE, ''),
        'last-update': GObject.ParamSpec.jsobject('last-update', '', '', g_param_default),
      }
    }, this);
  }

  name!: string;
  enabled!: boolean;
  description!: string;

  constructor(params: {
    name?: string,
    enabled?: boolean,
    description?: string,
    last_update?: Date,
  } & ConstructorParameters<typeof AddonlistPageItem>[0]) {
    super(params);
  }

  async fetch_addon_data(client: AddonBoxClient) {
    // FIXME(kinten): Use data from addonlist instead of from backend
    const addon = await client.services.addons
      .call('Get', '(a{sv})', this.id)
        .catch(error => {
          logError(error);
        });
    this.name = addon['title'] || 'Untitled add-on';
    this.description = addon['description'] || 'No description';
  }
}

export class Addonlist extends Gio.ListStore {
  static {
    registerClass({}, this);
  }

  sort_model: Gtk.SortListModel;
  sorter: Gtk.Sorter;

  constructor(params = {}) {
    super({
      item_type: GObject.Object.$gtype,
      ...params,
    });
    this.sorter = new Gtk.CustomSorter();
    const sort_func: GLib.CompareDataFunc = (a, b) => {
      if (!(a instanceof AddonlistPageItem && b instanceof AddonlistPageItem)) {
        console.warn('Addonlist sort_func:', 'operands must be of type AddonlistPageItem');
        return 0;
      }
      return a.pos - b.pos;
    };
    (this.sorter as Gtk.CustomSorter).set_sort_func(sort_func);
    this.sort_model = new Gtk.SortListModel({
      sorter: this.sorter,
      model: this,
    });
  }
}
