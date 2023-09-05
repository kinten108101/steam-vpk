import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import {
  dbus_params,
} from '../steam-vpk-utils/dbus-utils.js';
import {
  generate_timed_id,
} from '../steam-vpk-utils/utils.js';
import { getApplication } from '../application.js';
import { get_formatted_unique_name_str } from '../steam-vpk-utils/portals.js';

export const SERVER_NAME = 'com.github.kinten108101.SteamVPK.Server';
export const SERVER_PATH = '/com/github/kinten108101/SteamVPK/Server';

Gio._promisify(Gio.DBus.session, 'call', 'call_finish');

export type BackendServices = ReturnType<typeof BackendPortal>;

export function BackendPortal(
{ interface_name,
  obj_path,
}:
{ interface_name: string;
  obj_path: string;
}) {
  const notify_slots: Map<string, ((newval: GLib.Variant) => void)[]> = new Map;
  const unbind_funcs: Map<number, () => void> = new Map;

  Gio.DBus.session.signal_subscribe(
    SERVER_NAME,
    'org.freedesktop.DBus.Properties',
    'PropertiesChanged',
    obj_path,
    null,
    Gio.DBusSignalFlags.NONE,
    (_connection, _sender, _path, _iface, _signal, params: GLib.Variant) => {
      const [_interface_name, changed_properties] = params.recursiveUnpack() as [string, { [name: string]: any }];
      if (_interface_name !== interface_name) throw new Error('Unexpected inconsistent interface');
      notify_slots.get(interface_name);
      for (const prop_name in changed_properties) {
        const handlers = notify_slots.get(prop_name) || [];
        const val = changed_properties[prop_name];
        if (val === undefined) throw new Error('No changed value passed to callback');
        handlers.forEach(x => {
          x(val);
        });
      }
    });

  async function call(method: string, return_type: string | null = null, ...args: any[]) {
    try {
      // @ts-ignore
      return (<Promise<GLib.Variant>>Gio.DBus.session.call(
        SERVER_NAME,
        obj_path,
        interface_name,
        method,
        args.length > 0 ? dbus_params(...args) : null,
        return_type !== null ? GLib.VariantType.new(return_type) : null,
        Gio.DBusCallFlags.NONE,
        1000,
        null))
        .then(reply => {
          const result = reply.recursiveUnpack() as any[];
          if (result.length === 0) return undefined;
          else if (result.length === 1) return result[0];
          else return result;
        });
    } catch (error) {
      if (error instanceof GLib.Error && error.matches(Gio.io_error_quark(), Gio.IOErrorEnum.DBUS_ERROR)) {
        Gio.dbus_error_strip_remote_error(error);
      }
      throw error;
    }
  }

  function subscribe(signal: string, cb: (...args: any[]) => void) {
    if (signal.length > 8 && signal.substring(0, 8) === 'notify::') {
      const prop_name = signal.substring(8);
      let handlers = notify_slots.get(prop_name);
      if (handlers === undefined) {
        handlers = [];
        notify_slots.set(prop_name, handlers);
      }
      handlers.push(cb);
      const id = generate_timed_id();
      unbind_funcs.set(id, () => {
        if (handlers === undefined) return;
        const idx = handlers.indexOf(cb);
        if (idx === undefined) return;
        handlers.splice(idx, 1);
      });
      return id;
    }
    return Gio.DBus.session.signal_subscribe(
      SERVER_NAME,
      interface_name,
      signal,
      obj_path,
      null,
      Gio.DBusSignalFlags.NONE,
      (_connection, _sender, _path, _iface, _signal, params: GLib.Variant) => {
        const vals = params.recursiveUnpack() as any[];
        cb(...vals);
      });
  }

  function unsubscribe(id: number) {
    const func = unbind_funcs.get(id);
    if (func === undefined) {
      return Gio.DBus.session.signal_unsubscribe(id);
    }
    func();
    unbind_funcs.delete(id);
  }

  async function property_get<T = any>(name: string) {
    try {
      // @ts-ignore
      const reply: GLib.Variant = await Gio.DBus.session.call(
        SERVER_NAME,
        obj_path,
        'org.freedesktop.DBus.Properties',
        'Get',
        new GLib.Variant('(ss)', [
            interface_name,
            name,
        ]),
        null,
        Gio.DBusCallFlags.NONE,
        -1,
        null);

      const [value] = reply.recursiveUnpack() as any[];
      return value as T;
    } catch (error) {
      if (error instanceof GLib.Error && error.matches(Gio.io_error_quark(), Gio.IOErrorEnum.DBUS_ERROR)) {
        Gio.dbus_error_strip_remote_error(error);
      }
      throw error;
    }
  }

  async function property_set(name: string, value: GLib.Variant) {
    try {
      // @ts-ignore
      await Gio.DBus.session.call(
        SERVER_NAME,
        obj_path,
        'org.freedesktop.DBus.Properties',
        'Set',
        new GLib.Variant('(ssv)', [
            interface_name,
            name,
            value,
        ]),
        null,
        Gio.DBusCallFlags.NONE,
        -1,
        null);
    } catch (error) {
      if (error instanceof GLib.Error && error.matches(Gio.io_error_quark(), Gio.IOErrorEnum.DBUS_ERROR)) {
        Gio.dbus_error_strip_remote_error(error);
      }
      throw error;
    }
  }

  async function async_call(method_name: string, ...args: any[]): Promise<[number, any]> {
    const dbus = getApplication().get_dbus_connection();
    if (dbus === null) throw new Error;
    const name_raw = dbus.get_unique_name();
    if (name_raw === null) throw new Error;
    const name = get_formatted_unique_name_str(name_raw + String(Math.round(Math.random() * 1000000)));
    let using_request: number | undefined = undefined;
    let using_timeout: GLib.Source | undefined = undefined;
    return new Promise((resolve, reject) => {
      using_request = Gio.DBus.session.signal_subscribe(
        SERVER_NAME,
        `${SERVER_NAME}.Request`,
        'Response',
        `${SERVER_PATH}/request/${name}/${method_name}`,
        null,
        Gio.DBusSignalFlags.NONE,
        (_connection, _sender, _path, _iface, _signal, params: GLib.Variant) => {
          const vals = params.recursiveUnpack() as [number, any];
          resolve(vals);
        });
      call(
        method_name, null, name, ...args)
        .catch(error => reject(error));
      using_timeout = setTimeout(() => {
        reject(new Error('Server did not respond'));
      }, 10000);
    }).finally(() => {
      if (using_request) Gio.DBus.session.signal_unsubscribe(using_request);
      if (using_timeout) using_timeout.destroy();
    }) as Promise<[number, any]>;
  }

  const proxy = {
    call,
    async_call,
    subscribe,
    unsubscribe,
    property_get,
    property_set,
  };

  return proxy;
}

