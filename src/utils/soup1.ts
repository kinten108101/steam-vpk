import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Soup from 'gi://Soup';

import { Result } from './result.js';
Gio._promisify(Soup.Session.prototype,
  'send_async',
  'send_finish');
Gio._promisify(Soup.Session.prototype,
  'send_and_read_async',
  'send_and_read_finish');

export class SessionWrap {
  session: Soup.Session;

  constructor(param: { session: Soup.Session }) {
    this.session = param.session;
  }

  /**
   * Modified version of {@link send_and_read_async}, promisified and uses the Result pattern.
   *
   * Asynchronously sends `msg` and reads the response body.
   *
   * When `callback` is called, then either `msg` has been sent, and its response
   * body read, or else an error has occurred. This function should only be used
   * when the resource to be retrieved is not too long and can be stored in
   * memory. Call [method`Session`.send_and_read_finish] to get a
   * [struct`GLib`.Bytes] with the response body.
   *
   * See [method`Session`.send] for more details on the general semantics.
   * @param msg a `SoupMessage`
   * @param io_priority the I/O priority of the request
   * @param cancellable a `GCancellable`
   * @returns A promise for a `GBytes` on good result, or a `GError` on bad result.
   */
  async send_and_read_async(msg: Soup.Message, io_priority: number, cancellable: Gio.Cancellable | null): Promise<Result<GLib.Bytes, GLib.Error>> {
    return this.session.send_and_read_async(msg, io_priority, cancellable)
      .then((value) => {
        return Result.compose.OK(value);
      }, (error) => {
        if (error instanceof GLib.Error) {
          return Result.compose.NotOK(error);
        }
        else throw error;
      });
  }
}
