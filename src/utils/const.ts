export const APP_ID = 'com.github.kinten108101.SteamVPK';
export const APP_RDNN = '/com/github/kinten108101/SteamVPK';
export const APP_FULLNAME = 'Steam VPK';
export const APP_SHORTNAME = 'steam-vpk';
export const SERVER_NAME = 'com.github.kinten108101.SteamVPK.Server';
export const SERVER_PATH = '/com/github/kinten108101/SteamVPK/Server'
export let VERSION = '';
export let PREFIX = '/usr';
export let LIB_DIR = 'lib';
export let DATA_DIR = 'share';

export type BuildTypes = 'debug' | 'release';
export let BUILD_TYPE: BuildTypes = 'release';

export default {
  init(vals: Partial<{
    version: string,
    prefix: string,
    lib_dir: string,
    data_dir: string,
    build_type: string,
  }>) {
    if (vals.version)       VERSION       = vals.version;
    if (vals.prefix)        PREFIX        = vals.prefix;
    if (vals.lib_dir)       LIB_DIR       = vals.lib_dir;
    if (vals.data_dir)      DATA_DIR      = vals.data_dir;
    if (vals.build_type)    BUILD_TYPE    = vals.build_type as BuildTypes;
  },
};
