import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';

export enum UseStates {
  USED = 'used',
  AVAILABLE = 'available',
};

export class RepositoryItem extends GObject.Object {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkRepositoryItem',
      Properties: {
        id: GObject.ParamSpec.string(
          'id', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
        steamid: GObject.ParamSpec.string(
          'steamid', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
        remote: GObject.ParamSpec.boolean(
          'remote', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          false),
        subdir: GObject.ParamSpec.string(
          'subdir', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
        name: GObject.ParamSpec.string(
          'name', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
        creators: GObject.ParamSpec.jsobject(
          'creators', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT),
        description: GObject.ParamSpec.string(
          'description', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
        use_state: GObject.ParamSpec.string(
          'use-state', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
      },
    }, this);
  }

  id!: string;
  steamid!: string | null;
  remote!: boolean;
  subdir!: string | null;
  name!: string | null;
  creators!: { id: string }[] | null;
  description!: string | null;
  use_state!: UseStates | null;

  constructor(params: {
    id: string;
    steamid: string | null;
    remote: boolean | null;
    subdir: string | null;
    name: string | null;
    creators: { id: string }[] | null;
    description: string | null;
    use_state: UseStates | null;
  }) {
    super(params);
  }
}

export default class Repository extends Gio.ListStore<RepositoryItem> {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkRepository',
    }, this);
  }

  exists: Map<string, RepositoryItem> = new Map;
  local_addons: Gtk.FilterListModel;
  remote_addons: Gtk.FilterListModel;

  get(id: string) {
    return this.exists.get(id);
  }

  constructor() {
    super();
    this.local_addons = new Gtk.FilterListModel({
      model: this,
      filter: (() => {
        const match_func: Gtk.CustomFilterFunc = (item) => {
          if (!(item instanceof RepositoryItem)) throw new Error;
          return !item.remote;
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
          return item.remote;
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
