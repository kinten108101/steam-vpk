import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import GObject from 'gi://GObject';

import * as File from './file.js';
import * as Utils from './utils.js';
import { Results } from './utils/result.js';

import IndexDirectory from './index-dir.js';
import { Model } from './mvc.js';
import { Addon, AddonFlags, AddonManifest } from './addons.js';
import { Config } from './config.js';

interface ConfigurationFile {
  addonlist: ConfigurationFileEntry[];
}

interface ConfigurationFileEntry {
  id: string;
  active?: boolean;
}

interface Configuration {
  active: boolean;
}

function make_configuration_from_manifest(manifest: any) {
  const obj: Configuration = {
    active: (() => {
              if (manifest.active !== undefined) {
                return manifest.active;
              }
              return false;
            })(),
  };
  return obj;
}

function make_configuration_file_from_storage(addonStorage: AddonStorage) {
  const addonlist: ConfigurationFileEntry[] = []
  addonStorage.loadorder.forEach(x => {
    const config = addonStorage.configmap.get(x);
    if (config === undefined) {
      console.warn('Configuration for loadorder entry does not exist. Quitting...')
      return;
    }
    const active = config.active;
    addonlist.push({ id: x, active });
  });
  const content: ConfigurationFile = { addonlist };
  return content;
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

enum Signals {
  addons_enabled_changed = 'addons_enabled_changed',
  addons_changed = 'addons_changed',
  /** @deprecated */
  loadorder_changed = 'loadorder_changed',
  loadorder_order_changed = 'loadorder_order_changed',
  loadorder_config_changed = 'loadorder-config-changed',
  force_update = 'force-update',
}

export class AddonStorage extends GObject.Object implements Model {
  static Signals = Signals;

  static [GObject.signals] = {
    [Signals.addons_enabled_changed]: {},
    [Signals.addons_changed]: {},
    [Signals.loadorder_changed]: {},
    [Signals.loadorder_order_changed]: {},
    [Signals.loadorder_config_changed]: {},
    [Signals.force_update]: {},
  }

  static {
    Utils.registerClass({}, this);
  }

  index: Gio.File;
  indexer: IndexDirectory;
  subdirFolder: Gio.File;

  idmap: Readonly<Map<string, Addon>>;
  model: Gio.ListStore<Addon>;

  // these will be moved to another model component
  configState: Gio.File;
  loadorder: string[];
  configmap: Map<string, Configuration>;
  private enabled: boolean;

  constructor(params: { subdir_folder: Gio.File,
                        pkg_user_state_dir: Gio.File, }) {
    super({});
    this.subdirFolder = params.subdir_folder;
    this.idmap = new Map();
    this.index = params.pkg_user_state_dir.get_child(Config.config.addon_index);
    this.indexer = new IndexDirectory({ file: this.index });

    this.model = new Gio.ListStore({ item_type: Addon.$gtype });
    this.enabled = true;

    this.configState = params.pkg_user_state_dir.get_child(Config.config.profile_default_info);
    this.loadorder = [];
    this.configmap = new Map();
  }

  async start() {
    console.info(`addon-dir-index: ${this.index.get_path()}`);
    this.indexer.connect('subdirs-changed', this.updateIdMap);
    this.connect('force-update', this.updateIdMap);

    try {
      File.make_dir_nonstrict(this.subdirFolder);
    } catch (error) {
      logError(error);
      console.error('Quitting...');
      return;
    }

    try {
      const content = make_configuration_file_from_storage(this);
      File.create_json(content, this.configState);
      console.info(`Created ${this.configState.get_path()} for the first time.`);
    } catch (error) {
      if (error instanceof GLib.Error) {
        if (error.matches(Gio.io_error_quark(), Gio.IOErrorEnum.EXISTS)) {}
      } else throw error;
    }

    this.connect(AddonStorage.Signals.loadorder_changed, this.loadorder_save); // experimental
    this.connect(AddonStorage.Signals.loadorder_order_changed, this.loadorder_save); // experimental
    this.connect(AddonStorage.Signals.loadorder_config_changed, this.loadorder_save); // experimental

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
        logError(error);
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

      const addon = this.register_addon(manifest);
      if (addon.vanityId !== x.id) {
        console.warn('Add-on ID and subdirectory name are different! Must be manually resolved. Skipping...');
        return;
      }

      draftMap.set(addon.vanityId, addon);
      this.model.append(addon);
    });
    this.idmap = draftMap;
    this.emit(AddonStorage.Signals.addons_changed);
  }

  loadorder_load() {
    const obj = File.read_json(this.configState);
    const addonlist: any[] = obj['addonlist'];
    if (!Array.isArray(addonlist)) {
      console.warn('Empty add-on collection in configuration state. Must be resolved manually. Quitting...');
      return;
    }
    const draft_loadorder: string[] = [];
    const draft_configmap: Map<string, Configuration> = new Map();
    addonlist.forEach(x => {
      const id = x['id'];
      if (id === undefined) {
        console.warn('Load-order entry lacks required field \"id\". Skipping...');
        return;
      }
      if (draft_loadorder.includes(id)) {
        console.warn('Duplicated load-order entry! Continue anyway...');
      }
      draft_loadorder.push(id);

      const config = make_configuration_from_manifest(x);
      if (draft_configmap.has(id)) {
        console.warn('Duplicated config-map entry! Continue anyway...');
      }
      draft_configmap.set(id, config);
    });
    this.loadorder = draft_loadorder;
    this.configmap = draft_configmap;
    this.emit(AddonStorage.Signals.loadorder_changed);
  }

  loadorder_remove(id: string) {
    const idx = this.loadorder.indexOf(id);
    if (idx === -1) {
      console.warn(`Tried to remove the add-on \"${id}\" from a loadorder it does not belong. Quitting...`);
      return;
    }
    // this is slow, ik. Should use a GModel which implements a binary tree
    const draft_loadorder = this.loadorder.filter((_, i) => i !== idx);
    const draft_configmap = new Map(this.configmap);
    draft_configmap.delete(id);
    this.loadorder = draft_loadorder;
    this.configmap = draft_configmap;
    this.emit(AddonStorage.Signals.loadorder_changed);
  }

  loadorder_push(id: string) {
    if (this.loadorder.includes(id)) {
      console.warn('Add-on that is already included. Quitting...');
      return;
    }
    this.loadorder.push(id);
    const config = make_configuration_from_manifest({});
    this.configmap.set(id, config);
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

  loadorder_swap_silent(source: number, target: number): boolean {
    const tmp = this.loadorder[source];
    if (tmp === undefined) {
      console.warn(`Swap index of tmp out-of-bound. Got ${source}. Quitting...`);
      return false;
    }
    const tgt = this.loadorder[target];
    if (tgt === undefined) {
      console.warn(`Swap index of tgt out-of-bound. Got ${tgt}. Quitting...`);
      return false;
    }
    this.loadorder[source] = tgt;
    this.loadorder[target] = tmp;
    return true;
  }

  loadorder_move_up_silent = (source: number): number => {
    const stat = this.loadorder_swap_silent(source, source - 1);
    if (stat) return source - 1;
    return NaN;
  }

  loadorder_move_down_silent = (source: number): number => {
    const stat = this.loadorder_swap_silent(source, source + 1);
    if (stat) return source + 1;
    return NaN;
  }

  loadorder_insert_silent(source: number, target: number) {
    const stepper = source > target ? this.loadorder_move_up_silent : this.loadorder_move_down_silent;
    let last_step = source;
    const count = Math.abs(source - target);
    for (let i = 0; i < count; i++) {
      try {
        last_step = stepper(last_step);
      } catch (error) {
        Utils.log_error(error, 'Skipping...');
      }
    }
  }

  loadorder_insert(source: number, target: number) {
    this.loadorder_insert_silent(source, target);
    this.emit(AddonStorage.Signals.loadorder_order_changed);
  }

  loadorder_save = () => {
    const content = make_configuration_file_from_storage(this);
    try {
      File.replace_json(content, this.configState);
    } catch (error) {
      logError(error);
      return;
    }
  }

  async addon_trash(id: string) {
    const subdir = this.subdirFolder.get_child(id);
    try {
      // @ts-ignore
      await subdir.trash_async(GLib.PRIORITY_DEFAULT, null);
    } catch (error) {
      logError(error);
      console.error('Quitting...');
      return;
    }
    this.indexer.delete_entry(id);
    this.emit(Signals.addons_changed);
  }

  register_addon(manifest: AddonManifest): Addon {
    const addon = Addon.new_from_manifest(manifest, AddonFlags.NONE);
    addon.subdir = this.subdirFolder.get_child(addon.vanityId);
    // dummy
    // upgrade-missing-archive
    return addon;
  }
}


