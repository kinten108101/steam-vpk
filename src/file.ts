import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

Gio._promisify(Gio.File.prototype, 'replace_contents_async', 'replace_contents_finish');
Gio._promisify(Gio.File.prototype, 'load_contents_async', 'load_contents_finish');

const DefaultDecoder = new TextDecoder('utf8');
const DefaultEncoder = new TextEncoder();

export function is_dir(file: Gio.File) {
  const info = file.query_info(Gio.FILE_ATTRIBUTE_STANDARD_TYPE, Gio.FileQueryInfoFlags.NONE, null);
  const type = info.get_file_type();
  if (type !== Gio.FileType.DIRECTORY) {
    return false;
  }
  return true;
}

export async function is_dir_async(file: Gio.File) {
  const info = await file.query_info_async(Gio.FILE_ATTRIBUTE_FILESYSTEM_TYPE, Gio.FileQueryInfoFlags.NONE, GLib.PRIORITY_DEFAULT, null);
  const type = info.get_file_type();
  if (type !== Gio.FileType.DIRECTORY) {
    return false;
  }
  return true;
}

export function list_file(dir: Gio.File) {
  const files: Gio.File[] = [];
  const iter = dir.enumerate_children(Gio.FILE_ATTRIBUTE_STANDARD_NAME, Gio.FileQueryInfoFlags.NONE, null);
  let info: Gio.FileInfo | null;
  do {
    info = iter.next_file(null);
    if (info !== null) {
      const name = info.get_name();
      files.push(dir.get_child(name));
    }
  } while (info !== null);
  return files;
}

export async function list_file_async(dir: Gio.File) {
  const files: Gio.File[] = [];
  const iter = await dir.enumerate_children_async(Gio.FILE_ATTRIBUTE_STANDARD_NAME, Gio.FileQueryInfoFlags.NONE, GLib.PRIORITY_DEFAULT, null);
  let info: Gio.FileInfo | null;
  do {
    info = iter.next_file(null);
    if (info !== null) {
      const name = info.get_name();
      files.push(dir.get_child(name));
    }
  } while (info !== null);
  return files;
}

export function bytes2humanreadable(bytes: number): string {
  const precision = 3;
  const kbs = bytes / 1024;
  if (bytes < 1000) return `${bytes.toPrecision(precision)} B`;

  const mbs = kbs / 1024;
  if (kbs < 1000) return `${kbs.toPrecision(precision)} KB`;

  const gbs = mbs / 1024;
  if (mbs < 1000) return `${mbs.toPrecision(precision)} MB`;

  return `${gbs.toPrecision(precision)} GB`;
}

export function make_dir_nonstrict(dir: Gio.File) {
  try {
    dir.make_directory(null);
    console.info(`Created ${dir.get_path()} for the first time.`);
  } catch (error) {
    if (error instanceof GLib.Error) {
      if (error.matches(Gio.io_error_quark(), Gio.IOErrorEnum.EXISTS)) {
        console.debug(`Directory ${dir.get_path()} already exists.`);
      }
    } else throw error;
  }
}

export function read_json(file: Gio.File) {
  const [, bytes,] = file.load_contents(null);
  const serial = DefaultDecoder.decode(bytes);
  const jsobject = JSON.parse(serial);
  return jsobject;
}

export async function read_json_async(file: Gio.File) {
  const [bytes,] = await file.load_contents_async(null);
  const serial = DefaultDecoder.decode(bytes);
  const jsobject = JSON.parse(serial);
  return jsobject;
}

export function read_json_bytes(bytes: Uint8Array) {
  const serial = DefaultDecoder.decode(bytes);
  const jsobject = JSON.parse(serial);
  return jsobject;
}

export function replace_json(value: any, dest: Gio.File) {
  const serial = serialize(value);
  const bytes = DefaultEncoder.encode(serial);
  dest.replace_contents(bytes, null, false, Gio.FileCreateFlags.NONE, null);
  return;
}

export async function replace_json_async(value: any, dest: Gio.File) {
  const serial = serialize(value);
  const bytes = DefaultEncoder.encode(serial);
  dest.replace_contents_async(bytes, null, false, Gio.FileCreateFlags.NONE, null);
  return;
}

function serialize(value: any) {
  return JSON.stringify(value, null, 2);
}

export function create_json(value: any, dest: Gio.File) {
  const serial = serialize(value);
  const bytes = DefaultEncoder.encode(serial);
  if (dest.query_exists(null)) throw new GLib.Error(Gio.io_error_quark(), Gio.IOErrorEnum.EXISTS, 'JSON file already exists');
  dest.replace_contents(bytes, null, false, Gio.FileCreateFlags.NONE, null);
  return;
}

export async function create_json_async(value: any, dest: Gio.File) {
  const serial = serialize(value);
  const bytes = DefaultEncoder.encode(serial);
  if (dest.query_exists(null)) throw new GLib.Error(Gio.io_error_quark(), Gio.IOErrorEnum.EXISTS, 'JSON file already exists');
  dest.replace_contents_async(bytes, null, false, Gio.FileCreateFlags.NONE, null);
  return;
}
