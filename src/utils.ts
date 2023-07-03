import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

import * as JSON1 from './utils/json1.js';
import * as GLib1 from './utils/glib1.js';

import { Result, Results } from './utils/result.js';
import { TextDecoderWrap } from './utils/code.js';
import { Log } from './utils/log.js';

Gio._promisify(Gio.File.prototype, 'query_info_async', 'query_info_finish');

export const Decoder = new TextDecoderWrap({ decoder: new TextDecoder('utf-8') });
export const Encoder = new TextEncoder();

/*

if (error instanceof GLib.Error) {
  // ...
}
else {
  Log.error('Detected an uncaught error in an attempt to Result-ize function:');
  Log.error(error);
}

*/

export function makeDirectory(dir: Gio.File) {
  try {
    dir.make_directory(null);
    Log.debug(`Created ${dir.get_basename()} for the first time.`);
  } catch (error) {
    if (error instanceof GLib.Error && error.matches(Gio.io_error_quark(), Gio.IOErrorEnum.EXISTS)) {}
    else {
      Log.error('Detected an uncaught error:');
      Log.error(error);
    }
  }
}

export function readJSON(file: Gio.File) {
  const readbytes = loadContentsR(file, null);
  if (readbytes.code !== Results.OK) {
    Log.warn(`Caught an input stream error.`);
    return readbytes;
  }

  const [ , bytes, ] = readbytes.data;
  const decodebytes = Decoder.decode(bytes);
  if (decodebytes.code !== Results.OK) {
    Log.warn(`Caught an encoding error.`);
    return decodebytes;
  }

  const parsejsobject = JSON1.parse(decodebytes.data);
  if (parsejsobject.code !== Results.OK) {
    Log.warn(`Caught a JSON syntax error.`);
    return parsejsobject;
  }
  return parsejsobject;
}

export function readJSONbytes(contents: ArrayBuffer) {
  const decodebytes = Decoder.decode(contents);
  if (decodebytes.code !== Results.OK) {
    Log.warn(`Caught an encoding error.`);
    return decodebytes;
  }

  const parsejsobject = JSON1.parse(decodebytes.data);
  if (parsejsobject.code !== Results.OK) {
    Log.warn(`Caught a JSON syntax error.`);
    return parsejsobject;
  }
  return parsejsobject;
}

export function replaceJSON(value: any, dest: Gio.File,
  prettified: boolean = true, etag?: string | null, makeBackup?: boolean,
  flags?: Gio.FileCreateFlags, cancellable?: Gio.Cancellable | null) {
  const serialize = JSON1.stringify(
    value,
    null,
    (() => {
      if (prettified) return 2;
      else return undefined;
    })(),
  );
  if (serialize.code !== Results.OK) {
    Log.warn('Couldn\'t stringify JSObject, caught a TypeError');
    return serialize;
  }

  const buffer = Encoder.encode(serialize.data);
  const writebytes = replaceContentsR(dest, buffer, etag || null, makeBackup || false, flags || Gio.FileCreateFlags.REPLACE_DESTINATION, cancellable || null);
  if (writebytes.code !== Results.OK) {
    const error = writebytes.data;
    Log.warn(`Couldn\'t write index file. Must be resolved manually. Detail: ${error.message}`);
    return writebytes;
  }
  return writebytes;
}

/**
 * Replaces the contents of `file` with `contents` of `length` bytes.
 *
 * If `etag` is specified (not %NULL), any existing file must have that etag,
 * or the error %G_IO_ERROR_WRONG_ETAG will be returned.
 *
 * If `make_backup` is %TRUE, this function will attempt to make a backup
 * of `file`. Internally, it uses g_file_replace(), so will try to replace the
 * file contents in the safest way possible. For example, atomic renames are
 * used when replacing local files’ contents.
 *
 * If `cancellable` is not %NULL, then the operation can be cancelled by
 * triggering the cancellable object from another thread. If the operation
 * was cancelled, the error %G_IO_ERROR_CANCELLED will be returned.
 *
 * The returned `new_etag` can be used to verify that the file hasn't
 * changed the next time it is saved over.
 * @param contents a string containing the new contents for `file`
 * @param etag the old [entity-tag][gfile-etag] for the document,   or %NULL
 * @param make_backup %TRUE if a backup should be created
 * @param flags a set of #GFileCreateFlags
 * @param cancellable optional #GCancellable object, %NULL to ignore
 * @returns %TRUE if successful. If an error has occurred, this function   will return %FALSE and set @error appropriately if present.
 */
export function replaceContentsR(file: Gio.File, contents: Uint8Array, etag: string | null, make_backup: boolean, flags: Gio.FileCreateFlags, cancellable: Gio.Cancellable | null): Result<[ boolean, string | null ], GLib.Error> {
  try {
    const result = file.replace_contents(contents, etag, make_backup, flags, cancellable);
    return Result.compose.OK(result);
  } catch (error) {
    if (error instanceof GLib.Error) {
      return Result.compose.NotOK(error);
    } else throw error;
  }
}

/**
 * @param {Gio.File} dir The directory inside which the scan takes place
 * @returns { Gio.File[] } A list of files in directory
 */
export function listFiles(dir: Gio.File): Result<Gio.File[], GLib.Error> {
  try {
    const enumerator = dir.enumerate_children(
      'standard::name,standard::type',
      Gio.FileQueryInfoFlags.NONE,
      null,
    );
    const files: Gio.File[] = [];
    let info: Gio.FileInfo | null;

    while ((info = enumerator.next_file(null)) !== null) {
      const file = enumerator.get_child(info);
      files.push(file);
    }
    return Result.compose.OK(files);
  } catch (error) {
    if (error instanceof GLib.Error) {
      return Result.compose.NotOK(error);
    } else if (error instanceof Error) {
      const newerr = GLib1.Error.new_from_jserror(error);
      return Result.compose.NotOK(newerr);
    } else {
      Log.error(`Unable to Result-ize operation: unknown object throw. Details: ${error}`);
      throw error;
    }
  }
}

export function loadContentsR(file: Gio.File, cancellable: Gio.Cancellable | null): Result<[boolean, Uint8Array, string | null], GLib.Error> {
  try {
    const res = file.load_contents(cancellable);
    return Result.compose.OK(res);
  } catch (error) {
    if (error instanceof GLib.Error) {
      return Result.compose.NotOK(error);
    } else {
      throw error;
    }
  }
}

/*
function parseJsonFile(file: Gio.File): Result<unknown>;
function parseJsonFile(path: string): Result<unknown>;
function parseJsonFile(arg: unknown): Result<unknown> {
  const file: Gio.File = handleFileInOverloading(arg);
  const buffer: string = loadContents(file);
  try {
    const obj: unknown = JSON.parse(buffer);
    return Result.compose.OK(obj);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return Result.compose.NotOK(undefined);
    } else {
      throw error;
    }
  }
}
*/

export function isNumberString(str: string): boolean {
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) < 48 || str.charCodeAt(i) > 57) return false;
  }
  return true;
}
