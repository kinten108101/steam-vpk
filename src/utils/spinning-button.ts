import Gtk from 'gi://Gtk';
import GObject from 'gi://GObject';
import { gobjectClass } from "./decorator.js";

/**
 * @deprecated Use ../spinning-button.js instead.
 */
@gobjectClass({
  GTypeName: 'Gtk1SpinningButton',
  Properties: {
    'is-spinning': GObject.ParamSpec.boolean(
      'is-spinning', 'is-spinning', 'is-spinning',
      GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT, false),
  },
})
export class SpinningButton extends Gtk.Button {
  private spinner: Gtk.Spinner;
  label_saved: string;
  is_spinning!: boolean;
  post_spinning_sensitivity_getter_override: (() => boolean) | undefined;

  constructor(param = {}) {
    super(param);
    this.spinner = new Gtk.Spinner({ spinning: true });
    this.label_saved = this.get_label() || 'aaaaaa'; // FIXME(kinten): Why is this.label empty!?
  }

  set_spinning(val: boolean) {
    if (val) {
      this.child = this.spinner;
      return;
    }
    // @ts-ignore
    this.child = null;
  }
}
