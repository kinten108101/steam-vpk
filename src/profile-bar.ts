import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import { GtkChildren, GtkTemplate, param_spec_boolean, param_spec_object, param_spec_string, registerClass } from './steam-vpk-utils/utils.js';
import { APP_RDNN } from './const.js';

export class ProfileBar extends Adw.Bin {
  static [GObject.properties] = {
    active: param_spec_boolean({ name: 'active' }),
    primary_button: param_spec_object({ name: 'primary-button', objectType: Gtk.ToggleButton.$gtype }),
    status_request: param_spec_string({ name: 'status-request', default_value: '' }),
  };

  static [GtkTemplate] = `resource://${APP_RDNN}/ui/profile-bar.ui`;

  static [GtkChildren] = [ 'profile_label', 'primary_button' ];

  static {
    registerClass({}, this);
  };

  profile_label!: Gtk.Label;
  primary_button!: Gtk.ToggleButton;
  status_request!: string;

  constructor(params = {}) {
    super(params);
    const flags = GObject.BindingFlags.SYNC_CREATE;
    this.bind_property_full('status_request',
      this.profile_label, 'label',
      flags,
      (_binding, from: any) => {
        if (from === null) {
          console.log('from is nul');
          return [false, ''];
        }
        return [true, from === '' ? '(no profile)' : from];
      },
      null as unknown as GObject.TClosure<any, any>);
  }

  send_status_update(msg: string) {
    this.profile_label.set_label(msg);
  }
}
