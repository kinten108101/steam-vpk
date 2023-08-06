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

function throw_cancelled(): never {
  throw new GLib.Error(Gio.io_error_quark(), Gio.IOErrorEnum.CANCELLED, 'Cancelled');
}

abstract class InjectionError extends Error {}

export class DuplicatedInjectionError extends InjectionError {
  constructor() {
    super('Injection already exists');
  }
}

export class InjectionNotFoundError extends InjectionError {
  constructor() {
    super('Injection is not in record');
  }
}

export interface Injection extends SignalMethods {}
export class Injection {
  static Signals = {
    logs_changed: 'logs-changed',
    start: 'start',
    end: 'end',
    finished: 'finished',
  };

  static {
    imports.signals.addSignalMethods(this.prototype);
  }

  sources: Gio.File[] | undefined;
  logs: string[];
  creation: Date;
  id: number;
  cancellable: Gio.Cancellable = new Gio.Cancellable;

  constructor(id: number) {
    this.logs = [];
    this.creation = new Date();
    this.id = id;
    this.log(`Created at ${this.creation}`);
  }

  log(msg: string) {
    this.logs.push(msg);
    this.emit(Injection.Signals.logs_changed, msg);
  }

  error(msg: string) {
    this.logs.push(`<span font-weight=\\\'bold\\\'>${msg}</span>`)
    this.emit(Injection.Signals.logs_changed, msg);
  }
}

export default interface Injector extends SignalMethods {}
export default class Injector {
  static Signals = {
    is_running_changed: 'is-running-changed',
    running_prepare: 'running-prepare',
    running_cleanup: 'running-cleanup',
    session_start: 'session-start',
    session_end: 'session-end',
    session_finished: 'session-finished',
    error: 'error',
  };

  static {
    imports.signals.addSignalMethods(this.prototype);
  }

  static last_id = 0;

  static generate_id() {
    this.last_id++;
    return this.last_id;
  }

  linkdir: Gio.File | undefined;
  #is_running = false;
  has_error = false;

  addon_storage!: AddonStorage;
  settings!: Settings;
  injections: WeakSet<Injection> = new WeakSet;

  set_running(val: boolean, injection: Injection) {
    this.#is_running = val;
    this.emit(Injector.Signals.is_running_changed, this.#is_running, injection);
  }

  get_running() {
    return this.#is_running;
  }

  bind(params: {
    addon_storage: AddonStorage;
    settings: Settings;
  }) {
    this.addon_storage = params.addon_storage;
    this.settings = params.settings;
    this.settings.connect('notify::game-dir', () => {
      this.linkdir = this.settings.game_dir.get_child('left4dead2').get_child('addons');
    });
  }

  async start() {
  }

  finish(injection: Injection) {
    if (!this.injections.has(injection)) throw new InjectionNotFoundError();
    this.has_error = false;
    injection.emit(Injection.Signals.finished);
    this.emit(Injector.Signals.session_finished);
  }

  make_injection() {
    return new Injection(Injector.generate_id());
  }

  async run(injection: Injection) {
    if (this.injections.has(injection)) throw new DuplicatedInjectionError();
    this.injections.add(injection);
    this.has_error = false;
    this.emit(Injector.Signals.running_prepare, injection);
    this.set_running(true, injection);
    injection.emit(Injection.Signals.start);
    this.emit(Injector.Signals.session_start);
    try {
      const time_start = new Date().getTime();
      await this.cleanup(injection);
      await this.load(injection);
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, 3000);
      });
      await this.link(injection);
      const time_end = new Date().getTime();
      injection.log(`Done in ${time_end - time_start}ms.`);
    } catch (error) {
      this.has_error = true;
      if (error instanceof GLib.Error) {
        if (error.matches(Gio.io_error_quark(), Gio.IOErrorEnum.CANCELLED)) {
          injection.error('Aborted.');
        } else {
          injection.error(error.message || 'Unknown error');
        }
      } else if (error instanceof Error) {
        injection.error(error.message || 'Unknown error');
      } else {
        injection.error('Unknown untyped error');
      }
    }
    injection.emit(Injection.Signals.end);
    this.emit(Injector.Signals.session_end, injection);
    this.set_running(false, injection);
    this.emit(Injector.Signals.running_cleanup, injection);
  }

  async cleanup(injection: Injection) {
    if (injection.cancellable.is_cancelled()) throw_cancelled();
    injection.log('Cleaning addons dir from last run...');
    if (!this.linkdir) throw new Error('linkdir has not been defined');
    const files = await list_file_async(this.linkdir);
    for (const x of files) {
      if (injection.cancellable.is_cancelled()) throw_cancelled();
      const name = x.get_basename();
      if (name === null) {
        console.warn('Path is invalid. Skipping...');
        continue;
      }
      if (!name.includes('@stvpk.vpk')) continue;
      await x.delete_async(GLib.PRIORITY_DEFAULT, injection.cancellable);
    }
  }

  async load(injection: Injection) {
    if (injection.cancellable.is_cancelled()) throw_cancelled();
    injection.log('Reading loadorder...');
    const sources: Gio.File[] = [];
    this.addon_storage.loadorder.forEach(x => {
      if (injection.cancellable.is_cancelled()) throw_cancelled();
      const addon = this.addon_storage.idmap.get(x);
      if (addon === undefined) {
        return;
      }
      const config = this.addon_storage.configmap.get(x);
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
    if (injection.cancellable.is_cancelled()) throw_cancelled();
    injection.log('Installing add-ons...');
    if (!this.linkdir) throw new Error('linkdir has not been defined');
    const id = injection.creation;
    if (!injection.sources) {
      console.warn(`Sources of injection \"${id}\" have not been prepared. Quitting...`);
      return;
    }
    let i = -1;
    for (const x of injection.sources) {
      if (injection.cancellable.is_cancelled()) throw_cancelled();
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
  }
}
