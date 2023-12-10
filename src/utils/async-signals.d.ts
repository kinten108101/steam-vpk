export type AsyncCallback = ((_obj: any, ...args: any[]) => Promise<boolean>);

export interface AsyncSignalMethods<Signals extends string> {
  _slots: Map<string, AsyncCallback[]>;
  _signal_map: WeakMap<AsyncCallback, string>;
  connect_signal(signal: Signals, callback: AsyncCallback): AsyncCallback;
  disconnect_signal(callback: AsyncCallback): boolean;
  _emit_signal(signal: Signals, ...args: any[]): Promise<boolean>;
}

export function addAsyncSignalMethods<T extends string>(obj: AsyncSignalMethods<T>): void;
