import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import Gtk from 'gi://Gtk';
import {
  param_spec_variant,
  registerClass,
} from '../steam-vpk-utils/utils.js';
import { APP_RDNN } from '../utils/const.js';

export default class InjectButtonSet extends Gtk.Box {
  static Buttons = {
    inject: 'inject',
    hold: 'hold',
    done: 'done',
  };

  static ButtonStylesList = [
    'minimal',
    'blue',
  ];

  static {
    registerClass({
      Properties: {
        'prop-id': param_spec_variant({ name: 'id', type: GLib.VariantType.new('s'), default_value: GLib.Variant.new_string('placeholder id') }),
        button_style: GObject.ParamSpec.string('button-style', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          <InjectButtonSet['button_style']>'minimal'),
      },
      Template: `resource://${APP_RDNN}/ui/inject-button-set.ui`,
      Children: [
        'inject',
        'hold',
        'hold-spinner',
        'hold-icon',
        'done',
      ],
    }, this);
  }

  button_style!: 'minimal' | 'blue';

  inject!: {
    set_icon_name(name: 'play-symbolic' | 'play-large-symbolic'): void;
  } & Gtk.Button;
  hold!: Gtk.Button;
  hold_spinner!: Gtk.Spinner;
  hold_icon!: {
    set_from_icon_name(name: 'stop-symbolic' | 'stop-large-symbolic'): void;
  } & Gtk.Image;
  done!: Gtk.Button;

  id?: GLib.Variant;

  constructor(params = {}) {
    super(params);
    this.reset();
    this.connect('notify::button-style', this._update_button_styles.bind(this));
    this._update_button_styles();
  }

  _update_button_styles() {
    switch (this.button_style) {
    default:
    case 'minimal':
      this.inject.set_icon_name('play-symbolic');
      this.inject.remove_css_class('blue');
      this.hold_icon.set_from_icon_name('stop-symbolic');
      this.hold.remove_css_class('red');
      break;
    case 'blue':
      this.inject.set_icon_name('play-large-symbolic');
      this.inject.add_css_class('blue');
      this.hold_icon.set_from_icon_name('stop-large-symbolic');
      this.hold.add_css_class('red');
      break;
    }
  }

  reset() {
    this.set_state_button(InjectButtonSet.Buttons.inject);
    this.hold_set_spinning(false);
    this.make_sensitive(true);
  }

  make_sensitive(val: boolean) {
    if (val) {
      this.inject?.set_sensitive(true);
      this.hold?.set_sensitive(true);
      this.done?.set_sensitive(true);
    } else {
      this.inject?.set_sensitive(false);
      this.hold?.set_sensitive(false);
      this.done?.set_sensitive(false);
    }
  }

  hold_set_spinning(val: boolean) {
    if (val === true) {
      this.hold_spinner?.set_visible(true);
      this.hold_icon?.set_visible(false);
      this.hold?.set_sensitive(false);
    } else {
      this.hold_spinner?.set_visible(false);
      this.hold_icon?.set_visible(true);
      this.hold?.set_sensitive(true);
    }
  }

  set_id(val: string) {
    this.id = GLib.Variant.new_string(val);
  }

  set_state_button(name: string) {
    switch (name) {
    case InjectButtonSet.Buttons.inject:
      this.inject?.set_visible(true);
      this.hold?.set_visible(false);
      this.done?.set_visible(false);
      break;
    case InjectButtonSet.Buttons.hold:
      this.inject?.set_visible(false);
      this.hold?.set_visible(true);
      this.done?.set_visible(false);
      break;
    case InjectButtonSet.Buttons.done:
      this.inject?.set_visible(false);
      this.hold?.set_visible(false);
      this.done?.set_visible(true);
      break;
    default:
      throw new Error('Invalid button name');
    }
  }
}
