import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import type { SignalMethods } from '@girs/gjs';

import { SERVER_NAME, SERVER_PATH } from './const.js';

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

  async register_proxy(interface_name: string) {
    const proxy = new PrettyProxy;
    this.proxies.add(proxy);
    this.interface_map.set(interface_name, proxy);
    await proxy.makeProxy(SERVER_NAME, SERVER_PATH, interface_name);
  }

  get_proxy(interface_name: string) {
    let proxy = this.interface_map.get(interface_name);
    if (proxy === undefined) throw new Error();
    return proxy;
  }
}

export class WeakRefMap<T, V extends object> extends Map {
  forEach(callbackfn: (value: V | undefined, key: T, map: Map<T, WeakRef<V>>) => void, thisArg?: any): void {
    super.forEach((value: WeakRef<V>, key: T, map: Map<T, WeakRef<V>>) => {
      return callbackfn(value.deref(), key, map);
    }, thisArg);
  }

  get(key: T): V | undefined {
    const ref = super.get(key);
    return ref?.deref();
  }

  set(key: T, value: V): this {
    return super.set(key, new WeakRef(value));
  }

  entries(): IterableIterator<[T, WeakRef<V>]> {
    throw new Error('Method not implemented.');
  }

  keys(): IterableIterator<T> {
    throw new Error('Method not implemented.');
  }

  values(): IterableIterator<WeakRef<V>> {
    throw new Error('Method not implemented.');
  }

  [Symbol.iterator](): IterableIterator<[T, WeakRef<V>]> {
      throw new Error('Method not implemented.');
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
