import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import Gtk from 'gi://Gtk';
import { ArrayElement } from '../utils/ts-helper.js';

export default class InjectButtonSet extends Gtk.Box {
  static Buttons = ['inject', 'hold', 'done'] as const;

  static ButtonStyles = ['minimal', 'blue', 'blue-pure'] as const;

  static {
    GObject.registerClass({
      GTypeName: 'StvpkInjectButtonSet',
      Properties: {
        id: GObject.param_spec_variant('id', '', '',
          GLib.VariantType.new('s'),
          GLib.Variant.new_string(''),
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT),
        button_style: GObject.ParamSpec.string('button-style', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          <InjectButtonSet['button_style']>'minimal'),
        buttons: GObject.ParamSpec.jsobject('buttons', '', '',
          GObject.ParamFlags.READABLE),
      },
      Template: `resource:///com/github/kinten108101/SteamVPK/ui/inject-button-set.ui`,
      InternalChildren: [
        'inject',
        'hold',
        'hold-spinner',
        'hold-icon',
        'done',
      ],
    }, this);
  }

  id!: GLib.Variant | null;
  button_style!: ArrayElement<(typeof InjectButtonSet)['ButtonStyles']>;
  _buttons!: { [key: string]: Gtk.Button };
  get buttons() {
    return this._buttons;
  }

  _inject!: {
    set_icon_name(name: 'play-symbolic' | 'play-large-symbolic'): void;
  } & Gtk.Button;
  _hold!: Gtk.Button;
  _hold_spinner!: Gtk.Spinner;
  _hold_icon!: {
    set_from_icon_name(name: 'stop-symbolic' | 'stop-large-symbolic'): void;
  } & Gtk.Image;
  _done!: Gtk.Button;

  constructor(params = {}) {
    super(params);
    this.reset();
    this.connect('notify::button-style', this._update_button_styles.bind(this));
    this._update_button_styles();
    this._buttons = {
      'inject': this._inject,
      'hold': this._hold,
      'done': this._done,
    };
  }

  _update_button_styles() {
    switch (this.button_style) {
    default:
    case 'minimal':
      this._inject.set_icon_name('play-symbolic');
      this._inject.remove_css_class('blue');
      this._hold_icon.set_from_icon_name('stop-symbolic');
      this._hold.remove_css_class('red');
      break;
    case 'blue':
      this._inject.set_icon_name('play-large-symbolic');
      this._inject.add_css_class('blue');
      this._hold_icon.set_from_icon_name('stop-large-symbolic');
      this._hold.add_css_class('red');
      break;
    case 'blue-pure':
      this._inject.set_icon_name('play-large-symbolic');
      this._inject.add_css_class('blue');
      this._hold_icon.set_from_icon_name('stop-symbolic');
      this._hold.remove_css_class('red');
      break;
    }
  }

  reset() {
    this.set_state_button('inject');
    this.hold_set_spinning(false);
  }

  hold_set_spinning(val: boolean) {
    if (val === true) {
      this._hold_spinner.set_visible(true);
      this._hold_icon.set_visible(false);
      this._hold.set_sensitive(false);
    } else {
      this._hold_spinner.set_visible(false);
      this._hold_icon.set_visible(true);
      this._hold.set_sensitive(true);
    }
  }

  set_id(val: string) {
    this.id = GLib.Variant.new_string(val);
  }

  set_state_button(target: ArrayElement<(typeof InjectButtonSet)["Buttons"]>) {
    for (const key in this.buttons) {
      const button = this.buttons[key];
      if (button === undefined) throw new Error;
      if (key === target) button.set_visible(true);
      else button.set_visible(false);
    }
  }
}
