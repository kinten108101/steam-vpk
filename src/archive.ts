import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';

import * as Utils from './utils.js';
import { AddonManifest } from './addons.js';
import Downloader from './downloader.js';

export interface ArchiveManifest {
  path?: string;
  type?: string;
  url?: string;
}

enum ArchiveType {
  local,
  steam,
}

function parse_archive_type(val: string): ArchiveType | null {
  let ret: string | null = null;
  Object.keys(ArchiveType).forEach(key => {
    if (val === key) {
      ret = key;
      return;
    }
  });
  return ret;
}

function is_remote(val: ArchiveType): boolean {
  if (val === ArchiveType.steam) return true;
  return false;
}

export default class Archive extends GObject.Object {
  static {
    Utils.registerClass({}, this);
  }

  type: ArchiveType;
  file?: Gio.File;
  url?: GLib.Uri;

  constructor(params: { type: ArchiveType; file?: Gio.File; url?: GLib.Uri }) {
    super({});
    this.type = params.type;
    this.file = params.file;
    this.url = params.url;
  }
}

class ArchiveGroup extends GObject.Object {
  static {
    Utils.registerClass({}, this);
  }

  id: string;
  archives: Gio.ListStore<Archive>;

  constructor(id: string) {
    super({});
    this.id = id;
    this.archives = new Gio.ListStore({ item_type: Archive.$gtype });
  }
}

export class Archiver {
  groups: Gio.ListStore<ArchiveGroup>;
  idmap: Map<string, ArchiveGroup>;
  downloader: Downloader;

  constructor(params: {downloader: Downloader}) {
    this.groups = new Gio.ListStore({ item_type: ArchiveGroup.$gtype });
    this.idmap = new Map;
    this.downloader = params.downloader;
  }

  register_archive(params: {
    id: string;
    subdir: Gio.File;
    addon_manifest: AddonManifest,
  }) {
    if (this.idmap.has(params.id)) {
      console.warn('Archive group already exists. Quitting...');
      return;
    }
    const group = new ArchiveGroup(params.id);
    params.addon_manifest.archives?.forEach(x => {
      if (x.type === undefined) {
        console.warn();
        return;
      }
      const type = parse_archive_type(x.type);
      if (type === null) {
        console.warn();
        return;
      }
      const file = (() => {
        if (!is_remote(type))
          return Gio.File.new_for_path(GLib.build_filenamev([params.subdir.get_path() || '', ]));
        return undefined;
      })();
      const url = (() => {
        let val;
        try {
          val = GLib.Uri.parse(x.url || null, GLib.UriFlags.NONE);
        } catch (error) {
          console.log(error);
          val = undefined;
        }
        return val;
      })();
      const archive = new Archive({
        type,
        file,
        url,
      });
      group.archives.append(archive);
    });
    this.groups.append(group);
    this.idmap.set(params.id, group);
  }
  /*
  async install_archive_steamitem(addon: Addon) {
    const order = this.downloader.register_order({
      uri: ,
      size: ,
      name: ,
    });
    this.move(order, addonSubdir);
    addonStorage.rewriteManifest();
    this.register_archive();
  }
  */
}

