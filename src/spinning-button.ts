import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import {
  GtkChildren,
  GtkInternalChildren,
  GtkTemplate,
  param_spec_boolean,
  param_spec_object,
  registerClass,
} from './steam-vpk-utils/utils.js';
import { APP_RDNN } from './const.js';

export default class SpinningButton extends Gtk.Box {
  static [GObject.properties] = {
    spinning: param_spec_boolean({ name: 'spinning' }),
    button: param_spec_object({ name: 'button', objectType: Gtk.Button.$gtype }),
  };

  static [GtkTemplate] = `resource://${APP_RDNN}/ui/spinning-button.ui`;

  static [GtkInternalChildren] = [
    'stack',
  ];

  static [GtkChildren] = [
    'button',
  ];

  static {
    registerClass({}, this);
  }

  spinning!: boolean;
  button!: Gtk.Button;
  _stack!: Adw.ViewStack;

  constructor(params = {}) {
    super(params);
    this.connect('notify::spinning', this._update_spinning.bind(this));
    this._update_spinning();
  }

  _update_spinning() {
    if (this.spinning) {
      this._stack.set_visible_child_name('spinning');
    } else {
      this._stack.set_visible_child_name('default');
    }
  }
}
