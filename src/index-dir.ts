import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
const Signals = imports.signals;
import type { SignalMethods } from '@girs/gjs';
import * as File from './file.js';
import * as Utils from './utils.js';

import { Model } from './mvc.js';

export class Subdir {
  id: string;
  file: Gio.File;

  constructor(id: string, file: Gio.File) {
    this.id = id;
    this.file = file;
  }
}

export class SubdirManifest {
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}

export class IndexFile {
  readonly subdirs: SubdirManifest[];
  readonly comment?: string;

  constructor(param: { subdirs: SubdirManifest[], comment?: string }) {
    this.subdirs = param.subdirs;
    this.comment = param.comment;
  }
}

export default interface IndexDirectory extends SignalMethods {}

export default class IndexDirectory
implements Model {
  static {
    Signals.addSignalMethods(IndexDirectory.prototype);
  }

  index: Gio.File;

  subdirs: Readonly<Map<string, Subdir>>;
  comment?: string;
  monitor: Gio.FileMonitor;
  save_ready: boolean;
  storage: Gio.File;

  constructor(param: { file: Gio.File, storage: Gio.File }) {
    this.index = param.file;
    this.subdirs = new Map;
    this.monitor = this.index.monitor_file(Gio.FileMonitorFlags.WATCH_MOVES, null);
    this.save_ready = false;
    this.storage = param.storage;
  }

  async start() {
    this.connect('save-ready', () => {
      if (this.save_ready !== true) return;
      this.on_save().catch(error => {
        console.log('Could not save index file.', error, 'Quitting...');
        return;
      });
    });
    this.load_file().catch(error => {
      console.error('Could not load index file. Quitting...');
      logError(error);
      return;
    })
  }

  load_file = async () => {
    let obj: any;
    try {
      obj = await File.read_json_async(this.index);
    } catch (error) {
      if (error instanceof GLib.Error) {
        if (error.matches(error.domain, Gio.IOErrorEnum.NOT_FOUND)) {
          console.warn('Index file not found! Requested a reset.');
          this.create_file().catch(error => {
            console.error('Could not create index file. Quitting...');
            logError(error);
          });
          return;
        }
      } else if (error instanceof TypeError) {
        console.warn('Index file could not be decoded! Must be resolved manually.');
        return;
      } else if (error instanceof SyntaxError) {
        console.warn('Index file has JSON syntax error! Must be resolved manually.');
        return;
      }
    }

    // validation
    const subdirs = obj['subdirs'];
    if (subdirs === undefined) {
      console.warn('Index file lacks required fields! Must be resolved manually.')
      return;
    }
    if (!Array.isArray(subdirs)) {
      console.warn('Should be an array!')
      return;
    }

    const map = new Map<string, Subdir>();
    subdirs.forEach(x => {
      if ('id' in x && x.id !== undefined) {
        map.set(x.id, x);
      }
    })

    this.subdirs = map;

    const comment = obj['comment'];
    this.comment = comment;
    this.emit('subdirs-changed');
    return;
  }

  async save_file () {
    const content: IndexFile = new IndexFile({
      subdirs: (() => {
        const arr: SubdirManifest[] = [];
        this.subdirs.forEach(x => {
          arr.push(new SubdirManifest(x.id));
        });
        return arr;
      })(),
      comment:  this.comment,
    });

    try {
      await File.replace_json_async(content, this.index);
    } catch (error) {
      Utils.log_error(error, 'Quitting...');
      return;
    }
  }

  async create_file() {
    const content: IndexFile = new IndexFile({
      subdirs: [],
      comment:  this.comment,
    });

    try {
      await File.create_json_async(content, this.index);
    } catch (error) {
      logError(error)
      console.error('Quitting...');
      return;
    }
  }

  delete_entry(id: string) {
    const deletion = this.subdirs.delete(id);
    if (!deletion) {
      console.warn(`Tried to delete a non-existent subdir with id ${id}. Quitting...`);
      return;
    }

    this.mark_state_modified();
  }

  add_entry(id: string) {
    if (this.subdirs.has(id)) {
      console.warn(`Add-on ${id} already exists. Quitting...`);
      return;
    }
    this.subdirs.set(id, new Subdir(id, this.storage.get_child(id) ));

    this.mark_state_modified();
  }

  add_entry_full(val: Subdir): never {
    throw new Error(`Method not implemented. Received ${val}`);
  }

  mark_file_modified() {

  }

  mark_state_modified() {
    this.set_save_ready(true);
    this.emit('subdirs-changed');
  }

  set_save_ready(val: boolean) {
    if (this.save_ready === val) return;
    this.save_ready = val;
    this.emit('save-ready');
  }

  async on_save() {
    try {
      await this.save_file();
    } catch (error) {
      logError(error);
      console.error('Quitting...');
      return;
    }

    this.set_save_ready(false);
  }
}
