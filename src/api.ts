import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import type { SignalMethods } from '@girs/gjs';

import { SERVER_NAME, SERVER_PATH } from './const.js';
import {
  WeakRefMap,
} from './steam-vpk-utils/weakrefmap.js';
import { dbus_params } from './steam-vpk-utils/dbus-utils.js';

Gio._promisify(Gio.DBusProxy, 'new_for_bus', 'new_for_bus_finish');
Gio._promisify(Gio.DBusProxy.prototype, 'call', 'call_finish');
Gio._promisify(Gio.DBus.session, 'call', 'call_finish');

export interface DBusMonitor extends SignalMethods {}
export class DBusMonitor {
  static Signals = {
    connected: 'notify-connected',
    proxy: 'proxy',
  };

  static {
    imports.signals.addSignalMethods(this.prototype);
  }

  connected: boolean = false;

  constructor() {
    Gio.bus_watch_name(
      Gio.BusType.SESSION,
      SERVER_NAME,
      Gio.BusNameWatcherFlags.NONE,
      () => {
        console.log('Reconnected!');
        this.connected = true;
        this.emit(DBusMonitor.Signals.connected, this.connected);
      },
      () => {
        console.log('Disconnected!');
        this.connected = false;
        this.emit(DBusMonitor.Signals.connected, this.connected);
      });
  }

  async start() {
    if (await this.bus_exists) {
      this.connected = true;
      return;
    }
  }

  async bus_exists(): Promise<boolean> {
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
  }
}

export class ProxyManager {
  proxies: Set<PrettyProxy> = new Set;
  interface_map: WeakRefMap<string, PrettyProxy> = new WeakRefMap;

  async register_proxy(obj_path: string, interface_name: string) {
    const proxy = new PrettyProxy;
    this.proxies.add(proxy);
    this.interface_map.set(interface_name, proxy);
    await proxy.makeProxy(SERVER_NAME, obj_path, interface_name);
  }

  get_proxy(interface_name: string) {
    let proxy = this.interface_map.get(interface_name);
    if (proxy === undefined) throw new Error();
    return proxy;
  }
}

export interface PrettyProxy extends SignalMethods {}
export class PrettyProxy {
  static last_id = 0;

  static generate_id() {
    return PrettyProxy.last_id++;
  }

  static Signals = {
    proxy_ready: 'proxy-ready',
  };

  static {
    imports.signals.addSignalMethods(this.prototype);
  }

  proxy?: Gio.DBusProxy;

  cbsmap: Map<string, Function[]> = new Map;
  idmap: Map<number, { fn: Function, signal: string }> = new Map;

  async makeProxy(name: string, object_path: string, interf: string) {
    // @ts-ignore
    this.proxy = await Gio.DBusProxy.new_for_bus(
        Gio.BusType.SESSION,
        Gio.DBusProxyFlags.NONE,
        null,
        name,
        object_path,
        interf,
        null);
    if (this.proxy === undefined) throw new Error();
    this.proxy.connect('g-signal', (_proxy, _senderName, signalName, parameters) => {
      if (signalName === null) return;
      const cbs = this.cbsmap.get(signalName);
      if (cbs === undefined) return;
      for (const cb of cbs) {
        cb(null, ...(parameters.recursiveUnpack() as any[]));
      }
    });
    this.emit(PrettyProxy.Signals.proxy_ready);
  }

  service_connect(signal: string, cb: ($obj: null, ...args: any[]) => void): number {
    let cbs: Function[] | undefined = this.cbsmap.get(signal);
    if (cbs === undefined) {
      cbs = [];
      this.cbsmap.set(signal, cbs);
    }
    if (cbs === undefined) throw new Error;
    cbs.push(cb);
    const id = PrettyProxy.generate_id();
    this.idmap.set(id, {
      fn: cb,
      signal,
    });
    return id;
  }

  service_disconnect(handler: number) {
    const col = this.idmap.get(handler);
    if (col === undefined) return;
    const { fn, signal } = col;
    const cbs = this.cbsmap.get(signal);
    if (cbs === undefined) return;

    const idx = cbs.indexOf(fn);
    if (idx === -1) return;
    // how fast is this
    cbs.splice(idx, 1);
    if (cbs.length === 0) {
      this.cbsmap.delete(signal);
    }

    this.idmap.delete(handler);
  }

  async service_call_async<ReturnType extends any = undefined>(method: string, ...params: any[]): Promise<ReturnType | undefined> {
    if (this.proxy === undefined) {
      console.warn('Proxy has not been made. Quitting...');
      return undefined;
    }
    const args = (() => {
      const gvariants: GLib.Variant[] = [];
      params.forEach((x) => {
        const gvariant = jsval2gvariant(x);
        gvariants.push(gvariant);
      });
      return GLib.Variant.new_tuple(gvariants);
    })();
    // @ts-ignore
    return this.proxy.call(method, args, Gio.DBusCallFlags.NONE, 10000, null).then(gvariant => gvariant.recursiveUnpack() as T);
  }
}

function jsval2gvariant(val: any) {
  const type = typeof val;
  if (type === 'string') {
    return GLib.Variant.new_string(val);
  } else if (type === 'number') {
    return GLib.Variant.new_int16(val);
  } else {
    throw new Error(`Could not convert JS value to GVariant. Received ${val}.`);
  }
}

export type BackendInterfaces =
  'com.github.kinten108101.SteamVPK.Server.Injector' |
  'com.github.kinten108101.SteamVPK.Server.Addons' |
  'com.github.kinten108101.SteamVPK.Server.Workshop' |
  'com.github.kinten108101.SteamVPK.Server.Disk';

function guess_object_path(interface_name: BackendInterfaces) {
  switch (interface_name) {
  case 'com.github.kinten108101.SteamVPK.Server.Injector':
    return '/com/github/kinten108101/SteamVPK/Server/injector';
  case 'com.github.kinten108101.SteamVPK.Server.Addons':
    return '/com/github/kinten108101/SteamVPK/Server/addons';
  case 'com.github.kinten108101.SteamVPK.Server.Workshop':
    return '/com/github/kinten108101/SteamVPK/Server/workshop';
  case 'com.github.kinten108101.SteamVPK.Server.Disk':
    return '/com/github/kinten108101/SteamVPK/Server/disk';
  }
}

export function BackendPortal(
{ interface_name,
}:
{ interface_name: BackendInterfaces;
}) {
  const obj_path = guess_object_path(interface_name);

  async function call_async(method: string, return_type: string | null = null, ...args: any[]) {
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
      if (error instanceof GLib.Error && error.matches(Gio.dbus_error_quark(), error.domain)) {
        Gio.dbus_error_strip_remote_error(error);
      }
      throw error;
    }
  }

  function subscribe(signal: string, cb: (...args: any[]) => void) {
    try {
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
    } catch (error) {
      if (error instanceof GLib.Error && error.matches(Gio.dbus_error_quark(), error.domain)) {
        Gio.dbus_error_strip_remote_error(error);
      }
      throw error;
    }
  }

  function unsubscribe(id: number) {
    try {
      return Gio.DBus.session.signal_unsubscribe(id);
    } catch (error) {
      if (error instanceof GLib.Error && error.matches(Gio.dbus_error_quark(), error.domain)) {
        Gio.dbus_error_strip_remote_error(error);
      }
      throw error;
    }
  }

  const proxy = {
    call_async,
    subscribe,
    unsubscribe,
  };

  return proxy;
}
