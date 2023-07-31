import Gtk from 'gi://Gtk';
import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import Soup from 'gi://Soup';

import * as File from './file.js';
import * as JSON1 from './utils/json1.js';
import * as GLib1 from './utils/glib1.js';

import { Result, Results } from './utils/result.js';
import { TextDecoderWrap } from './utils/code.js';

export const g_param_default = GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT;

Gio._promisify(Gio.File.prototype, 'query_info_async', 'query_info_finish');
Gio._promisify(Gio.FileOutputStream.prototype, 'query_info_async', 'query_info_finish');
Gio._promisify(Gio.File.prototype, 'trash_async', 'trash_finish');

Gio._promisify(Soup.Session.prototype,
  'send_async',
  'send_finish');

Gio._promisify(Gio.File.prototype,
  'replace_async',
  'replace_finish');

Gio._promisify(Gio.InputStream.prototype,
  'read_all_async',
  'read_all_finish');

Gio._promisify(Gio.OutputStream.prototype,
  'write_async',
  'write_finish');

Gio._promisify(Gio.OutputStream.prototype,
  'write_bytes_async',
  'write_bytes_finish');

Gio._promisify(Soup.Session.prototype,
  'send_and_splice_async',
  'send_and_splice_finish');

Gio._promisify(Gio.OutputStream.prototype,
  'flush_async',
  'flush_finish');

Gio._promisify(Gio.InputStream.prototype,
  'close_async',
  'close_finish');

Gio._promisify(Gio.OutputStream.prototype,
  'close_async',
  'close_finish');

Gio._promisify(Gio.InputStream.prototype,
  'read_bytes_async',
  'read_bytes_finish');

Gio._promisify(Gio.InputStream.prototype,
  'read_all_async',
  'read_all_finish');

Gio._promisify(Gio.OutputStream.prototype,
  'splice_async',
  'splice_finish');

Gio._promisify(Gio.File.prototype,
  'move_async',
  'move_finish');

export const Decoder = new TextDecoderWrap({ decoder: new TextDecoder('utf-8') });
export const Encoder = new TextEncoder();

/**
 * @deprecated This is very slow.
 */
export function array_insert<T>(source: Array<T>, item: T, index: number) {
  for (let i = source.length; i > index; i--) {
    source[i] = source[i-1] as T;
  }
  source[index] = item;
}

export function promise_wrap(cb: (...args: any[]) => Promise<void>, ...args: any[]) {
  return cb(args).catch(error => { log_error(error) });
}

export function log_error(error: unknown, msg?: string) {
  if (error instanceof Error) {
    console.error(error, msg);
    return;
  } else if (error instanceof GLib.Error) {
    logError(error);
    if (msg) console.error(msg);
    return;
  }
  console.error(error, msg);
}

export function g_listbox_move(listbox: Gtk.ListBox, row: Gtk.ListBoxRow, target_idx: number) {
  listbox.remove(row);
  listbox.insert(row, target_idx);
}

export function g_model_foreach<T extends GObject.Object>(model: Gio.ListModel, execute: (item: T, i: number) => void) {
  let i = 0;
  let item_iter = model.get_item(i);
  while (item_iter !== null) {
    execute(item_iter as T, i);
    i++;
    item_iter = model.get_item(i);
  }
}

export function g_variant_unpack_tuple<T extends Array<any>>(variant: GLib.Variant | null, types: typeofValues[]) {
  if (!(variant instanceof GLib.Variant)) throw new Error(`Expect a GVariant, got ${variant}`);
  const val = variant.deepUnpack();
  if (!Array.isArray(val)) {
    throw new TypeError(`Expect an array for GVariant tuple content, got ${typeof val}`);
  }
  val.forEach((x, i) => {
    if (typeof x !== types[i]) throw new Error(`Expect type ${types[i]} for the ${i}th tuple element, got ${typeof x}`);
  })
  return val as T;
}

export function g_variant_unpack_dict<T extends Object>(variant: GLib.Variant | null, structure: { [key: string]: typeofValues }) {
  if (!(variant instanceof GLib.Variant)) throw new TypeError(`Expect a GVariant, got ${variant}`);
  const val = variant.deepUnpack();
  if (typeof val !== 'object') {
    throw new TypeError();
  }
  if (val === null) {
    throw new TypeError();
  }
  const dict = val as { [key: string]: any };
  Object.keys(structure).forEach(key => {
    const val = dict[key];
    if (val === undefined) {
      throw new TypeError(`Key \"${key}\" does not exist in GVariant Dictionary`);
    }
    if (typeof val !== structure[key]) {
      throw new TypeError(`Expect type ${structure[key]} for value of key \"${key}\", got ${typeof val}`);
    }
  });
  return val as T;
}

