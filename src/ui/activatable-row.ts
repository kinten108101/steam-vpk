import Gtk from 'gi://Gtk';
import GObject from 'gi://GObject';
import Adw from 'gi://Adw';

/**
 * @deprecated since Adw 1.4.0. Use {@link Adw.SwitchRow} instead.
 */
export class SwitchRow extends Adw.ActionRow implements Gtk.Switch {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkSwitchRow',
      Properties: {
        active: GObject.ParamSpec.boolean(
          'active', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          false),
        state: GObject.ParamSpec.boolean(
          'state', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          false),
      },
    }, this);
  }

  active!: boolean;
  state!: boolean;

  _switch: Gtk.Switch;

  constructor(params = {}) {
    super(params);
    this._switch = new Gtk.Switch;
    this._switch.set_valign(Gtk.Align.CENTER);
    this.add_suffix(this._switch);
    this.set_activatable_widget(this._switch);
    this.bind_property('active', this._switch, 'active', GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL);
    this.bind_property('state', this._switch, 'state', GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL);
    this.bind_property('action-name', this._switch, 'action-name', GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL);
    this.bind_property('action-target', this._switch, 'action-target', GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL);
  }

  get_active(): boolean {
    return this.active;
  }

  get_state(): boolean {
    return this.state;
  }

  set_active(is_active: boolean): void {
    this.active = is_active;
  }

  set_state(state: boolean): void {
    this.state = state;
  }
}

/*
export class LocationRow extends Adw.ActionRow implements Gtk.Button {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkLocationRow',
      Properties: {
        has_frame: GObject.ParamSpec.boolean(
          'has-frame', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          false),
        has_frame_test: GObject.ParamSpec.boolean(
          'has-frame-test', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          false),
        label: GObject.ParamSpec.string(
          'label', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
      }
    }, this);
  }

  get has_frame() {
    return this._button.has_frame;
  }
  set has_frame(val: boolean) {
    this._button.has_frame = val;
  }
  get label() {
    return this._button.label;
  }
  set label(val: string | null) {
    this._button.label = val;
  }

  _button: Gtk.Button;

  constructor(params = {}) {
    super(params);
    this._button = new Gtk.Button;
    this._button.set_valign(Gtk.Align.CENTER);
    this.add_suffix(this._button);
    this.set_activatable_widget(this._button);
    this.bind_property('has-frame', this, 'has-frame-test', GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL);
    this.bind_property('action-name', this._button, 'action-name', GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL);
    this.bind_property('action-target', this._button, 'action-target', GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL);
  }

  get_has_frame(): boolean {
    return this._button.get_has_frame();
  }
  get_label(): string | null {
    return this._button.get_label();
  }
  set_has_frame(has_frame: boolean): void {
    this._button.set_has_frame(has_frame);
  }
  set_label(label: string | null): void {
    this._button.set_label(label);
  }
  vfunc_clicked(): void {
    return this._button.vfunc_clicked();
  }
}
*/
