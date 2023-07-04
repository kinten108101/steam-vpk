import GLib from 'gi://GLib';
import Gtk from 'gi://Gtk';

import { Error as GError } from './glib1.js';

import { Result } from './result.js';
import { Log } from './log.js';

export type PromiseResolve<T = void> = (value: T | PromiseLike<T>) => void;
export type PromiseReject = (reason?: any) => void;
export type PromiseExecutor<T> = (resolve: PromiseResolve<T>, reject: PromiseReject) => void

export class WindowPromiser<T> {
  window: Gtk.Window;
  #resolve: PromiseResolve<T> | undefined;
  #reject: PromiseReject | undefined;
  #closeCb: number | undefined;

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
        if (error instanceof GLib.Error)
          return Result.compose.NotOK(error);
        else if (error instanceof Error) {
          const newerr = GError.new_from_jserror(error);
          return Result.compose.NotOK(newerr);
        } else {
          Log.error('Did not convert all errors to result in WindowPromiser');
          return error;
        }
      }
    ) as Promise<Result<T, GLib.Error>>;
    // Due to how signals work, we can't connect in constructor, or else 3 cbs for 3 promisers in 3 pages will be called upon the signal.
    // instead, the cb is bound and released per promise session. This is why we connect in promise() and disconnect in resolve() and reject()
    this.#closeCb = this.window.connect('close-request', () => {
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

  resolve(value: T) {
    if (this.#closeCb === undefined) {
      throw new Error('CloseCb was not initialized!');
    }
    this.window.disconnect(this.#closeCb);
    if (this.#resolve === undefined)
      throw new Error('Resolve was not initialized!');
    return this.#resolve(value);
  }

  reject(reason: GLib.Error) {
    if (this.#closeCb === undefined) {
      throw new Error('CloseCb was not initialized!');
    }
    this.window.disconnect(this.#closeCb);
    if (this.#reject === undefined)
      throw new Error('Reject was not initialized!');
    return this.#reject(reason);
  }
}
