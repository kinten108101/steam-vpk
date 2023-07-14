import { AddonStorage } from "./addon-storage.js";
import { Addon } from "./addons.js";

export interface CustomProfileManifest {
  id: string,
  name?: string,
  enabled?: boolean,
  addondetails?: {
    active?: boolean,
    shuffle?: boolean,
  }[],
}

export interface DefaultProfileManifest {
  enabled: boolean,
  addondetails: {
    active: boolean,
    shuffle: boolean,
  }[],
}

export const Profiles = {
  Default: 'default',
}

export class Profile {
  id: string;
  name: string;
  enabled?: boolean;
  activelist?: Map<string, Addon>;
  shufflelist?: Map<string, Addon>;
  whitelist?: Map<string, Addon>;
  loadorder?: string[];

  constructor(param: {
    id: string;
    name: string;
    enabled?: boolean;
    activelist?: Map<string, Addon>;
    shufflelist?: Map<string, Addon>;
    whitelist?: Map<string, Addon>;
    loadorder?: string[];
  }, addonStorage: AddonStorage) {
    const getAllAddons = () => {
      return addonStorage.idmap;
    };
    this.id = param.id;
    this.name = param.name               || 'untitled';
    this.enabled = param.enabled         || true;
    this.activelist = param.activelist   || new Map(getAllAddons());
    this.shufflelist = param.shufflelist || new Map();
    this.whitelist = param.whitelist     || new Map(getAllAddons());
    this.loadorder = param.loadorder     || (() => {
                                              const arr: string[] = [];
                                              getAllAddons().forEach(x => arr.push(x.vanityId));
                                              return arr;
                                            })();
  }

  static makeDefault(addonStorage: AddonStorage) {
    return new Profile({
      id: Profiles.Default,
      name: 'Default',
    }, addonStorage);
  }

  adapt_loadorder(idmap: Map<string, Addon>) {
    const draft: Addon[] = [];
    this.loadorder?.forEach(x => {
      const addon = idmap.get(x);
      if (addon === undefined) return;
      draft.push(addon);
    })
    return draft;
  }
}
