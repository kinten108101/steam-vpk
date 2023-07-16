import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

const DefaultDecoder = new TextDecoder('utf8');
const DefaultEncoder = new TextEncoder();

export function bytes2humanreadable(bytes: number): string {
  if (kbs < 0.6) return `${bytes} B`;
  const kbs = bytes / 1024;

  if (mbs < 0.6) return `${kbs} KB`;
  const mbs = kbs / 1024;

  if (gbs < 0.6) return `${mbs} MB`;
  const gbs = mbs / 1024;

  return `${gbs} GB`;
}

export function make_dir_nonstrict(dir: Gio.File) {
  try {
    dir.make_directory(null);
    console.info(`Created ${dir.get_path()} for the first time.`);
  } catch (error) {
    if (error instanceof GLib.Error) {
      if (error.matches(Gio.io_error_quark(), Gio.IOErrorEnum.EXISTS)) {
        console.info(`Directory ${dir.get_path()} already exists.`);
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

export function read_json_bytes(bytes: Uint8Array) {
  const serial = DefaultDecoder.decode(bytes);
  const jsobject = JSON.parse(serial);
  return jsobject;
}

export function replace_json(value: any, dest: Gio.File, prettified: boolean = true) {
  const serial = JSON.stringify(
    value,
    null,
    (() => {
      if (prettified) return 2;
      return undefined;
    })(),
  );
  const bytes = DefaultEncoder.encode(serial);
  dest.replace_contents(bytes, null, false, Gio.FileCreateFlags.NONE, null);
  return;
}

export function create_json(value: any, dest: Gio.File, prettified: boolean = true) {
  const serial = JSON.stringify(
    value,
    null,
    (() => {
      if (prettified) return 2;
      return undefined;
    })(),
  );
  const bytes = DefaultEncoder.encode(serial);
  if (dest.query_exists(null)) throw new GLib.Error(Gio.io_error_quark(), Gio.IOErrorEnum.EXISTS, 'JSON file already exists');
  dest.replace_contents(bytes, null, false, Gio.FileCreateFlags.NONE, null);
  return;
}

export function list_files(dir: Gio.File): Gio.File[] {
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
  return files;
}