type typeofValues = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function';

export function g_variant_unpack<T>(variant: GLib.Variant | null, type: typeofValues) {
  if (!(variant instanceof GLib.Variant)) throw new Error(`Expect a GVariant, got ${variant}`);
  const val = variant.unpack();
  if (typeof val !== type) throw new Error(`Expect a ${type}, got ${val}`);
  return val as T;
}

/**
 * Extend a class's feature set without overriding old ones.
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

/**
 * @param info GObject Class manifest. Mostly borrowed from {@link GObject.registerClass}, with some important changes:
 *
 * - Class registrations are verbalized as debug logs;
 * - Default GTypeName is Stvpk[class name] instead of Gjs_[class name].
 */
export function registerClass
<Props extends { [key: string]: GObject.ParamSpec },
 Interfaces extends { $gtype: GObject.GType }[],
 Sigs extends {
        [key: string]: {
            param_types?: readonly GObject.GType[];
            [key: string]: any;
        };
    }>
(info: GObject.MetaInfo<Props, Interfaces, Sigs> = {}, constructor: Function) {
  const GTypeName = `Stvpk${constructor.name}`;
  const klass = GObject.registerClass({
    GTypeName,
    ...info,
  }, constructor);
  console.debug(`Registered ${GTypeName}`);
  return klass;
}

/**
 * @deprecated Use {@link File.make_dir_nonstrict} instead.
 */
export function makeDirectory(dir: Gio.File) {
  try {
    dir.make_directory(null);
    console.debug(`Created ${dir.get_basename()} for the first time.`);
  } catch (error) {
    if (error instanceof GLib.Error && error.matches(Gio.io_error_quark(), Gio.IOErrorEnum.EXISTS)) {}
    else {
      console.error('Detected an uncaught error:');
      console.error(error);
    }
  }
}

/**
 * @deprecated Use {@link File.read_json} instead.
 */
export function readJSONResult(file: Gio.File) {
  const readbytes = loadContentsResult(file, null);
  if (readbytes.code !== Results.OK) {
    return readbytes;
  }

  const [ , bytes, ] = readbytes.data;
  const decodebytes = Decoder.decode(bytes);
  if (decodebytes.code !== Results.OK) {
    return decodebytes;
  }

  const parsejsobject = JSON1.parse(decodebytes.data);
  if (parsejsobject.code !== Results.OK) {
    return parsejsobject;
  }
  return parsejsobject;
}

/**
 * @deprecated Use {@link File.read_json_bytes} instead.
 */
export function readJSONBytesResult(contents: ArrayBuffer) {
  const decodebytes = Decoder.decode(contents);
  if (decodebytes.code !== Results.OK) {
    console.warn(`Caught an encoding error.`);
    return decodebytes;
  }

  const parsejsobject = JSON1.parse(decodebytes.data);
  if (parsejsobject.code !== Results.OK) {
    console.warn(`Caught a JSON syntax error.`);
    return parsejsobject;
  }
  return parsejsobject;
}

/**
 * @deprecated Use {@link File.replace_json} instead.
 */
export function replaceJSONResult(value: any, dest: Gio.File,
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
    console.warn('Couldn\'t stringify JSObject, caught a TypeError');
    return serialize;
  }

  const buffer = Encoder.encode(serialize.data);
  const writebytes = replaceContentsResult(dest, buffer, etag || null, makeBackup || false, flags || Gio.FileCreateFlags.NONE, cancellable || null);
  if (writebytes.code !== Results.OK) {
    const error = writebytes.data;
    console.warn(`Couldn\'t write index file. Must be resolved manually. Detail: ${error.message}`);
    return writebytes;
  }
  return writebytes;
}

/**
 * @deprecated Result pattern is discouraged. Use {@link Gio.File.replace_contents} instead.
 */
export function replaceContentsResult(file: Gio.File, contents: Uint8Array, etag: string | null, make_backup: boolean, flags: Gio.FileCreateFlags, cancellable: Gio.Cancellable | null): Result<[ boolean, string | null ], GLib.Error> {
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
 * @deprecated Use {@link File.list_files} instead.
 */
export function listFilesResult(dir: Gio.File): Result<Gio.File[], GLib.Error> {
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
      console.error(`Unable to Result-ize operation: unknown object throw. Details: ${error}`);
      throw error;
    }
  }
}

/**
 * @deprecated Use {@link Gio.File.load_contents} instead.
 */
export function loadContentsResult(file: Gio.File, cancellable: Gio.Cancellable | null): Result<[boolean, Uint8Array, string | null], GLib.Error> {
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
