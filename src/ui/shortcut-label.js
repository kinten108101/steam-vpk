import Gtk from 'gi://Gtk';
import GObject from 'gi://GObject';
import Adw from 'gi://Adw';
import { getApplication } from '../application.js';

export class ShortcutLabel extends Adw.Bin {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkShortcutLabel',
      Properties: {
        action_name: GObject.ParamSpec.string(
          'action-name', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
      },
    }, this);
  }

  /**
   * @type {string | null}
   */
  // @ts-expect-error
  action_name;

  /**
   * @type {!Gtk.ShortcutLabel}
   */
  // @ts-expect-error
  child;

  constructor(params = {}) {
    const child = new Gtk.ShortcutLabel;
    super({
      child,
      ...params,
    });
    this.connect('notify::action-name', this._update_accel.bind(this));
    this._update_accel();
  }

  _update_accel() {
    if (this.action_name === null) return;
    const app = getApplication();
    const accels = app.get_accels_for_action(this.action_name);
    if (accels.length < 1) return;
    const accel = accels[0];
    if (accel === undefined) return;
    this.child.set_accelerator(accel);
  }
}
