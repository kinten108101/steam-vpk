import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import { addAsyncSignalMethods } from '../utils/async-signals.js';

export default class AddAddonName extends (/** @type {typeof import("./add-addon-name.js").default} */(Adw.Window)) {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkAddAddonName',
      Template: 'resource:///com/github/kinten108101/SteamVPK/ui/add-addon-name.ui',
      InternalChildren: [
        'name_bar',
        'scan_button',
      ],
    }, this);
    addAsyncSignalMethods(this.prototype);
  }

  /**
   * @type {!Adw.EntryRow}
   */
  // @ts-expect-error
  _name_bar;

  /**
   * @type {!Gtk.Button}
   */
  // @ts-expect-error
  _scan_button;

  /**
   * @param {Adw.Window.ConstructorProperties} params
   */
  constructor(params = {}) {
    super(params);
    this._setup_actionable();
    this._setup_actions();
  }

  _setup_actionable() {
    this._name_bar.bind_property_full('text', this._scan_button, 'action-target', GObject.BindingFlags.SYNC_CREATE,
      (_binding, /** @type {string | null} */ from) => {
        if (from === null) return [true, GLib.Variant.new_string('')];
        return [true, GLib.Variant.new_string(from)];
      }, () => {});
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
