import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import { GtkChildren, GtkTemplate, registerClass } from './utils.js';
import { APP_RDNN } from './const.js';

export class ProfileBar extends Adw.Bin {
  static [GtkTemplate] = `resource://${APP_RDNN}/ui/profile-bar.ui`;

  static [GtkChildren] = [ 'profile_label' ];

  static {
    registerClass({}, this);
  };

  [child: string]: any;

  get_typed_template_child<T extends GObject.Object>(name: string): T | undefined {
    return this[name] as T | undefined;
  }

  send_status_update(msg: string) {
    this.get_typed_template_child<Gtk.Label>('profile_label')?.set_label(msg);
  }
}
