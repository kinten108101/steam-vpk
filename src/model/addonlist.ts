import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';

import AddonBoxClient from '../backend/client.js';

export class AddonlistItem extends GObject.Object {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkAddonlistPageItem',
      Properties: {
        'id': GObject.ParamSpec.string(
          'id', '', '',
          GObject.ParamFlags.READWRITE,
          null),
        'pos': GObject.ParamSpec.uint64(
          'pos', '', '',
          GObject.ParamFlags.READWRITE,
          0, Number.MAX_SAFE_INTEGER,
          0),
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

export class AddonEntry extends AddonlistItem {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkAddonEntry',
      Properties: {
        name: GObject.ParamSpec.string(
          'name', '', '',
          GObject.ParamFlags.READWRITE,
          null),
        enabled: GObject.ParamSpec.boolean(
          'enabled', '', '',
          GObject.ParamFlags.READWRITE,
          true),
        description: GObject.ParamSpec.string(
          'description', 'description', 'description',
          GObject.ParamFlags.READWRITE,
          null),
        last_update: GObject.ParamSpec.jsobject(
          'last-update', '', '',
          GObject.ParamFlags.READWRITE),
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
  } & ConstructorParameters<typeof AddonlistItem>[0]) {
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

export class SeparatorEntry extends AddonlistItem {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkSeparatorEntry',
      Properties: {
        name: ,
      },
    }, this);
  }
}

export class Addonlist extends Gio.ListStore {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkAddonlist',
    }, this);
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
      if (!(a instanceof AddonlistItem && b instanceof AddonlistItem)) {
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
