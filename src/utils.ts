import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

export const getTemplateData = (path: string) => {
  const [, template] = Gio.File.new_for_path(path).load_contents(null);
  return template;
};

export async function list_files_async(dir: Gio.File) {
  const enumerator: Gio.FileEnumerator = await new Promise((resolve, reject) => {
    dir.enumerate_children_async(
      'standard::name,standard::type',
      Gio.FileQueryInfoFlags.NONE,
      GLib.PRIORITY_DEFAULT,
      null,
      (_file_, result) => {
        try {
          resolve(dir.enumerate_children_finish(result));
        } catch (e) {
          reject(e);
        }
      });
  });
  const files: Gio.File[] = [];
  let info: Gio.FileInfo | null;
  while ((info = enumerator.next_file(null)) !== null) {
    const file = enumerator.get_child(info);
    files.push(file);
  }
  return files;
}

export function list_files(path: string): Gio.File[] {
  const dir = Gio.File.new_for_path(path);
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

export async function load_file_content_into_string_async(file: Gio.File): Promise<string> {
  const [, content]: [boolean, Uint8Array, string | null] = await new Promise((resolve, reject) => {
    file.load_contents_async(null, (_file_, result) => {
      try {
        resolve(file.load_contents_finish(result));
      } catch (e) {
        reject(e);
      }
    });
  });
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(content);
}

export function load_file_content_into_string(file: Gio.File): string {
  const [, content] = file.load_contents(null);
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(content);
}

export function is_a_in_b(a: string, b: string[]) {
  let mismatch = 0;
  let isFound = true;
  b.forEach((item): void => {
    if (item !== a)
      mismatch++;
    if (mismatch === b.length)
      isFound = false;
  });
  return isFound;
}

export function parse_json(path: string) {
  const file = Gio.File.new_for_path(path);
  const buffer = load_file_content_into_string(file);
  return JSON.parse(buffer);
}

export async function write_and_replace_file_async(path: string, content: string) {
  const file = Gio.File.new_for_path(path);
  const ofs: Gio.FileOutputStream | null = await new Promise((resolve, reject) => {
    file.replace_async(null, false, Gio.FileCreateFlags.REPLACE_DESTINATION, GLib.PRIORITY_DEFAULT, null, (_file_, result) => {
      try {
        resolve(file.replace_finish(result));
      } catch (e) {
        reject(e);
      }
    });
  });
  if (ofs === null)
    return;
  const bytes_written: number = await new Promise((resolve, reject) => {
    ofs.write_bytes_async(
      new GLib.Bytes(Uint8Array.from(Array.from(content).map(letter => letter.charCodeAt(0)))),
      GLib.PRIORITY_DEFAULT,
      null,
      (_ofs_, result) => {
        try {
          resolve(ofs.write_bytes_finish(result));
        } catch (e) {
          reject(e);
        }
      });
  });
  ofs.close(null);
  return bytes_written;
}

export function write_and_replace_file(path: string, content: string) {
  const file = Gio.File.new_for_path(path);
  const ofs: Gio.FileOutputStream = file.replace(null, false, Gio.FileCreateFlags.REPLACE_DESTINATION, null);
  if (ofs === null)
    return;
  const bytes_written = ofs.write_bytes(
    new GLib.Bytes(
      Uint8Array.from(
        Array.from(content).map(
          letter => letter.charCodeAt(0),
        ),
      ),
    ), null);
  ofs.close(null);
  return bytes_written;
}

export function create_file(path: string, content: string) {
  const file = Gio.File.new_for_path(path);
  let ofs: Gio.FileOutputStream | null = null;
  try {
    ofs = file.create(Gio.FileCreateFlags.NONE, null);
  } catch (error) {
    if (error instanceof GLib.Error && error.matches(error.domain, Gio.IOErrorEnum.EXISTS)) {
      log('Handled file exists in file creation');
      return 0;
    }
  }
  if (ofs === null)
    return;
  const bytes_written = ofs.write_bytes(
    new GLib.Bytes(
      Uint8Array.from(
        Array.from(content).map(
          letter => letter.charCodeAt(0),
        ),
      ),
    ), null);
  ofs.close(null);
  return bytes_written;
}

export async function create_directory_async(path: string) {
  const dir = Gio.File.new_for_path(path);
  await new Promise((resolve, reject) => {
    dir.make_directory_async(
      GLib.PRIORITY_DEFAULT,
      null,
      (_dir, result) => {
        try {
          resolve(dir.make_directory_finish(result));
        } catch (e) {
          reject(e);
        }
      });
  });
  return dir;
}

export function create_directory(path: string) {
  const dir = Gio.File.new_for_path(path);
  try {
    dir.make_directory(null);
  } catch (error) {
    if (error instanceof GLib.Error && error.matches(error.domain, Gio.IOErrorEnum.EXISTS))
      log('HANDLED ERROR: Directory exists');
  }
  return dir;
}

export function retry(fn: (...args: any[]) => any, ...argss: any[]) {
  return fn(argss);
}

export function delete_file(path: string): void {
  const file = Gio.File.new_for_path(path);
  try {
    file.delete(null);
  } catch (error) {
    log('Caught error in delete_file');
    if (error instanceof GLib.Error && error.matches(error.domain, Gio.IOErrorEnum.NOT_FOUND))
      log('Handled trivial error file not found');
  }
}
