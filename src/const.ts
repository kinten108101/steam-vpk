import GLib from 'gi://GLib';

export let APP_ID = '';
export let APP_RDNN = '';
export let APP_FULLNAME = '';
export let APP_SHORTNAME = '';
export let VERSION = '';
export let PREFIX = '/usr';
export let LIB_DIR = 'lib';
export let DATA_DIR = 'share';

export enum BuildTypes { debug = 'debug',
                         release = 'release' }
export let BUILD_TYPE: BuildTypes = BuildTypes.release;

export const CONFIG_DIR = GLib.get_user_config_dir() || GLib.build_filenamev([GLib.get_home_dir(), '.config']);
export const USER_DATA_DIR = GLib.get_user_data_dir() || GLib.build_filenamev([GLib.get_home_dir(), '.local', 'share']);
export const USER_STATE_DIR = GLib.get_user_state_dir() || GLib.build_filenamev([GLib.get_home_dir(), '.local', 'state']);
export const ADDON_INFO = 'metadata.json';
export const ADDON_INDEX = 'addons.json';
export const ADDON_DIR = 'addons';
export const PROFILE_DEFAULT_INFO = 'config.metadata.json';
export const ADDON_ARCHIVE = 'main.vpk';
export const DOWNLOAD_DIR = 'downloads';

export default {
  init(vals: Partial<{
    app_id: string,
    app_rdnn: string,
    app_fullname: string,
    app_shortname: string,
    version: string,
    prefix: string,
    lib_dir: string,
    data_dir: string,
    build_type: string,
  }>) {
    if (vals.app_id)        APP_ID        = vals.app_id;
    if (vals.app_rdnn)      APP_RDNN      = vals.app_rdnn;
    if (vals.app_fullname)  APP_FULLNAME  = vals.app_fullname;
    if (vals.app_shortname) APP_SHORTNAME = vals.app_shortname;
    if (vals.version)       VERSION       = vals.version;
    if (vals.prefix)        PREFIX        = vals.prefix;
    if (vals.lib_dir)       LIB_DIR       = vals.lib_dir;
    if (vals.data_dir)      DATA_DIR      = vals.data_dir;
    if (vals.build_type)
      if (Object.keys(BuildTypes).map(x => x).includes(vals.build_type))
        BUILD_TYPE    = vals.build_type as BuildTypes;
  },
};
