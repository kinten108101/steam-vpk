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
import { Archiver } from './archive.js';

interface ConfigurationFile {
  addonlist?: ConfigurationFileEntry[];
}

interface ConfigurationFileEntry extends ConfigurationFileEntrySeparatorSection {
  id?: string;
  active?: boolean;
  type?: string;
}

export interface ConfigurationFileEntrySeparatorSection {
  name?: string;
}

export enum ItemType {
  addon = 'addon',
  separator = 'separator',
}

export interface Configuration {
  type: ItemType;
  active: boolean;
}

export interface Separator {
  id: string;
  name?: string;
}

function parse_item_type_enum(val: string | undefined): ItemType {
  switch (val) {
  case ItemType.addon: return ItemType.addon;
  case ItemType.separator: return ItemType.separator;
  default: return ItemType.addon;
  }
}

function make_configuration_from_manifest(manifest: ConfigurationFileEntry) {
  const obj: Configuration = {
    active: (() => {
      if (manifest.active !== undefined) {
        return manifest.active;
      }
      return false;
    })(),
    type: parse_item_type_enum(manifest.type),
  };
  return obj;
}

function make_separator_from_manifest(manifest: ConfigurationFileEntry): Separator | undefined {
  const id = manifest['id'];
  if (id === undefined) {
    console.warn('Separator entry lacks required field \"id\". Skipping...');
    return undefined;
  }
  const name = manifest['name'];
  return { id, name };
}

function make_configuration_file_from_storage(addonStorage: AddonStorage) {
  const addonlist: ConfigurationFileEntry[] = []
  addonStorage.loadorder.forEach(x => {
    const config = addonStorage.configmap.get(x);
    if (config === undefined) {
      console.warn('Configuration for loadorder entry does not exist. Quitting...')
      return;
    }
    const type = config.type;
    const active = config.active;
    let name: string | undefined;
    if (config.type === ItemType.separator) {
      const sep = addonStorage.sepmap.get(x);
      if (sep === undefined) return;
      name = sep.name;
    }
    addonlist.push({ id: x, active, type, name });
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
  sepmap: Map<string, Separator>;

  archiver!: Archiver;

  constructor(params: { subdir_folder: Gio.File,
                        pkg_user_state_dir: Gio.File, }) {
    super({});
    this.subdirFolder = params.subdir_folder;
    this.idmap = new Map();
    this.index = params.pkg_user_state_dir.get_child(Config.config.addon_index);
    this.indexer = new IndexDirectory({ file: this.index, storage: params.subdir_folder });

    this.model = new Gio.ListStore({ item_type: Addon.$gtype });
    this.enabled = true;

    this.configState = params.pkg_user_state_dir.get_child(Config.config.profile_default_info);
    // NOTE(kinten):
    // Separated config details from the config array (loadorder).
    // So that we can do loadorder.includes (deep equality is not implemented in JS).
    // Consequence is that we must manually keep loadorder and configmap in sync.
    // TODO(kinten):
    // loadorder should be a tree-based array implementation, one that supports random insertion.
    this.loadorder = [];
    this.configmap = new Map();

    this.sepmap = new Map();
  }

  bind(
  {
    archiver,
  }:
  {
    archiver: Archiver,
  }) {
    this.archiver = archiver;
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

      const addon = this.addon_make(manifest);
      if (addon === undefined) {
        console.warn('Could not register add-on. Skipping...');
        return;
      }
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
    const obj: ConfigurationFile = File.read_json(this.configState);

    const addonlist: ConfigurationFileEntry[] | undefined = obj['addonlist'];
    if (!Array.isArray(addonlist) || addonlist === undefined) {
      console.warn('Empty add-on collection in configuration state. Must be resolved manually. Quitting...');
      return;
    }
    const draft_loadorder: string[] = [];
    const draft_configmap: Map<string, Configuration> = new Map();
    const draft_sepmap: Map<string, Separator> = new Map();
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

      const sep = make_separator_from_manifest(x);
      if (sep === undefined) {
        return;
      }
      draft_sepmap.set(id, sep);
    });
    this.loadorder = draft_loadorder;
    this.configmap = draft_configmap;
    this.sepmap = draft_sepmap;

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

  /** @note Assuming that the add-on `id` exists in AddonStorage#idmap */
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

  loadorder_separator(id: string, name: string, pos: number) {
    if (this.loadorder.includes(id)) {
      console.warn('Separator already included. Quitting...');
      return;
    }
    if (pos < 0 || pos >= this.loadorder.length) {
      console.warn('Separator placement out of bound. Quitting...');
      return;
    }
    Utils.array_insert(this.loadorder, id, pos);
    const config = make_configuration_from_manifest({
      type: ItemType.separator,
    });
    this.configmap.set(id, config);
    const sep: Separator = {
      id,
      name,
    };
    this.sepmap.set(id, sep);
    this.emit(AddonStorage.Signals.loadorder_changed);
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
  }

  async addon_save(id: string) {
    const addon = this.idmap.get(id);
    if (addon === undefined) {
      console.warn('Add-on could not be found, so could not save. Quitting...');
      return;
    }
    const manifest = Addon.toManifest(addon);
    await File.replace_json_async(manifest, addon.info);
    this.emit(Signals.addons_changed);
  }

  addon_make(manifest: AddonManifest, flags: AddonFlags = AddonFlags.NONE): Addon | undefined {
    const id = manifest.stvpkid;
    if (id === undefined) {
      console.warn('Add-on manifest has no ID. Quitting...');
      return undefined;
    }
    const subdir = this.subdirFolder.get_child(id);
    const addon = new Addon({
      vanityId: id,
      steamId: manifest.publishedfileid,
      title: manifest.title,
      description: manifest.description,
      categories: (() => {
              if (manifest.tags === undefined) return new Map();
              const arr = manifest.tags?.map(({ tag }) => {
                return tag;
              });
              const map = new Map<string, {}>();
              arr.forEach(x => {
                map.set(x, {});
              });
              return map;
            })(),
      timeUpdated: (() => {
              if (manifest.time_updated === undefined) return undefined;
              const date = new Date(manifest.time_updated.valueOf() * 1000);
              return date;
            })(),
      comment: manifest.comment,
      creators: (() => {
              if (manifest.creators === undefined) return new Map();
              const arr = manifest.creators?.map(({ creator }) => { return creator });
              const map = new Map<string, {}>();
              arr.forEach(x => {
                map.set(x, {})
              });
              return map;
            })(),
      flags,
      subdir,
    });
    this.archiver.register_archive_group_from_manifest({ addon, subdir, addon_manifest: manifest });
    addon.connect('modified', this.addon_save.bind(this, addon.id));
    // dummy
    // upgrade-missing-archive
    return addon;
  }

  make_dummy(id: string): Addon {
    const addon = this.addon_make({ stvpkid: id }, AddonFlags.DUMMY);
    if (addon === undefined) throw new Error('Couldn\'t create dummy. This should be impossible.');
    return addon;
  }
}


