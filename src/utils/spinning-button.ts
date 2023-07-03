import Gtk from 'gi://Gtk';
import GObject from 'gi://GObject';

import { gobjectClass, gobjectProp } from "./decorator.js";

@gobjectClass({
  GTypeName: 'Gtk1SpinningButton',
  Properties: {
    'is-spinning': GObject.ParamSpec.boolean(
      'is-spinning', 'is-spinning', 'is-spinning',
      GObject.ParamFlags.READWRITE, false),
  },
})
export class SpinningButton extends Gtk.Button {
  private spinner: Gtk.Spinner;
  private label_saved: string;
  @gobjectProp is_spinning!: boolean;
  post_spinning_sensitivity_getter_override: (() => boolean) | undefined;

  constructor(param = {}) {
    super(param);
    this.spinner = new Gtk.Spinner({ spinning: true });
    this.set_label(this.get_label());
    this.label_saved = this.get_label() || 'aaaaaa'; // FIXME(kinten): Why is this.label empty!?
  }

  set_spinning(val: boolean) {
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
}
