import Gio from 'gi://Gio';

import * as Files from './file.js';

export default class DiskCapacity {
  used: number | undefined;
  subdir_sizes: WeakMap<Gio.File, number> = new WeakMap;
  allocated: number | undefined;

  allocate(val: number) {
    this.allocated = val;
  }

  eval_addon_dir(dir: Gio.File) {
    const subdirs = Files.list_file(dir);
    this.used = subdirs.map(subdir => {
      return this.eval_size(subdir);
    }).reduce((acc, size) => acc + size, 0);
  }

  eval_size(subdir: Gio.File): number {
    const cache = this.subdir_sizes.get(subdir);
    if (cache !== undefined) {
      console.debug(`Cached size used for ${subdir.get_path()}`);
      return cache;
    }
    const files = Files.list_file(subdir);
    const size = files.map(file => {
      const info = file.query_info(Gio.FILE_ATTRIBUTE_STANDARD_SIZE, Gio.FileQueryInfoFlags.NONE, null);
      return info.get_size();
    }).reduce((acc, size) => {
      return acc + size;
    }, 0);
    this.subdir_sizes.set(subdir, size);
    return size;
  }
}
