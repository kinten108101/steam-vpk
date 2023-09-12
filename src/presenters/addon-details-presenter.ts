import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import Adw from 'gi://Adw';

import { RepositoryItem } from '../model/repository.js';
import AddonDetails from '../ui/addon-details.js';
import AddonBoxClient from '../backend/client.js';
import { ArchiveRow } from '../ui/addon-details/archive-list.js';
import { ArchiveItem } from '../model/archive-store.js';

export default class AddonDetailsPresenter extends GObject.Object {
  static {
    GObject.registerClass({
      Properties: {
        item: GObject.ParamSpec.object(
          'item', 'Item', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          RepositoryItem.$gtype),
        leaflet: GObject.ParamSpec.object(
          'leaflet', 'Leaflet', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          Adw.Leaflet.$gtype),
        addon_details: GObject.ParamSpec.object(
          'addon_details', 'Add-on Details page', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          AddonDetails.$gtype),
        client: GObject.ParamSpec.object(
          'client', 'Client', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          AddonBoxClient.$gtype),
        archive_model: GObject.ParamSpec.object(
          'archive-model', 'Archive Model', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          Gio.ListModel.$gtype),
      },
    }, this);
  }

  _item: RepositoryItem | null = null;

  leaflet!: Adw.Leaflet;
  addon_details!: AddonDetails;
  client!: AddonBoxClient;
  archive_model!: Gio.ListModel;

  _bindings: GObject.Binding[] = [];

  constructor(params: {
    leaflet: Adw.Leaflet;
    addon_details: AddonDetails;
    client: AddonBoxClient;
    archive_model: Gio.ListModel;
  }) {
    super(params);
    this.addon_details.archive_list.bind_model(params.archive_model, (item: GObject.Object) => {
      if (!(item instanceof ArchiveItem)) throw new Error;
      return new ArchiveRow({
        name: item.id,
      });
    });
  }

  set item(val: RepositoryItem | null) {
    if (val === this.item) return;
    this._unbind_item();
    this._item = val;
    if (val !== null) {
      this._bind_item();
    }
    this.notify('item');
  }

  present() {
    this.leaflet.set_visible_child_name('addon-details-page');
  }

  _bind_item() {
    if (this._item === null) {
      console.error('bind_item:', 'item is null');
      return;
    }

    (<string[]>[
      'name',
      'id',
      'steamid',
      'subdir',
      'remote',
    ]).forEach(prop => {
      if (this._item === null) return;
      const binding = this._item.bind_property(prop, this.addon_details, prop,
        GObject.BindingFlags.SYNC_CREATE);
      this._bindings.push(binding);
    });

    const impl_creator = this._item.bind_property_full('creators', this.addon_details, 'creator',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: { id: string }[]): [boolean, string] => {
        const val = from[0]?.id;
        if (!val) return [false, ''];
        if (typeof val !== 'string') return [false, ''];
        return [true, val];
      },
      () => {});
    this._bindings.push(impl_creator);

    if (typeof this._item.steamid === 'string')
      this.client.services.workshop.call(
        'GetWorkshopUrl', '(s)', this._item.steamid)
          .then((url: string) => {
            this.addon_details.steamurl = url;
          },
          error => {
            console.error(error);
          });

    this.client.services.disk.call('GetAddonFolderSize', '(ts)', this._item.id)
      .then(([size]) => {
          this.addon_details.used = size;
        })
      .catch(logError);
  }

  _unbind_item() {
    this._bindings.forEach(x => x.unbind());
    this._bindings = [];
  }
}
