import Gtk from 'gi://Gtk';
import GObject from 'gi://GObject';
import * as Utils from '../steam-vpk-utils/utils.js';

export default class SpinningButton extends Gtk.Button {
  static {
    Utils.registerClass({
      Properties: {
        'is-spinning': GObject.ParamSpec.boolean(
          'is-spinning', 'is-spinning', 'is-spinning',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT, false),
      },
    }, this)
  }
  private spinner: Gtk.Spinner;
  label_saved: string;
  is_spinning!: boolean;
  post_spinning_sensitivity_getter_override: (() => boolean) | undefined;

  constructor(param = {}) {
    super(param);
    this.spinner = new Gtk.Spinner({ spinning: true });
    this.label_saved = 'aaaaaa'; // FIXME(kinten): Why is this.label empty!?
    this.connect('notify::label', () => { // workaround
      this.label_saved = this.get_label() || 'bbbbbb';
    });
  }
  /*

  set_spinning(val: boolean) {
    // here we're mutating gtkbutton to get the desired appearance. Instead we can create another button for different state, then its just turning on and off.
    if (val) {
      this.spinner.set_parent(this);
      this.set_label('');
      this.set_sensitive(false);
      return;
    }
    this.spinner.unparent();
    if (this.label_saved !== 'aaaaaa') this.set_label(this.label_saved);
    this.set_sensitive((() => {
          if (this.post_spinning_sensitivity_getter_override) {
            return this.post_spinning_sensitivity_getter_override();
          }
          return true;
        })());
  }

  */

  set_spinning(val: boolean) {
    if (val) {
      this.child = this.spinner;
      return;
    }
    // @ts-ignore
    this.child = null;
  }
}
