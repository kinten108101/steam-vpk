import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import StatusManager, { BuildStatus, ErrorStatus, Status, StatusKlasses } from "../model/status-manager.js";
import { ProfileBar } from '../ui/profile-bar.js';
import HeaderBox from '../ui/headerbox.js';

/**
 * @typedef {import("@girs/gjs").SignalMethods} SignalMethods
 */

/**
 * @implements {SignalMethods}
 */
export class HeaderboxFactory {
  static {
    imports.signals.addSignalMethods(this.prototype);
  }

  /**
   * @type {{
   *   (signal: 'bind', cb: ($obj: HeaderboxFactory, item: Status) => void): number;
   *   (signal: 'unbind', cb: ($obj: HeaderboxFactory, item: Status | null) => void): number;
   *   (signal: 'empty', cb: ($obj: HeaderboxFactory) => void): number;
   *   (signal: 'nonempty', cb: ($obj: HeaderboxFactory, item: Status) => void): number;
   * }}
   */
  // @ts-expect-error
  connect;

  // @ts-expect-error
  disconnect;

  // @ts-expect-error
  disconnectAll;

  // @ts-expect-error
  emit;

  // @ts-expect-error
  signalHandlerIsConnected;

  /**
   * @type {Status | null | undefined}
   */
  current = undefined;

  /**
   * @type {Gio.ListStore<Status> | undefined}
   */
  #model;

  /**
   * @param {Gio.ListStore<Status>} model
   */
  set_model(model) {
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
    const new_top = new_idx >= 0 ? (/** @type {Status | null} */ (this.#model.get_item(new_idx))) : null;
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

/**
 * @param {{
 *   status_manager: StatusManager;
 *   headerbox: HeaderBox;
 *   profile_bar: ProfileBar;
 * }} params
 */
export default function StatusBroker(
{ status_manager,
  headerbox,
  profile_bar,
}) {
  /**
   * @type {WeakMap<Status, { binds: GObject.Binding[] }>}
   */
  const binding_store = new WeakMap;

  /**
   * @param {ErrorStatus} item
   */
  function BindError(item) {
    /**
     * @type {GObject.Binding[]}
     */
    const binds = [];

    headerbox.bind_status('error', (_obj, title, description) => {
      title.set_label('A Problem Has Occurred');

      const using_short = item.bind_property(
        'short', profile_bar, 'status-request',
        GObject.BindingFlags.BIDIRECTIONAL | GObject.BindingFlags.SYNC_CREATE);

      binds.push(using_short);

      const using_msg = item.bind_property(
        'msg', description, 'label',
        GObject.BindingFlags.BIDIRECTIONAL | GObject.BindingFlags.SYNC_CREATE);

      binds.push(using_msg);

    });

    binding_store.set(item, {
      binds,
    });
  }

  function BindBuild(/** @type {BuildStatus} */ item) {
    /**
     * @type {GObject.Binding[]}
     */
    const binds = [];

    headerbox.bind_status('build', (_obj, build_box) => {
      const using_status_in_bar = item.bind_property(
        'status', profile_bar, 'status-request',
        GObject.BindingFlags.SYNC_CREATE);

      binds.push(using_status_in_bar);

      const using_status_in_page = item.bind_property(
        'status', build_box, 'status',
        GObject.BindingFlags.SYNC_CREATE);

      binds.push(using_status_in_page);

      const using_elapsed = item.bind_property(
        'elapsed', build_box, 'elapsed',
        GObject.BindingFlags.SYNC_CREATE);

      binds.push(using_elapsed);

      const using_finish = item.bind_property_full(
        'finished', build_box, 'title-type',
        GObject.BindingFlags.SYNC_CREATE,
        /**
         * @param {boolean | null} from
         * @return {[boolean, import('../ui/headerbox/build.js').HeaderboxBuildEnums.TitleType]}
         */
        (_binding, from) => {
          if (from === null) return [false, 'in-progress'];
          if (from) {
            return [true, 'done'];
          } else {
            return [true, 'in-progress'];
          }
        }, () => {});

      binds.push(using_finish);

      const using_time_unit = item.bind_property_full(
        'time-unit', build_box, 'time-unit-word',
        GObject.BindingFlags.SYNC_CREATE,
        /**
         * @param {BuildStatus.TimeUnit | null} from
         * @return {[boolean, import('../ui/headerbox/build.js').HeaderboxBuildEnums.TimeUnitWord]}
         */
        (_binding, from) => {
          if (from === null) return [false, 's'];
          switch (from) {
          case 'second':
            return [true, 's'];
          case 'milisecond':
            return [true, 'ms'];
          default:
            throw new Error;
          }
        }, () => {});

      binds.push(using_time_unit);

    });

    binding_store.set(item, {
      binds,
    });
  }

  const binder_map = {
    get:
    /**
     * @type {{
     *   (klass: typeof ErrorStatus): typeof BindError;
     *   (klass: typeof BuildStatus): typeof BindBuild;
     * }}
     */
    ((klass) => {
      switch (klass) {
      case ErrorStatus:
        return BindError;
      case BuildStatus:
        return BindBuild;
      default:
        throw new Error;
      }
    }),
  };

  const factory = new HeaderboxFactory();
  factory.connect('bind', (_obj, item) => {
    for (const klass of StatusKlasses) {
      if (item instanceof klass) {
        // @ts-expect-error
        binder_map.get(klass)(item);
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
