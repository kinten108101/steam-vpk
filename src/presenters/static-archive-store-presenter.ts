import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import { ArchiveItem } from '../model/archive-store.js';
import { RepositoryItem } from '../model/repository.js';

export default class StaticArchiveStorePresenter extends GObject.Object {
  static {
    GObject.registerClass({
      Properties: {
        item: GObject.ParamSpec.object(
          'item', 'Item', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          RepositoryItem.$gtype),
        archive_store: GObject.ParamSpec.object(
          'archive-store', 'Archive Store', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          Gio.ListStore.$gtype),
      },
    }, this);
  }

  _item!: RepositoryItem | null;
  archive_store!: Gio.ListStore;

  constructor(params: {
    item?: RepositoryItem;
    archive_store: Gio.ListStore;
  }) {
    super(params);
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

  get item() {
    return this._item;
  }

  _bind_item() {
    if (this._item === null) {
      console.error('bind_item:', 'item is null');
      return;
    }

    this._item.archives.forEach(x => {
      if (this._item === null) {
        console.error('bind_item:', 'item is null');
        return;
      }
      const { path } = x;
      const item = new ArchiveItem({
        id: path,
        owner: this._item.id,
      })
      this.archive_store.append(item);
    });

  }

  _unbind_item() {
    this.archive_store.remove_all();
  }
}
