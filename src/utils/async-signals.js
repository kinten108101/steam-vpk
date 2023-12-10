/**
 * @template {string} T
 * @param {import("./async-signals").AsyncSignalMethods<T>} obj
 */
export function addAsyncSignalMethods(obj) {
  obj._slots = new Map;

  obj._signal_map = new WeakMap;

  obj.connect_signal = (signal, cb) => {
    let handlers = obj._slots.get(signal);
    if (handlers === undefined) {
      handlers = [];
      obj._slots.set(signal, handlers);
    }
    handlers.push(cb);
    obj._signal_map.set(cb, signal);
    return cb;
  };

  /**
   * @returns {boolean}
   */
  obj.disconnect_signal = (cb) => {
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
    const idx = handlers.indexOf(cb);
    if (idx === -1) return false;
    handlers.splice(idx, 1);
    return true;
  }

  obj._emit_signal = async (signal, ...args) => {
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
