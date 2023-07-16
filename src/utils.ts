import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

import * as File from './file.js';
import * as JSON1 from './utils/json1.js';
import * as GLib1 from './utils/glib1.js';

import { Result, Results } from './utils/result.js';
import { TextDecoderWrap } from './utils/code.js';

Gio._promisify(Gio.File.prototype, 'query_info_async', 'query_info_finish');

export const Decoder = new TextDecoderWrap({ decoder: new TextDecoder('utf-8') });
export const Encoder = new TextEncoder();

type typeofValues = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function';

export function g_variant_unpack<T>(variant: GLib.Variant | null, type: typeofValues) {
  if (!(variant instanceof GLib.Variant)) throw new Error(`Expect a GVariant, got ${variant}`);
  const val = variant.unpack();
  if (typeof val !== type) throw new Error(`Expect a ${type}, got ${val}`);
  return val as T;
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
    console.warn(`Caught an input stream error.`);
    return readbytes;
  }

  const [ , bytes, ] = readbytes.data;
  const decodebytes = Decoder.decode(bytes);
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
