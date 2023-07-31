import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import { AddonStorage } from './addon-storage.js';
import { g_model_foreach, log_error } from './utils.js';
import Archive from './archive.js';
import { list_file_async } from './file.js';
import type { SignalMethods } from '@girs/gjs';
import Settings from './settings.js';

Gio._promisify(Gio.File.prototype, 'make_symbolic_link_async', 'make_symbolic_link_finish');
Gio._promisify(Gio.File.prototype, 'delete_async', 'delete_finish');

export class Injection {
  sources: Gio.File[] | undefined;
  logs: string[];
  creation: Date;

  constructor() {
    this.logs = [];
    this.creation = new Date();
    this.log(`Created at ${this.creation}`);
  }

  log(msg: string) {
    this.logs.push(msg);
  }
}

export default interface Injector extends SignalMethods {}
export default class Injector {
  static Signals = {
    is_running_changed: 'is-running-changed',
    error: 'error',
  };

  static {
    imports.signals.addSignalMethods(this);
  }

  linkdir: Gio.File | undefined;
  #is_running = false;

  addonStorage!: AddonStorage;
  settings!: Settings;

  set_running(val: boolean) {
    this.#is_running = val;
    this.emit(Injector.Signals.is_running_changed, this.#is_running);
  }

  bind(params: {
    addonStorage: AddonStorage;
    settings: Settings;
  }) {
    this.addonStorage = params.addonStorage;
    this.settings = params.settings;
    this.settings.connect('notify::game-dir', () => {
      this.linkdir = this.settings.game_dir.get_child('left4dead2').get_child('addons');
    });
  }

  async start() {
  }

  async run(injection: Injection) {
    this.set_running(true);
    try {
      await this.cleanup();
      await this.load(injection);
      await this.link(injection);
    } catch (error) {
      log_error(error);
      if (error instanceof GLib.Error) {
        this.error(error.message || 'Unknown error');
      }
      this.set_running(false);
    }
  }

  async error(msg: string) {
    this.emit(Injector.Signals.error, msg);
  }

  async cleanup() {
    if (!this.linkdir) throw new Error('linkdir has not been defined');
    const files = await list_file_async(this.linkdir);
    for (const x of files) {
      const name = x.get_basename();
      if (name === null) {
        console.warn('Path is invalid. Skipping...');
        continue;
      }
      if (!name.includes('@stvpk.vpk')) continue;
      await x.delete_async(GLib.PRIORITY_DEFAULT, null);
    }
  }

  async load(injection: Injection) {
    const sources: Gio.File[] = [];
    this.addonStorage.loadorder.forEach(x => {
      const addon = this.addonStorage.idmap.get(x);
      if (addon === undefined) {
        return;
      }
      const config = this.addonStorage.configmap.get(x);
      if (config === undefined) {
        return;
      }
      if (!config.active) {
        return;
      }
      const archive_group = addon.archive_group;
      if (!archive_group) {
        return;
      }
      g_model_foreach(archive_group.archives, (item: Archive) => {
        sources.push(item.file);
      });
    });
    injection.sources = sources;
  }

  async link(injection: Injection) {
    console.debug('>>link<<');
    if (!this.linkdir) throw new Error('linkdir has not been defined');
    const id = injection.creation;
    if (!injection.sources) {
      console.warn(`Sources of injection \"${id}\" have not been prepared. Quitting...`);
      return;
    }
    let i = -1;
    for (const x of injection.sources) {
      const dest = Gio.File.new_for_path(GLib.build_filenamev([this.linkdir.get_path() || '', `${i}@stvpk.vpk`]));
      const symlink_value = x.get_path();
      if (symlink_value === null) {
        console.warn(`A source path is invalid. Skipping...`);
        continue;
      }
      try {
        await dest.make_symbolic_link_async(symlink_value, GLib.PRIORITY_DEFAULT, null);
      } catch (error) {
        log_error(error, 'Skipping...');
        continue;
      }
      i++;
    }
    console.debug('<<link>>');
  }
}
