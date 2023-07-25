import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';

import * as GLib1 from './utils/glib1.js';
import * as Utils from './utils.js';
import { gobjectClass } from "./utils/decorator.js";
import { Result, Results } from './utils/result.js';
import { Errors, FlatError } from './utils/errors.js';
import { PromiseReject, PromiseResolve } from './utils/window-promiser.js';

import type IndexDirectory from './index-dir.js';
import { AddonStorage, AddonStorageError, addon_storage_error_quark } from './addon-storage.js';
import { AddonManifest } from './addons.js';
import { Config } from './config.js';
import { Model } from './mvc.js';


@gobjectClass({
  Signals: { 'queue-changed': [] },
})
export class ActionSynthesizer extends GObject.Object
implements Model {
  queue: ActionOrder[];
  readable: {
    storage: AddonStorage;
    index: IndexDirectory;
  }
  isRunning: boolean;

  constructor(param: { storage: AddonStorage, index: IndexDirectory }) {
    super({});
    this.queue = [];
    this.readable  = {
      storage: param.storage,
      index: param.index,
    };
    this.isRunning = false;
  }

  async start() {
    this.connect('queue-changed', this.updateQueue);
  }

  updateQueue = () => {
    if (this.isRunning) {
      console.warn('Action Synthesizer is busy...')
      return;
    }
    this.isRunning = true;
    const queue = this.queue; // TODO(kinten):
    this.queue = [];          // Is this atomic?
    let order = queue.pop();
    while (order !== undefined) {
      switch (order.code) {
      case Actions.Create:
        {
          const addon = order.param;

          if (this.readable.index.subdirs.has(addon.stvpkid)) {
            console.warn('Add-on already exists. Quitting...');
            const error = new GLib.Error(
              addon_storage_error_quark(),
              AddonStorageError.ADDON_EXISTS,
              'Add-on already exists.');
            order.quit(error);
            break;
          }
          console.debug('Add-on is unique!');

          const subdir = this.readable.storage.subdirFolder.get_child(addon.stvpkid);
          try {
            subdir.make_directory(null);
          } catch (error) {
            if (error instanceof GLib.Error) {
              if (error.matches(Gio.io_error_quark(), Gio.IOErrorEnum.EXISTS)) {}
              else order.quit(error);
            }
            else throw error;
          }

          const info_location = subdir.get_child(Config.config.addon_info);
          const writejson = Utils.replaceJSONResult(addon, info_location);
          if (writejson.code !== Results.OK) {
            const error = writejson.data;
            order.quit(error);
            break;
          }

          this.readable.index.add_entry(addon.stvpkid);
          order.finish(undefined);
          break;
        }
      default:
        throw new FlatError({ code: Errors.BAD_SWITCH_CASE });
      }
      order = queue.pop();
    }
    this.isRunning = false;
  }

  order(order: ActionOrder): void;
  order(orders: ActionOrder[]): void;
  order(arg: ActionOrder | ActionOrder[]) {
    if (Array.isArray(arg)) {
      arg.forEach(x => this.queue.push(x));
    } else {
      this.queue.push(arg);
    }
    this.emit('queue-changed');
  }
}

export const ActionOrder = {
  compose: {
    Create(val: AddonManifest) {
      return new CreateAction(val);
    },
    Delete(val: string) {
      return new DeleteAction(val);
    },
  },
}

export enum Actions {
  Create,
  Delete,
  //Modify,
}

const ActionOrderFrame = GObject.registerClass({
  Signals: {
    'finished-event': {},
  },
}, class ActionOrderFrame<A extends Actions, T, K = undefined> extends GObject.Object {
  readonly code: A;
  readonly param: T;
  finished: boolean;
  result!: Result<K, GLib.Error>;

  resolve!: PromiseResolve<Result<K, GLib.Error>>;
  reject!: PromiseReject;

  constructor(param: { code: A, param: T }) {
    super({});
    this.code = param.code;
    this.param = param.param;
    this.finished = false;
  }

  finish(val: K) {
    this.finished = true;
    this.result = Result.compose.OK(val);
    this.resolve(this.result);
  }

  quit(reason: GLib.Error) {
    console.debug('Quitting...');
    this.finished = true;
    this.result = Result.compose.NotOK(reason);
    this.resolve(this.result);
  }

  async process(synthesizer: ActionSynthesizer): Promise<Result<K, GLib.Error>> {
    const a = new Promise((resolve, reject) => {
      // TODO(kinten): Previously I was trying to overcome this pattern of storing resolve and reject. I created a 'finished' signal that will be called by finish and quit, and the param of that signal will be the resolve value. But I struggled to get the signal - registered in base class - to work with the subclasses. It should work, but it did not.
      this.resolve = resolve;
      this.reject = reject;
      synthesizer.order(this as ActionOrder);
      setTimeout(() => {
        const error = new GLib.Error(addon_storage_error_quark(), AddonStorageError.TIMEOUT, 'Timeout reached')
        reject(error);
      }, 10000);
    }).then(
    value => {
      if (typeof value === 'object' && value !== null && 'code' in value && 'data' in value) {
        return value as Result<K, GLib.Error>;
      }
      else throw new Error(`Expecting a result object, received ${value}`);
    },
    error => {
      if (error instanceof GLib.Error) {
        return Result.compose.NotOK(error);
      } else if (error instanceof FlatError) {
        const gerror = GLib1.Error.new_from_jserror(error, error.code);
        return Result.compose.NotOK(gerror);
      } else if (error instanceof Error) {
        const gerror = GLib1.Error.new_from_jserror(error);
        return Result.compose.NotOK(gerror);
      }
      else {
        console.error('Error not captured by promise!');
        console.error(error);
        throw error;
      }
    });
    return a;
  }
});

@gobjectClass()
export class CreateAction extends ActionOrderFrame<Actions.Create, AddonManifest> {
  constructor(param: AddonManifest) {
    super({ code: Actions.Create, param: param });
  }
}

@gobjectClass()
export class DeleteAction extends ActionOrderFrame<Actions.Delete, string> {
  constructor(param: string) {
    super({ code: Actions.Delete, param: param });
  }
}

export type ActionOrder = DeleteAction | CreateAction;
