import GLib from 'gi://GLib';

export const APP_ID = 'com.github.kinten108101.SteamVpk';
export const SCHEMA_ID = APP_ID;
const CONFIG = GLib.get_user_config_dir();
const PROFILE = CONFIG + '/profiles';
// TODO: Why is there Null in XDG_HOME?
export const DATA = GLib.get_home_dir() + '/.local/share/SteamVPK/addons';

export function get_data_entry_manifest(stvpk_id: string) {
  const manifest = 'metadata.json';
  return `${DATA}/${stvpk_id}/${manifest}`;
}

export function get_profile_folder_path(profile_id: string) {
  return `${PROFILE}/${profile_id}`;
}

export function get_loading_manifest_path(profile_id: string) {
  const manifest = 'addonlist.json';
  return `${PROFILE}/${profile_id}/${manifest}`;
}

export function get_profile_manifest_path(profile_id: string) {
  const manifest = 'metadata.json';
  return `${PROFILE}/${profile_id}/${manifest}`;
}

export const PROFILE_INDEX = `${PROFILE}/profiles.json`;
export const DATA_INDEX = `${DATA}/addons.json`;

export const STARTUP_PROFILE_INDEX = [];

