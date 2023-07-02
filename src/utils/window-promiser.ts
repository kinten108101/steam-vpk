import GLib from 'gi://GLib';
import Gtk from 'gi://Gtk';

import { Result } from './result.js';
import { Log } from './log.js';

export type PromiseResolve<T = void> = (value: T | PromiseLike<T>) => void;
export type PromiseReject = (reason?: any) => void;
export type PromiseExecutor<T> = (resolve: PromiseResolve<T>, reject: PromiseReject) => void

export class WindowPromiser<T> {
  window: Gtk.Window;
  #resolve: PromiseResolve<T> | undefined;
  #reject: PromiseReject | undefined;

  constructor(window: Gtk.Window) {
    this.window = window;
  }

  promise() {
    const promise = new Promise<T>((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
    }).then(
      (value) => {
        return Result.compose.OK(value);
      }, (error) => {
        if (error instanceof Error || error instanceof GLib.Error)
          return Result.compose.NotOK(error);
        else {
          Log.error('Did not convert all errors to result in WindowPromiser');
          return error;
        }
      }
    ) as Promise<Result<T, GLib.Error | Error>>;
    const closeCb = this.window.connect('close-request', () => {
      this.window.disconnect(closeCb);
      this.windowCloseReject();
    });
    this.window.present();
    return promise;
  }

  windowCloseReject() {
    const error = new GLib.Error(
      Gtk.dialog_error_quark(), Gtk.DialogError.DISMISSED, 'Dialog dismissed');
    Log.debug('<<windowCloseReject>>');
    Log.debug('If this is called multiple times, then there\'s a bug somewhere. Help me find it!');
    this.reject(error);
  }

  get resolve(): PromiseResolve<T> {
    if (this.#resolve === undefined)
      throw new Error('Resolve was not initialized!');
    return this.#resolve;
  }

  get reject(): PromiseReject {
    if (this.#reject === undefined)
      throw new Error('Reject was not initialized!');
    return this.#reject;
  }
}
