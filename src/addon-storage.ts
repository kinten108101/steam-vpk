import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
const Signals = imports.signals;
import type { SignalMethods } from '@girs/gjs';

import * as File from './file.js';
import * as Utils from './utils.js';
import { Results } from './utils/result.js';

import { IndexDirectory } from './index-dir.js';
import { Model } from './mvc.js';
import { Addon, AddonManifest } from './addons.js';
import { Config } from './config.js';
import { Application } from './application.js';

interface ConfigurationState {
  addonlist: { id: string }[];
}

const Configuration = {
  newFromStorage(addonStorage: AddonStorage) {
    const addonlist: {id: string}[] = []
    addonStorage.loadorder.forEach(x => {
      addonlist.push({ id: x });
    });
    const content: ConfigurationState = { addonlist };
    return content;
  }
}

const _quark = GLib.quark_from_string('stvpk-addon-storage-error');
export function addon_storage_error_quark() {
  return _quark;
}
export enum AddonStorageError {
  TIMEOUT,
  ADDON_EXISTS,
  ADDON_NOT_EXISTS,
}

export interface AddonStorage extends SignalMethods {}

export class AddonStorage implements Model {
  static Signals = {
    addons_enabled_changed: 'addons_enabled_changed',
    addons_changed: 'addons_changed',
    loadorder_changed: 'loadorder_changed',
    loadorder_order_changed: 'loadorder_order_changed',
  }

  static {
    Signals.addSignalMethods(AddonStorage.prototype);
  }

  index: Gio.File;
  indexer: IndexDirectory;
  subdirFolder: Gio.File;
  configState: Gio.File;

  idmap: Readonly<Map<string, Addon>>;
  model: Gio.ListStore<Addon>;
  loadorder: string[];
  private enabled: boolean;

  constructor(param: { application: Application }) {
    const application = param.application;

    this.subdirFolder = application.pkg_user_data_dir.get_child(Config.config.addon_dir);
    Utils.makeDirectory(this.subdirFolder);
    this.idmap = new Map();
    this.index = application.pkg_user_state_dir.get_child(Config.config.addon_index);
    this.indexer = new IndexDirectory({ file: this.index });
    this.indexer.connect('subdirs-changed', this.updateIdMap);
    this.connect('force-update', this.updateIdMap);

    this.model = new Gio.ListStore({ item_type: Addon.$gtype });
    this.enabled = true;

    this.configState = application.pkg_user_state_dir.get_child(Config.config.profile_default_info);
    this.loadorder = [];
    this.connect(AddonStorage.Signals.loadorder_changed, this.loadorder_save); // experimental
    this.connect(AddonStorage.Signals.loadorder_order_changed, this.loadorder_save); // experimental
    try {
      const content = Configuration.newFromStorage(this);
      File.create_json(content, this.configState);
      console.info(`Created ${this.configState.get_path()} for the first time.`);
    } catch (error) {
      if (error instanceof GLib.Error) {
        if (error.matches(Gio.io_error_quark(), Gio.IOErrorEnum.EXISTS)) {}
      } else {
        console.error(error);
      }
    }
  }

  async start() {
    this.indexer.start();
    this.loadorder_load();
  }

  set_addons_enabled(val: boolean) {
    this.enabled = val;
    this.emit(AddonStorage.Signals.addons_enabled_changed);
  }

  get_addons_enabled() {
    return this.enabled;
  }

  get(vanityId: string): Addon | undefined {
    return this.idmap.get(vanityId);
  }

  getAll() {
    return this.idmap;
  }

  updateIdMap = () => {
    const subdirs = this.indexer.subdirs;
    const draftMap = new Map<string, Addon>();
    this.model.remove_all();
    subdirs.forEach(x => {
      const subdir = this.subdirFolder.get_child(x.id);
      const info = subdir.get_child(Config.config.addon_info);

      const readjson = Utils.readJSONResult(info);
      if (readjson.code !== Results.OK) {
        const error = readjson.data;
        if (error.matches(Gio.io_error_quark(), Gio.IOErrorEnum.NOT_FOUND)) {
          console.warn(`Caught a file handler error in add-on ${x.id}. Add-on possibly does not exist. Must be manually resolved. Skipping...`)
          return;
        }
        console.error(error);
        return;
      }

      const jsobject = readjson.data;
      let manifest = (() => {
        if (typeof jsobject.stvpkid === 'string')
          return jsobject as AddonManifest;
        else return undefined;
      })();

      if (manifest === undefined) {
        console.warn(`Add-on manifest lacks required fields! Must be manually resolved. Skipping...`);
        return;
      }

      const addon = Addon.new_from_manifest(manifest);
      draftMap.set(addon.vanityId, addon);
      this.model.append(addon);
    });
    this.idmap = draftMap;
    this.emit(AddonStorage.Signals.addons_changed);
  }

  loadorder_load() {
    const obj = File.read_json(this.configState);
    const addonlist = obj['addonlist'];
    if (!Array.isArray(addonlist)) {
      console.warn('Empty add-on collection in configuration state. Must be resolved manually. Quitting...');
      return;
    }
    const draft_loadorder: string[] = [];
    addonlist.forEach(x => {
      const id = x['id'];
      if (id === undefined) {
        return;
      }
      const addon = this.idmap.get(id);
      if (addon === undefined) {
        return;
      }
      draft_loadorder.push(id);
    });
    this.loadorder = draft_loadorder;
    this.emit(AddonStorage.Signals.loadorder_changed);
  }

  loadorder_remove(id: string) {
    const idx = this.loadorder.indexOf(id);
    if (idx === -1) {
      console.warn('Tried to remove an add-on from a loadorder it does not belong. Quitting...');
      return;
    }
    const draft = this.loadorder.filter((_, i) => i !== idx);
    this.loadorder = draft;
    this.emit(AddonStorage.Signals.loadorder_changed);
  }

  loadorder_push(id: string) {
    if (this.loadorder.includes(id)) {
      console.warn('Add-on that is already included. Quitting...');
      return;
    }
    this.loadorder.push(id);
    this.emit(AddonStorage.Signals.loadorder_changed);
  }

  loadorder_swap(source: number, target: number) {
    const tmp = this.loadorder[source];
    if (tmp === undefined) {
      console.warn(`Swap index of tmp out-of-bound. Got ${source}. Quitting...`);
      return;
    }
    const tgt = this.loadorder[target];
    if (tgt === undefined) {
      console.warn(`Swap index of tgt out-of-bound. Got ${tgt}. Quitting...`);
      return;
    }
    this.loadorder[source] = tgt;
    this.loadorder[target] = tmp;
    this.emit(AddonStorage.Signals.loadorder_order_changed);
  }

  loadorder_save = () => {
    const content = Configuration.newFromStorage(this);
    try {
      File.replace_json(content, this.configState);
    } catch (error) {
      console.error(error);
      return;
    }
  }
}


