import GLib from 'gi://GLib';

import { Result } from "./result.js";
import { Errors } from './errors.js';


/**
 * Extend a class's feature set without overriding old ones.
 *
 * @deprecated Moved to utils.js
 */
export class Wrapper<T> {
  /**
   * Direct readwrite reference to the child instance of this wrapper.
   * You should not use this.
   */
  _child: T;

  /**
   * @param instance The child instance to be wrapped.
   */
  constructor(instance: T) {
    this._child = instance;
  }

  /**
   * @return The child instance held by this wrapper.
   */
  unwrap() {
    return this._child;
  }
}

export const Uri = {
  /**
   * Parses `uri_string` according to `flags`. If the result is not a
   * valid [absolute URI][relative-absolute-uris], it will be discarded, and an
   * error returned.
   * @param uri_string a string representing an absolute URI
   * @param flags flags describing how to parse `uri_string`
   * @returns a new `GLib.Uri`, wrapped around by Result. On bad result, a caught `GLib.Error`.
   */
  parse(uriString: string | null, flags: GLib.UriFlags): Result<GLib.Uri, GLib.Error> {
    try {
      const uri = GLib.Uri.parse(uriString, flags);
      return Result.compose.OK(uri);
    } catch (error) {
      if (error instanceof GLib.Error) {
        return Result.compose.NotOK(error);
      }
      else throw error;
    }
  }
}

const jserror = GLib.quark_from_string('jserror');
const type_error = GLib.quark_from_string('type_error');
const syntax_error = GLib.quark_from_string('syntax_error');
export const Error = {
  new_from_jserror(error: Error, code?: Errors) {
    let error_quark: number = jserror;
    if (error instanceof TypeError)
      error_quark = type_error;
    else if (error instanceof SyntaxError)
      error_quark = syntax_error;
    return new GLib.Error(error_quark, code || 0, error.message);
  },
}
