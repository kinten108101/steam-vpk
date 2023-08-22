import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import { GtkChildren, GtkTemplate, param_spec_boolean, param_spec_object, registerClass } from './steam-vpk-utils/utils.js';
import { APP_RDNN } from './const.js';

export class ProfileBar extends Adw.Bin {
  static [GObject.properties] = {
    active: param_spec_boolean({ name: 'active' }),
    primary_button: param_spec_object({ name: 'primary-button', objectType: Gtk.ToggleButton.$gtype }),
  };

  static [GtkTemplate] = `resource://${APP_RDNN}/ui/profile-bar.ui`;

  static [GtkChildren] = [ 'profile_label', 'primary_button' ];

  static {
    registerClass({}, this);
  };

  profile_label!: Gtk.Label;
  primary_button!: Gtk.ToggleButton;

  send_status_update(msg: string) {
    this.profile_label.set_label(msg);
  }
}
