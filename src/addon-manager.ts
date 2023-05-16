import GObject from 'gi://GObject';

import { SettingsManager, getSettingsManager } from './settings';
import { list_files, parse_json } from './utils';
import { DataItem, DataItemManifest, LoaderItem, LoaderItemManifest } from './addon-model';
import { register_for_profile_change } from './profile-manager';
import { id_table_append, id_table_clear} from './id-table';
import { DATA, get_loading_manifest_path } from './const';
import { Errors, StvpkError } from './errors';

let _currentAddonManager: AddonManager | undefined = undefined;

function getCurrentAddonManager() {
  if (_currentAddonManager === undefined) {
    throw new Error('You have not initialized Addon Manager!');
  }
  return _currentAddonManager;
}

export function initAddonManager(): void {
  if (_currentAddonManager !== undefined) {
    throw new Error('Addon Manager cannot be reset!');
  }
  _currentAddonManager = new AddonManager;
}

class AddonManager extends GObject.Object {
  private _settings!: SettingsManager;

  private _data_item_list: DataItem[] = [];
  private _loader_item_list: LoaderItem[] = [];

  private _loadlist_id: string[] = [];

  static {
    // TODO: Replace properties with children
    // TODO: ParamFlags different
    GObject.registerClass({
      Signals: {
        'data-reloaded': {},
      },
    }, this);
  }

  constructor(param={}) {
    super(param);
    this._settings = getSettingsManager();

    register_for_profile_change(reload_data_for_current_profile);
  }

  data_item_list_replace(list: DataItem[]) {
    this._data_item_list = list;
  }

  get_data_item_list() {
    return this._data_item_list;
  }

  loader_item_list_replace(list: LoaderItem[]) {
    this._loader_item_list = list;
  }

  get_loader_item_list() {
    const ret = this._loader_item_list;
    return ret;
  }

}

function reload_data_for_current_profile(_: unknown, current_profile: string | null) {
  const addonManager = getCurrentAddonManager();
  const datastore = reload_data_items();
  addonManager.data_item_list_replace(datastore);
  if (current_profile !== null) {
    const loaderstore = reload_loader_items(current_profile);
    addonManager.loader_item_list_replace(loaderstore);
  }
  addonManager.emit('data-reloaded');
}

function reload_data_items(): DataItem[] {
  /*
  const data_index: DataIndexEntry[] = parse_json(DATA_INDEX);
  // TODO: Emergency exit?
  const buffer: DataItem[] = [];
  id_table_clear();
  data_index.forEach((x) => {
    const manifest: DataItemManifest = parse_json(get_data_entry_manifest(x.id));
    const {name, id, steam_id, description, last_update} = manifest;
    // TODO: Check if id's match
    id_table_append(steam_id, id);
    const item = new DataItem({
      name,
      id,
      steam_id,
      description,
      last_update,
    });
    buffer.push(item);
  });
  return buffer;

    */
  const dirs = list_files(DATA);

  const buffer: DataItem[] = [];
  id_table_clear();

  dirs.forEach(dir => {
    try {
      const path = `${dir.get_path()}/metadata.json`;
      const manifest: DataItemManifest = parse_json(path);
      const {name, id, steam_id, description, last_update} = manifest;
      if (id !== dir.get_basename()) {
        throw new StvpkError({
          code: Errors.INCONSISTENT_FOLDER_NAME,
          val: id,
        });
      }
      const item = new DataItem({
        name,
        id,
        steam_id,
        description,
        last_update,
      });
      buffer.push(item);
      id_table_append(steam_id, id);
    } catch (error) {
      if (error instanceof StvpkError && error.code === Errors.INCONSISTENT_FOLDER_NAME) {
        StvpkError.log(error);
        return;
      }
    }
  });
  return buffer;
}

function reload_loader_items(current_profile: string): LoaderItem[] {
  const path = get_loading_manifest_path(current_profile);
  const load_list: LoaderItemManifest[] = parse_json(path)['addonlist'];
  const buffer: LoaderItem[] = [];

  load_list.forEach(manifest => {
    try {
      const {id, enabled, in_randomizer} = manifest;
      if (id !== manifest.id) {
        throw new StvpkError({
          code: Errors.INCONSISTENT_FOLDER_NAME,
        });
      }
      const item = new LoaderItem({
        id,
        enabled,
        in_randomizer,
      });
      buffer.push(item);
    } catch (error) {
      if (error instanceof StvpkError && error.code === Errors.INCONSISTENT_FOLDER_NAME) {
        StvpkError.log(error);
        return;
      }
    }
  });

  return buffer;
}

export function register_for_data_reload(callback: (...args: any[]) => void) {
  const addonManager = getCurrentAddonManager();
  return addonManager.connect('data-reloaded', callback);
}

export function register_for_data_reload_once(callback: (...args: any[]) => void) {
  const addonManager = getCurrentAddonManager();
  const id = addonManager.connect('data-reloaded', () => {
    callback();
    addonManager.disconnect(id);
  });
}

export interface DataReloadResponse {
  loaderstore: LoaderItem[];
  datastore: DataItem[];
}

export function get_data_item_list() {
  const addonManager = getCurrentAddonManager();
  return addonManager.get_data_item_list();
}

export function get_loader_item_list() {
  const addonManager = getCurrentAddonManager();
  return addonManager.get_loader_item_list();
}

export function get_empty_load_list_template() {
  const load_list_file_content: { addonlist: LoaderItemManifest[] } = {
    addonlist: [],
  };
  return load_list_file_content;
}

export function get_full_load_list_template() {
  const load_list_file_content = get_empty_load_list_template();
  const data_item_list = get_data_item_list();
  load_list_file_content.addonlist = data_item_list.map(x => {
    return {
      id: x.id,
      enabled: true,
      in_randomizer: false,
    } as LoaderItemManifest;
  });
  return load_list_file_content;
}
