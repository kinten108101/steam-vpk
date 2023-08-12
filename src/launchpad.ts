import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import {
  GtkChildren,
  GtkTemplate,
  param_spec_object,
  registerClass,
} from './steam-vpk-utils/utils.js';
import { APP_RDNN } from './const.js';

export class LaunchpadPage extends Adw.Bin {
  static [GObject.properties] = {
    loadorder: param_spec_object({ name: 'loadorder', objectType: Gio.ListStore.$gtype }),
  };
  static [GtkTemplate] = `resource://${APP_RDNN}/ui/launchpad-page.ui`;
  static [GtkChildren] = [
    'addonlist',
    'stack',
  ];

  static {
    registerClass({}, this);
  }

  addonlist!: Gtk.ListBox;
  stack!: Adw.ViewStack;

  loadorder: Gio.ListStore<GObject.Object> = new Gio.ListStore({ item_type: GObject.Object.$gtype });

  constructor(params = {}) {
    super(params);
    this.loadorder.connect('notify::n-items', this.update_list_appearance);
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
