import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

export default interface PreferencesWindowInjectButtonStylesView {
  connect(signal: 'notify::selected', callback: (object: this, pspec: GObject.ParamSpec) => void): number;
  notify(signal: 'selected'): void;

  connect(signal: 'notify', callback: (object: this, pspec: GObject.ParamSpec) => void): number;
}

export default class PreferencesWindowInjectButtonStylesView extends GObject.Object {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkPreferencesWindowInjectButtonStyles',
      Properties: {
        selected: GObject.ParamSpec.uint64(
          'selected', '', '',
          GObject.ParamFlags.READABLE,
          0, Number.MAX_SAFE_INTEGER,
          0),
      },
    }, this);
  }

  _selected!: number;
  get selected() {
    return this._selected;
  }

  _dropdown: Adw.ComboRow;

  constructor(params: {
    dropdown: Adw.ComboRow;
  }) {
    const { dropdown, ...gparams } = params;
    super(gparams);
    this._dropdown = dropdown;
    this._dropdown.connect('notify::selected', () => {
      this._selected = this._dropdown.get_selected();
      this.notify('selected');
    });
  }

  get_model(): Gtk.StringList {
    const model = this._dropdown.get_model();
    if (!(model instanceof Gtk.StringList)) throw new Error;
    return model;
  }

  get_selected_item(): {
    get_string(): string;
  } & GObject.Object {
    const item = this._dropdown.get_selected_item();
    if (item === null) throw new Error;
    if (!(item instanceof GObject.Object)) throw new Error;
    if (!('get_string' in item)) throw new Error;
    if (typeof item.get_string !== 'function') throw new Error;
    return item as any;
  }

  get_selected() {
    return this._dropdown.get_selected();
  }

  set_selected(position: number) {
    return this._dropdown.set_selected(position);
  }
}
