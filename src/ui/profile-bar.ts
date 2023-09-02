import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import {
  GtkChildren,
  GtkTemplate,
  param_spec_boolean,
  param_spec_object,
  param_spec_string,
  registerClass,
} from '../steam-vpk-utils/utils.js';
import { APP_RDNN } from '../utils/const.js';

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
    this._setup_status();
    this._setup_actionable();
  }

  _setup_status() {
    this.bind_property_full('status_request', this.profile_label, 'label',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: string | null) => {
        if (from === null) {
          return [false, ''];
        }
        return [true, from === '' ? 'no profile' : from];
      },
      null as unknown as GObject.TClosure);
  }

  _setup_actionable() {
    this.primary_button.bind_property_full('active', this.primary_button, 'action-target',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: boolean) => {
        return [true, GLib.Variant.new_boolean(from)];
      }, null as unknown as GObject.TClosure);
    // For some reasons, GtkToggleButton with an action specified will act like a GtkButton aka not toggleable.
    // This is a workaround
    this.primary_button.connect('clicked', () => {
      this.primary_button.set_active(!this.primary_button.get_active());
    });
  }
}
