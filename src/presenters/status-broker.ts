import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import StatusManager, { BuildStatus, ErrorStatus, Status } from "../model/status-manager.js";
import type { SignalMethods } from '@girs/gjs';
import HeaderBox, { HeaderboxBuildTitleType } from '../ui/headerbox.js';
import { ProfileBar } from '../ui/profile-bar.js';

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

const StatusKlasses = [ErrorStatus, BuildStatus];
interface BinderMap extends WeakMap<Function, Function> {
  set(key: typeof ErrorStatus, fn: (item: ErrorStatus) => void): this;
  get(key: typeof ErrorStatus): (item: ErrorStatus) => void;
  set(key: typeof BuildStatus, fn: (item: BuildStatus) => void): this;
  get(key: typeof BuildStatus): (item: BuildStatus) => void;
}
class BinderMap extends WeakMap<Function, Function> {
}

export default function StatusBroker(
{ status_manager,
  headerbox,
  profile_bar,
}:
{ status_manager: StatusManager;
  headerbox: HeaderBox;
  profile_bar: ProfileBar;
}) {
  const factory = new HeaderboxFactory();
  const binding_store: WeakMap<Status, { binds: GObject.Binding[] }> = new WeakMap;
  const binder_map: BinderMap = new BinderMap;
  binder_map.set(ErrorStatus, (item: ErrorStatus) => {
    const store = {
      binds: [] as GObject.Binding[],
    };
    headerbox.bind_status('error', (_obj, title, description) => {
      title.set_label('A Problem Has Occurred');
      const flags = GObject.BindingFlags.BIDIRECTIONAL | GObject.BindingFlags.SYNC_CREATE;
      (<[string, GObject.Object, string][]>
      [
        ['short', profile_bar, 'status-request'],
        ['msg', description, 'label'],
      ]).forEach(([src_prop, tgt, tgt_prop]) => {
        const binding = item.bind_property(src_prop, tgt, tgt_prop, flags);
        store.binds.push(binding);
      });
    });
    binding_store.set(item, store);
  });
  binder_map.set(BuildStatus, (item: BuildStatus) => {
    const store = {
      binds: [] as GObject.Binding[],
    };
    headerbox.bind_status('build', (_obj, build_box) => {
      const flags = GObject.BindingFlags.SYNC_CREATE;
      (<[string, GObject.Object, string][]>
      [
        ['status', profile_bar, 'status-request'],
        ['status', build_box, 'status'],
        ['elapsed', build_box, 'elapsed'],
      ]).forEach(([src_prop, tgt, tgt_prop]) => {
        const binding = item.bind_property(src_prop, tgt, tgt_prop, flags);
        store.binds.push(binding);
      });
      const using_finish = item.bind_property_full('finished', build_box, 'title-type', flags,
        (_binding, from: boolean | null): [boolean, HeaderboxBuildTitleType] => {
          if (from === null) return [false, 'in-progress'];
          if (from) {
            return [true, 'done'];
          } else {
            return [true, 'in-progress'];
          }
        }, null as unknown as GObject.TClosure);
      store.binds.push(using_finish);
    });
    binding_store.set(item, store);
  });
  factory.connect('bind', (_obj, item) => {
    for (const klass of StatusKlasses) {
      if (item instanceof klass) {
        binder_map.get(klass as any)(item as any);
        return;
      }
    }
  });
  factory.connect('unbind', (_obj, item) => {
    if (item === null) return;
    const store = binding_store.get(item);
    if (store === undefined) return;
    const { binds } = store;
    binds.forEach(x => {
      x.unbind();
    });
  });
  factory.connect('empty', () => {
    profile_bar.status_request = '';
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
