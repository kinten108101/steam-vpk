import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';

import { Errors, StvpkError } from './errors';
import { Profile, ProfileManifest } from './profile-model';
import { create_directory, create_file, delete_file, load_file_content_into_string, parse_json, retry, write_and_replace_file } from './utils';
import { SettingsManager, getSettingsManager } from './settings';
import { PROFILE_INDEX, get_loading_manifest_path, get_profile_folder_path, get_profile_manifest_path } from './const';
import { get_empty_load_list_template, get_full_load_list_template } from './addon-manager';
import { profileIndexEntry } from './addon-model';

const PROFILE_CHANGED = 'profile-changed';

let _currentProfileManager: ProfileManager | undefined = undefined;

function get_current_profile_manager() {
  if (_currentProfileManager === undefined) {
    throw new StvpkError({
      code: Errors.SINGLETON_UNINITIALIZED,
      msg: 'You have not initialized Profile Manager!',
    });
  }
  return _currentProfileManager;
}

export function init_profile_manager() {
  if (_currentProfileManager) {
    throw new StvpkError({
      code: Errors.SINGLETON_UNINITIALIZED,
      msg: 'Profile Manager cannot be reset!',
    });
  }
  return _currentProfileManager = new ProfileManager;
}

class ProfileManager extends GObject.Object {
  private _settings: SettingsManager;
  private _profile_store: Profile[] = [];
  private _current_profile_id: string | undefined = undefined;

  static {
    GObject.registerClass({
      Signals: {
        'profile-changed': {
          param_types: [GObject.TYPE_STRING],
        },
      }
    }, this);
  }

  constructor(param={}) {
    super(param);
    this._settings = getSettingsManager();
  }

  restore_last_session() {
    const last_profile = this._settings.get_last_profile();
    // GSettings seem to have returned it as an array for some fucking reasons
    this.update_current_profile(last_profile);
    log(`Profile from last session restored! Profile ID is ${last_profile}`);
  }

  store_as_session() {
    const last_profile = <string>this._current_profile_id;
    this._settings.set_last_profile(last_profile);
    log(`Profile saved as last session! Profile ID is ${last_profile}`);
  }

  #profile_store_replace(val: Profile[]) {
    this._profile_store = val;
  }

  #update_profile_list(): void {
    let buffer: string | undefined = undefined;
    try {
      buffer = load_file_content_into_string(Gio.File.new_for_path(PROFILE_INDEX));
    } catch (error) {
      if (error instanceof GLib.Error && error.matches(error.domain, Gio.IOErrorEnum.NOT_FOUND)) {
        write_and_replace_file(PROFILE_INDEX, '[]');
        return retry(this.#update_profile_list.bind(this));
      }
      else throw error;
    }
    const profile_index: profileIndexEntry[] = JSON.parse(buffer);
    const new_profile_store: Profile[] = [];
    profile_index.forEach(x => {
      const {id, name}: ProfileManifest = parse_json(get_profile_manifest_path(x.id));
      const item = new Profile({
        id,
        name,
      });
      new_profile_store.push(item);
    });
    this.#profile_store_replace(new_profile_store);
  }

  #get_profile_id_list(): string[] {
    if (this._profile_store.length === 0) {
      throw new StvpkError({
        code: Errors.EMPTY_PROFILE_INDEX,
      });
    }
    return this._profile_store.map(x => x.id);
  }

  #set_current_profile(val: string): void {
    /* I am so done */
    val = String(val);
    if (typeof val !== 'string') {
      throw new StvpkError({
        code: Errors.UNEXPECTED_TYPE,
        val: val,
        msg: 'Profile ID is not a string type!',
      });
    }
    const profile_id_list: string[] = this.#get_profile_id_list();
    if (!profile_id_list.includes(val)) {
      throw new StvpkError({
        code: Errors.INCLUSION_CHECK_FAILED,
        msg: 'ID is not available as an option!',
      });
    }
    this._current_profile_id = val;
  }

  #get_current_profile(): string {
    if (!this._current_profile_id) {
      throw new StvpkError({
        code: Errors.DEPENDENCY_UNINITIALIZED,
        msg: 'Current profile has not been set up',
      });
    }
    return this._current_profile_id;
  }

  #get_default(id_list: string[]) {
    return id_list[0];
  }

  save_profile_store_to_index_file() {
    const profile_index: profileIndexEntry[] = [];
    this._profile_store.forEach(val => {
      const new_entry: profileIndexEntry = {
        id: val.id,
      };
      profile_index.push(new_entry);
    });

    const content = JSON.stringify(profile_index);
    write_and_replace_file(PROFILE_INDEX, content);
  }

  append_to_profile_store(item: Profile) {
    this._profile_store.push(item);
  }

  create_new_profile(profile_name: string, profile_id: string, use_all_available_addons: boolean) {
    create_directory(get_profile_folder_path(profile_id));
    const profile_file_content: ProfileManifest = {
      name: profile_name,
      id: profile_id,
    };
    create_file(get_profile_manifest_path(profile_id), JSON.stringify(profile_file_content));
    let load_list_file_content = get_empty_load_list_template();
    if (use_all_available_addons) load_list_file_content = get_full_load_list_template();
    create_file(get_loading_manifest_path(profile_id), JSON.stringify(load_list_file_content));
    this.append_to_profile_store(new Profile({
      name: profile_name,
      id: profile_id,
    }));
    this.save_profile_store_to_index_file();
  }

  #create_default_profile() {
    this.create_new_profile('Default', 'default', true);
  }

  remove_profile_from_index(profile_id: string) {
    // What if profile_id is not string?
    const profile_index: profileIndexEntry[] = [];
    this._profile_store.forEach(item => {
      if (item.id === profile_id) return;
      const newval = {
        id: item.id,
      } as profileIndexEntry;
      profile_index.push(newval);
    });
    const content: string = JSON.stringify(profile_index);
    write_and_replace_file(PROFILE_INDEX, content);
  }

  delete_profile_data(profile_id: string) {
    const profile = get_profile_manifest_path(profile_id);
    delete_file(profile);
    const loadlist = get_loading_manifest_path(profile_id);
    delete_file(loadlist);
    const dir = get_profile_folder_path(profile_id);
    delete_file(dir);
  }

  get_current_profile() {
    let last_profile: string | undefined = undefined;
    try {
      last_profile = this.#get_current_profile();
    } catch (error) {
      last_profile = this.#get_default(this.#get_profile_id_list());
    }
    return last_profile;
  }

  retrieve_profile_list(): Profile[] {
    return this._profile_store;
  }

  update_current_profile(val: string): string {
    let current_profile: string;
    try {
      this.#update_profile_list();
      this.#set_current_profile(val);
      current_profile = this.#get_current_profile();
      this.emit(PROFILE_CHANGED, current_profile);
    } catch (error) {
      if (error instanceof StvpkError &&
        (error.code === Errors.EMPTY_PROFILE_INDEX || error.code === Errors.NO_USABLE_PROFILE)
      ) {
        StvpkError.log(error);
        this.#create_default_profile();
        return retry(this.update_current_profile.bind(this), val);
      }
      if (error instanceof GLib.Error && error.matches(error.domain, Gio.IOErrorEnum.NOT_FOUND) && error.message?.includes('default')) {
        log(error.message);
        this.#create_default_profile();
        return retry(this.update_current_profile.bind(this), val);
      }
      if (error instanceof StvpkError && error.code === Errors.INCLUSION_CHECK_FAILED) {
        StvpkError.log(error);
        const profile_id_list = this.#get_profile_id_list();
        const newval = String(this.#get_default(profile_id_list));
        return retry(this.update_current_profile.bind(this), newval);
      }
      else throw error;
    }
    return current_profile;
  }
}

