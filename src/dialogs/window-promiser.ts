import GLib from 'gi://GLib';
import Gtk from 'gi://Gtk';

import type { SignalMethods } from '@girs/gjs';

export default interface WindowPromiser<T> extends SignalMethods {}

/**
 * A helper component for creating Promise wrappers for asynchronous presentation methods
 * in some window implementations. The goal is to help implement methods similar
 * to {@link Gtk.FileDialog.open} or {@link Gtk.FileDialog.save}.
 *
 * This component should be saved in the windowing object.
 * When the object's presentation method is invoked, the method should call
 * {@link WindowPromiser.promise} and return the resulting promise to the client. This
 * promise can then be remote-controlled via {@link WindowPromiser.resolve} and
 * {@link WindowPromiser.reject} respectively.
 *
 * @see add-addon-window.js
 *
 */
export default class WindowPromiser<T> {
  static {
    imports.signals.addSignalMethods(this.prototype);
  }

  promise(window: Gtk.Window) {
    const promise = new Promise<T>((resolve, reject) => {
      const handleCloseWindow = window.connect('close-request', () => {
        this.windowCloseReject();
      });
      const handleResolve = this.connect('resolve', (_: unknown, value: unknown) => {
        window.disconnect(handleCloseWindow);
        this.disconnect(handleResolve);
        this.disconnect(handleReject);
        resolve(value as T);
      });
      const handleReject = this.connect('reject', (_: unknown, reason: unknown) => {
        window.disconnect(handleCloseWindow);
        this.disconnect(handleResolve);
        this.disconnect(handleReject);
        reject(reason);
      });
    });
    window.present();
    return promise;
  }

  windowCloseReject() {
    const error = new GLib.Error(
      Gtk.dialog_error_quark(), Gtk.DialogError.DISMISSED, 'Dialog dismissed');
    console.debug('<<windowCloseReject>>');
    console.debug('If this is called multiple times, then there\'s a bug somewhere. Help me find it!');
    this.reject(error);
  }

  resolve(value: T) {
    return this.emit('resolve', value);
  }

  reject(reason: Error | GLib.Error) {
    return this.emit('reject', reason);
  }
}
