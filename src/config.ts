import GObject from 'gi://GObject';

export interface Configs {
  app_id: string,
  app_rdnn: string,
  app_fullname: string,
  app_shortname: string,
  version: string,
  prefix: string,
  lib_dir: string,
  data_dir: string,
  config_dir: string,
  build_type: string,
  usr_data_dir: string,
  pkg_data_dir: string,
  pkg_user_data_dir: string,
  usr_state_dir: string,
  pkg_usr_state_dir: string,
  webapi: string,
  oauth: string,
  addon_info?: string,
  addon_index?: string,
  addon_dir?: string,
}

export namespace GObject1 {
  interface ParamSpecString {
    name: string,
    nick?: string,
    blurb?: string,
    flags?: GObject.ParamFlags,
    value?: string,
  }

  export const ParamSpec = {
    string(param: ParamSpecString) {
      const { name, nick, blurb, flags, value } = param;
      return GObject.ParamSpec.string(
        name,
        nick || '',
        blurb || '',
        flags || GObject.ParamFlags.READWRITE,
        value || '',
      );
    }
  }
}
/**
 * @deprecated Use the const module instead.
 */
export class Config {
  static init(param: Configs): Config {
    if (this.instance) {
      throw new Error('Config module has already been initialized!');
    }
    this.instance = new Config(param);
    return this.instance;
  }

  static getInstance() {
    if (!this.instance) {
      throw new Error('Config module has not been initialized!');
    }
    return this.instance;
  }

  static get config() {
    const instance = Config.getInstance();
    return instance.configs;
  }

  private static instance: Config;
  configs: Required<Configs>;

  constructor(param: Configs) {
    this.configs = {
      addon_index: 'addons.json',
      addon_dir: 'addons',
      addon_info: 'metadata.json',
      ...param,
    };
  }

  toString() {
    let str: string = '';
    for (const key in this) {
      str += `${key} = \"${this[key]}\";\n`;
    }
    return str;
  }
}

