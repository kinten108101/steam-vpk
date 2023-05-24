import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Gio from 'gi://Gio';

import { AddonlistPageItem, AddonlistSection, Js_AddonlistSection } from './addonlist-widgets.js';
import { get_data_item_list, get_loader_item_list, register_for_data_reload } from './addon-manager.js';
import { DataItem, LoaderItem } from './addon-schema.js';

export class AddonlistPage extends Gtk.Box {
  private _addonlist_page_content !: Gtk.Box;

  private default_store: Gio.ListStore = new Gio.ListStore(AddonlistPageItem.$gtype);
  private mixin_store: Gio.ListStore = new Gio.ListStore(AddonlistPageItem.$gtype);
  private default_section!: Js_AddonlistSection;
  private mixin_section!: Js_AddonlistSection;

  static {
    GObject.registerClass({
      GTypeName: 'AddonlistPage',
      // @ts-ignore
      Template: 'resource:///com/github/kinten108101/SteamVpk/ui/addonlist-page.ui',
      InternalChildren: [
        'addonlist_page_content',
      ],
    }, this);
  }

  constructor(params={}) {
    super(params);
    // this.default_store = new Gio.ListStore(AddonlistPageItem.$gtype);
    // this.mixin_store = new Gio.ListStore(AddonlistPageItem.$gtype);
    this.#create_sections();
    register_for_data_reload(() => {
      const loaderstore = get_loader_item_list();
      const datastore = get_data_item_list();
      const list = make_page_items(loaderstore, datastore);
      this.#bind_model(list);
      this.#refresh_layout();
    });
  }

  #create_sections() {
    this.default_section = new AddonlistSection({
      'title': 'Default add-ons',
      'model': this.default_store,
    });
    this.default_section.set_parent(this._addonlist_page_content);

    this.mixin_section = new AddonlistSection({
      'title': 'Mixins',
      'model': this.mixin_store,
    });
    this.mixin_section.set_parent(this._addonlist_page_content);
  }

  #bind_model(list: AddonlistPageItem[]) {
    this.default_store.remove_all();
    this.mixin_store.remove_all();
    list.forEach( item => {
      //item.connect('change', this.#refresh_layout.bind(this));

      if ( item.in_randomizer == false ) {
        this.default_store.append(item);
      }
      else {
        this.mixin_store.append(item);
      }
    });
  }

  #refresh_layout() {
    this.default_section.show();
    this.mixin_section.show();
    if (this.default_store.get_n_items() == 0) this.default_section.set_visible(false);
    if (this.mixin_store.get_n_items() == 0) this.mixin_section.set_visible(false);
    return;
  }
}

function make_page_items(loaderstore: LoaderItem[], datastore: DataItem[]): AddonlistPageItem[] {
  return loaderstore.map(loader_item => {
    const data_item: DataItem | undefined = datastore.find(x => x.id === loader_item.id);
    const page_item = new AddonlistPageItem;
    data_item?.bind_property('name', page_item, 'name', GObject.BindingFlags.BIDIRECTIONAL | GObject.BindingFlags.SYNC_CREATE);
    loader_item.bind_property('id', page_item, 'id', GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL);
    loader_item.bind_property('enabled', page_item, 'enabled', GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL);
    data_item?.bind_property('description', page_item, 'description', GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL);
    data_item?.bind_property('last_update', page_item, 'last_update', GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL);
    loader_item.bind_property('in_randomizer', page_item, 'in_randomizer', GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL);
    return page_item;
  });
}