export default interface AddonBoxClient extends GObject.Object {
  connect(signal: 'notify::connected', callback: ($obj: this) => void): number;
  connect(signal: 'notify', callback: ($obj: this, spec: GObject.ParamSpec) => void): number;
  services: {
    injector: BackendServices;
    injections: (id: string) => BackendServices;
    addons: BackendServices;
    workshop: BackendServices;
    settings: BackendServices;
    disk: BackendServices;
  };
}
export default class AddonBoxClient extends GObject.Object {
  static {
    GObject.registerClass({
      Properties: {
        connected: GObject.ParamSpec.boolean(
          'connected', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT, false),
      }
    }, this);
  }

  connected!: boolean;
  services = {
    injector: BackendPortal({
      interface_name: 'com.github.kinten108101.SteamVPK.Server.Injector',
      obj_path: '/com/github/kinten108101/SteamVPK/Server/injector',
    }),
    injections(id: string) {
      return BackendPortal({
        interface_name: 'com.github.kinten108101.SteamVPK.Server.Injection',
        obj_path: `/com/github/kinten108101/SteamVPK/Server/injections/${get_formatted_unique_name_str(id)}`,
      });
    },
    addons: BackendPortal({
      interface_name: 'com.github.kinten108101.SteamVPK.Server.Addons',
      obj_path: '/com/github/kinten108101/SteamVPK/Server/addons',
    }),
    workshop: BackendPortal({
      interface_name: 'com.github.kinten108101.SteamVPK.Server.Workshop',
      obj_path: '/com/github/kinten108101/SteamVPK/Server/workshop',
    }),
    settings: BackendPortal({
      interface_name: 'com.github.kinten108101.SteamVPK.Server.Settings',
      obj_path: '/com/github/kinten108101/SteamVPK/Server/settings',
    }),
    disk: BackendPortal({
      interface_name: 'com.github.kinten108101.SteamVPK.Server.Disk',
      obj_path: '/com/github/kinten108101/SteamVPK/Server/disk',
    }),
  }

  constructor(params = {}) {
    super(params);
    this._setup_monitor();
  }

  _setup_monitor() {
    this.connect('notify::connected', () => {
      if (this.connected) {
        console.debug('Connected!');
      } else {
        console.debug('Disconnected!');
      }
    });
    Gio.bus_watch_name(
      Gio.BusType.SESSION,
      SERVER_NAME,
      Gio.BusNameWatcherFlags.NONE,
      () => {
        this.connected = true;
      },
      () => {
        this.connected = false;
      });
  }

  async start() {
    if (await this.bus_exists()) {
      this.connected = true;
    } else {
      this.connected = false;
    }
  }

  async bus_exists(): Promise<boolean> {
    try {
    // @ts-ignore
      const reply = await Gio.DBus.session.call(
        SERVER_NAME,
        SERVER_PATH,
        'org.freedesktop.DBus.Peer',
        'Ping',
        null,
        null,
        Gio.DBusCallFlags.NONE,
        -1,
        null);
      if (reply !== undefined) return true;
      return false;
    } catch (error) {
      return false;
    }
  }
}
