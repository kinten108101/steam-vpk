import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import {
  param_spec_boolean,
  param_spec_string,
  param_spec_variant,
  registerClass,
} from '../steam-vpk-utils/utils.js';

export enum UseStates {
  USED = 'used',
  AVAILABLE = 'available',
};

export class RepositoryItem extends GObject.Object {
  static [GObject.properties] = {
    isRemote: param_spec_boolean({
      name: 'is-remote',
    }),
    name: param_spec_string({
      name: 'name',
    }),
    creator: param_spec_string({
      name: 'creator',
    }),
    description: param_spec_string({
      name: 'description',
    }),
    use_state: param_spec_string({
      name: 'use-state',
      default_value: UseStates.AVAILABLE,
    }),
    id_gvariant: param_spec_variant({
      name: 'id-gvariant',
      type: GLib.VariantType.new('s'),
      default_value: GLib.Variant.new_string('default id'),
    }),
    id: param_spec_string({
      name: 'id',
    }),
  };

  static {
    registerClass({}, this);
  }

  is_remote!: boolean;
  name!: string;
  creator!: string;
  description!: string;
  use_state!: UseStates;
  id!: string;
  id_gvariant!: GLib.Variant;

  constructor(params: {
    is_remote: boolean;
    name: string;
    creator: string;
    id: string;
    description: string;
  }) {
    super(params);
    this.id_gvariant = GLib.Variant.new_string(params.id);
  }

  set_use_state(val: UseStates) {
    //if (val === this.use_state) return;
    this.use_state = val;
  }
}

export default class RepositoryList extends Gio.ListStore<RepositoryItem> {
  static {
    registerClass({}, this);
  }

  exists: Map<string, RepositoryItem> = new Map;
  local_addons: Gtk.FilterListModel;
  remote_addons: Gtk.FilterListModel;

  constructor() {
    super();
    this.local_addons = new Gtk.FilterListModel({
      model: this,
      filter: (() => {
        const match_func: Gtk.CustomFilterFunc = (item) => {
          if (!(item instanceof RepositoryItem)) throw new Error;
          return !item.is_remote;
        };
        const filter = new Gtk.CustomFilter();
        filter.set_filter_func(match_func);
        return filter;
      })(),
    });
    this.remote_addons = new Gtk.FilterListModel({
      model: this,
      filter: (() => {
        const match_func: Gtk.CustomFilterFunc = (item) => {
          if (!(item instanceof RepositoryItem)) throw new Error;
          return item.is_remote;
        };
        const filter = new Gtk.CustomFilter();
        filter.set_filter_func(match_func);
        return filter;
      })(),
    });
  }

  refill(items: RepositoryItem[]) {
    const deletables: Map<string, RepositoryItem> = new Map(this.exists);
      items.forEach(x => {
        deletables.delete(x.id);
        if (this.exists.has(x.id)) {
          // row-scope update
        } else {
          // append
          this.append(x);
          this.exists.set(x.id, x);
        }
      });
      deletables.forEach(x => {
        const [found, idx] = this.find(x);
        if (!found) {
          console.log('Item not found?');
          return;
        }
        this.remove(idx);
        this.exists.delete(x.id);
      });
  }
}