export function update_current_profile(profile_id: string) {
  const profileManager: ProfileManager = get_current_profile_manager();
  profileManager.update_current_profile(profile_id);
}

export function retrieve_profile_list() {
  const profileManager: ProfileManager = get_current_profile_manager();
  return profileManager.retrieve_profile_list();
}

export function get_current_profile() {
  const profileManager: ProfileManager = get_current_profile_manager();
  return profileManager.get_current_profile();
}

export function restore_last_profile(): void {
  const profileManager: ProfileManager = get_current_profile_manager();
  profileManager.restore_last_session();
}

export function save_current_as_last_profile(): void {
  const profileManager: ProfileManager = get_current_profile_manager();
  profileManager.store_as_session();
}

export function register_for_profile_change(callback: (...args: any[]) => void) {
  const profileManager: ProfileManager = get_current_profile_manager();
  profileManager.connect(PROFILE_CHANGED, callback);
}

export function register_for_profile_change_once(callback: (...args: any[]) => void) {
  const profileManager: ProfileManager = get_current_profile_manager();
  const cb = profileManager.connect(PROFILE_CHANGED, () => {
    callback();
    profileManager.disconnect(cb);
  });
}

function emit_profile_changed(val: string | null): void {
  const profileManager: ProfileManager = get_current_profile_manager();
  let target: string | null = val;
  if (target === null) target = profileManager.get_current_profile();
  profileManager.emit(PROFILE_CHANGED, target);
}

export function get_current_profile_name(): string {
  //const profileManager: ProfileManager = get_current_profile_manager();
  const id = get_current_profile();
  const current_profile = retrieve_profile_list().find( item => item.id === id );
  if (current_profile === undefined) throw new Error('Profile label is not found despite error handling. Contact the dev!');
  return current_profile?.name as string;
}

export function force_profile_self_reload(): void {
  emit_profile_changed(null);
}

export function create_new_profile(name: string, id: string, use_all: boolean): void {
  const profileManager: ProfileManager = get_current_profile_manager();
  profileManager.create_new_profile(name, id, use_all);
}

export function remove_profile_from_index(profile_id: string): void {
  const profileManager: ProfileManager = get_current_profile_manager();
  profileManager.remove_profile_from_index(profile_id);
}

export function delete_profile_data(profile_id: string): void {
  const profileManager: ProfileManager = get_current_profile_manager();
  profileManager.delete_profile_data(profile_id);
}
