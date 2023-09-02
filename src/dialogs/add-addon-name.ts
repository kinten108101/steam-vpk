import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import { AsyncSignalMethods, addAsyncSignalMethods } from '../utils/async-signals.js';
import { GtkInternalChildren, GtkTemplate, registerClass } from '../steam-vpk-utils/utils.js';
import { APP_RDNN } from '../utils/const.js';

type Signals = 'setup';

export default interface AddAddonName extends AsyncSignalMethods<Signals> {
  connect_signal(signal: 'setup', callback: ($obj: this) => Promise<boolean>): ($obj: this) => Promise<boolean>;
  _emit_signal(signal: 'setup'): Promise<boolean>;
}
export default class AddAddonName extends Adw.Window {
  static [GtkTemplate] = `resource://${APP_RDNN}/ui/add-addon-name.ui`;
  static [GtkInternalChildren] = [
    'name_bar',
    'scan_button',
  ];

  static {
    registerClass({}, this);
    addAsyncSignalMethods(this.prototype);
  }

  _name_bar!: Adw.EntryRow;
  _scan_button!: Gtk.Button;

  constructor(params: Adw.Window.ConstructorProperties = {}) {
    super(params);
    this._setup_actionable();
    this._setup_actions();
  }

  _setup_actionable() {
    this._name_bar.bind_property_full('text', this._scan_button, 'action-target', GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: string | null) => {
        if (from === null) return [true, GLib.Variant.new_string('')];
        return [true, GLib.Variant.new_string(from)];
      }, null as unknown as GObject.TClosure);
  }

  vfunc_realize() {
    super.vfunc_realize();
    this._emit_signal('setup');
  }

  _setup_actions() {
    const actions = new Gio.SimpleActionGroup();

    const detect = new Gio.SimpleAction({
      name: 'detect',
      parameter_type: GLib.VariantType.new('s'),
    });
    detect.connect('activate', (_action, parameter) => {
      if (parameter === null) throw new Error;
      const [id] = parameter.get_string();
      if (id === null) throw new Error;

    });
    actions.add_action(detect);

    this.insert_action_group('add-addon-name', actions);
  }
}
