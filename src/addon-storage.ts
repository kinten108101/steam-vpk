import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

import * as Utils from './utils.js';
import { Log } from './utils/log.js';
import { Results } from './utils/result.js';
import { gobjectClass } from './utils/decorator.js';

import { IndexDirectory, WriteOrders } from './index-dir.js';
import { Model } from './mvc.js';
import { Addon, AddonManifest } from './addons.js';
import { Config } from './config.js';
import { Application } from './application.js';

const _quark = GLib.quark_from_string('stvpk-addon-storage-error');
export function addon_storage_error_quark() {
  return _quark;
}
export enum AddonStorageError {
  TIMEOUT,
  ADDON_EXISTS,
  ADDON_NOT_EXISTS,
}

@gobjectClass({
  Signals: {
    [AddonStorage.Signals.addons_changed]: {},
    'force-update': {},
  }
})
export class AddonStorage extends GObject.Object
implements Model {
  static Signals = {
    addons_changed: 'addons_changed',
  }

  index: Gio.File;
  indexer: IndexDirectory;
  subdirFolder: Gio.File;
  idmap: Readonly<Map<string, Addon>>;

  data_flushed: boolean = false;

  constructor(param: { application: Application }) {
    super({});
    const application = param.application;
    this.idmap = new Map();

    this.subdirFolder = application.pkg_user_data_dir.get_child(Config.config.addon_dir);
    Utils.makeDirectory(this.subdirFolder);

    this.index = application.pkg_user_state_dir.get_child(Config.config.addon_index);
    this.indexer = new IndexDirectory({ file: this.index });
    this.indexer.connect('subdirs-changed', this.updateIdMap);

    this.connect('force-update', this.updateIdMap);
  }

  async start() {
    this.indexer.start();
  }

  get(vanityId: string): Addon | undefined {
    return this.idmap.get(vanityId);
  }

  getAll() {
    return new Map(this.idmap);
  }

  updateIdMap = () => {
    const subdirs = this.indexer.subdirs;
    const draft = new Map<string, Addon>();
    subdirs.forEach(x => {
      const subdir = this.subdirFolder.get_child(x.id);
      const info = subdir.get_child(Config.config.addon_info);

      const readjson = Utils.readJSON(info);
      if (readjson.code !== Results.OK) {
        const error = readjson.data;
        if (error.matches(Gio.io_error_quark(), Gio.IOErrorEnum.NOT_FOUND)) {
          Log.warn(`Caught a file handler error in add-on ${x.id}. Add-on possibly does not exist. Requested a removal from index, now exit.`)
          this.indexer.writeable.order({ code: WriteOrders.DeleteEntry, param: x });
          return;
        }
        Log.error(error);
        return;
      }

      const jsobject = readjson.data;
      let manifest = (() => {
        if (typeof jsobject.stvpkid === 'string')
          return jsobject as AddonManifest;
        else return undefined;
      })();

      if (manifest === undefined) {
        Log.warn(`Add-on manifest lacks required fields! Must be manually resolved. Skipping...`);
        return;
      }

      const addon = Addon.new_from_manifest(manifest);
      draft.set(addon.vanityId, addon);
    });
    this.idmap = draft;
    this.data_flushed = true;
    this.emit(AddonStorage.Signals.addons_changed);
  }
}
