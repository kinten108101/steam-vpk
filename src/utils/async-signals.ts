export type AsyncCallback = ((_obj: any, ...args: any[]) => Promise<boolean>);

export interface AsyncSignalMethods<Signals extends string> {
  _slots: Map<string, AsyncCallback[]>;
  _signal_map: WeakMap<AsyncCallback, string>;
  connect_signal(signal: Signals, callback: AsyncCallback): AsyncCallback;
  disconnect_signal(callback: AsyncCallback): boolean;
  _emit_signal(signal: Signals, ...args: any[]): Promise<boolean>;
}

export function addAsyncSignalMethods<T extends string>(obj: AsyncSignalMethods<T>) {
  obj._slots = new Map;
  obj._signal_map = new WeakMap;
  obj.connect_signal = (signal: string, cb: (_obj: any, ...args: any[]) => Promise<boolean>) => {
    let handlers = obj._slots.get(signal);
    if (handlers === undefined) {
      handlers = [];
      obj._slots.set(signal, handlers);
    }
    handlers.push(cb);
    obj._signal_map.set(cb, signal);
    return cb;
  };
  obj.disconnect_signal = (cb: (_obj: any, ...args: any[]) => Promise<boolean>): boolean => {
    const signal = obj._signal_map.get(cb);
    if (signal === undefined) {
      console.warn('Disconnecting a callback that was not registered');
      return false;
    }
    let handlers = obj._slots.get(signal);
    if (handlers === undefined) {
      handlers = [];
      obj._slots.set(signal, handlers);
    }
    const idx = handlers.indexOf(cb as (_obj: any, ...args: any[]) => Promise<boolean>);
    if (idx === -1) return false;
    handlers.splice(idx, 1);
    return true;
  }
  obj._emit_signal = async (signal: string, ...args: any[]) => {
    let handlers = obj._slots.get(signal);
    if (handlers === undefined) {
      handlers = [];
      obj._slots.set(signal, handlers);
    }
    for (const x of handlers) {
      const result = await x(obj, ...args);
      if (!result) return false;
    }
    return true;
  }
}
