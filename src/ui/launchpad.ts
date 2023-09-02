import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import GObject from 'gi://GObject';

import {
  GtkChildren,
  GtkTemplate,
  param_spec_object,
  registerClass,
} from '../steam-vpk-utils/utils.js';
import { APP_RDNN } from '../utils/const.js';
import { AddonEntry, Addonlist, AddonlistPageItem } from '../model/addonlist.js';
import LaunchpadRow from './launchpad-rows.js';

export class LaunchpadPage extends Adw.Bin {
  static [GObject.properties] = {
    loadorder: param_spec_object({ name: 'loadorder', objectType: Gio.ListStore.$gtype }),
  };
  static [GtkTemplate] = `resource://${APP_RDNN}/ui/launchpad-page.ui`;
  static [GtkChildren] = [ 'addonlist_box', 'stack' ];

  static {
    registerClass({}, this);
  }

  addonlist!: Gtk.ListView;
  addonlist_box!: Gtk.ListBox;
  stack!: Adw.ViewStack;

  loadorder: Addonlist = new Addonlist;

  constructor(params = {}) {
    super(params);
    this.loadorder.connect('notify::n-items', this.update_list_appearance);
    this._setup_boxedlist();
  }

  _setup_boxedlist() {
    this.addonlist_box.bind_model(this.loadorder.sort_model, (item: GObject.Object) => {
      if (!(item instanceof AddonlistPageItem)) throw new Error;
      const widget = new LaunchpadRow();
      if (item instanceof AddonEntry && widget instanceof LaunchpadRow) {
        widget.bind_with_item(item);
      } else throw Error('Unrecognized combination');
      return widget;
    });
  }

  _setup_listview() {
    const factory = new Gtk.SignalListItemFactory();
    const list_item_data = new WeakMap<GObject.Object, {
      bindings: GObject.Binding[];
      signals: number[];
    }>();
    factory.connect('setup', (_obj, list_item: Gtk.ListItem) => {
      console.log('setup');
      const widget = new LaunchpadRow();
      list_item.set_child(widget);
    });
    factory.connect('bind', (_obj, list_item: Gtk.ListItem) => {
      console.log('bind');
      const data = {
        bindings: [] as GObject.Binding[],
        signals: [] as number[],
      }
      list_item_data.set(list_item.item, data);
      const item = list_item.item;
      if (!(item instanceof AddonlistPageItem)) throw new Error;
      const widget = list_item.child;
      if (item instanceof AddonEntry && widget instanceof LaunchpadRow) {
        const { bindings, signals } = widget.bind_with_item(item);
        data.bindings.push(
          ...bindings,
        );
        data.signals.push(
          ...signals,
        );
      } else throw Error('Unrecognized combination');
    });
    factory.connect('unbind', (_obj, list_item: Gtk.ListItem) => {
      console.log('unbind');
      const data = list_item_data.get(list_item.item);
      if (data === undefined) {
        console.log('Data not available to unbind. Skipping...');
        return;
      }
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
    this.addonlist.set_model(new Gtk.NoSelection({ model: this.loadorder.sort_model }));
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
