import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import StatusManager, { ErrorStatus, Status } from "./status.js";
import type { SignalMethods } from '@girs/gjs';
import HeaderBox from './headerbox.js';

export interface HeaderboxFactory extends SignalMethods {
  connect(signal: 'bind', cb: ($obj: this, item: Status) => void): number;
  connect(signal: 'unbind', cb: ($obj: this, item: Status | null) => void): number;
  connect(signal: 'empty', cb: ($obj: this) => void): number;
  connect(signal: 'nonempty', cb: ($obj: this, item: Status) => void): number;
}
export class HeaderboxFactory {
  static {
    imports.signals.addSignalMethods(this.prototype);
  }

  current: Status | null | undefined = undefined;
  #model: Gio.ListStore<Status> | undefined;

  set_model(model: Gio.ListStore<Status>) {
    this.#model = model;
    this.setup_model();
  }

  setup_model() {
    if (this.#model === undefined) return;
    this.#model.connect('items-changed', this.on_items_changed.bind(this));
  }

  on_items_changed() {
    if (this.#model === undefined) return;
    const new_idx = this.#model.get_n_items() - 1;
    const new_top = new_idx >= 0 ? <Status | null>this.#model.get_item(new_idx) : null;
    if (new_top === this.current) return;
    this.emit('unbind', this.current);
    this.current = new_top;
    if (this.current === null) {
      this.emit('empty');
      return;
    }
    this.emit('nonempty', this.current);
    this.emit('bind', this.current);
  }
}

export default function StatusPresent(
{ status_manager,
  headerbox,
}:
{ status_manager: StatusManager;
  headerbox: HeaderBox;
}) {
  const factory = new HeaderboxFactory();
  const binding_store: WeakMap<Status, { bind_desc: GObject.Binding }> = new WeakMap;
  factory.connect('bind', (_obj, item) => {
    if (!(item instanceof ErrorStatus)) return;
    headerbox.bind_status('error', (_obj, title, description) => {
      title.set_label('A Problem Has Occurred');
      const flags = GObject.BindingFlags.BIDIRECTIONAL | GObject.BindingFlags.SYNC_CREATE;
      const bind_desc = item.bind_property('msg', description, 'label', flags);
      binding_store.set(item, {
        bind_desc,
      });
    });
  });
  factory.connect('unbind', (_obj, item) => {
    if (item === null) return;
    const bindings = binding_store.get(item);
    if (bindings === undefined) return;
    const { bind_desc } = bindings;
    bind_desc.unbind();
  });
  factory.connect('empty', () => {
    headerbox.set_empty_status('status_box', true);
  });
  factory.connect('nonempty', () => {
    headerbox.set_empty_status('status_box', false);
  });
  factory.set_model(status_manager);

  function init_headerbox() {
    factory.on_items_changed();
    return methods;
  }

  const methods = {
    init_headerbox,
  };
  return methods;
}
