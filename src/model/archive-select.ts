import GObject from 'gi://GObject';
import { RepositoryItem } from '../model/repository.js';

export default interface ArchiveSelectModel {
  connect(signal: 'bind', callback: (obj: this, item: RepositoryItem) => void): number;
  emit(signal: 'bind', item: RepositoryItem): void;
  connect(signal: 'unbind', callback: (obj: this, item: RepositoryItem) => void): number;
  emit(signal: 'unbind', item: RepositoryItem): void;
  connect(signal: 'notify::item', callback: (obj: this, pspec: GObject.ParamSpec) => void): number;
  notify(prop: 'item'): void;
  // inherit
  connect(signal: 'notify', callback: (obj: this, pspec: GObject.ParamSpec) => void): number;
  emit(signal: 'notify'): void;
}

export default class ArchiveSelectModel extends GObject.Object {
  static {
    GObject.registerClass({
      Properties: {
        item: GObject.ParamSpec.object(
          'item', 'Item', '',
          GObject.ParamFlags.READWRITE,
          RepositoryItem.$gtype),
      },
      Signals: {
        'bind': {
          param_types: [RepositoryItem.$gtype],
        },
        'unbind': {
          param_types: [RepositoryItem.$gtype],
        },
      },
    }, this);
  }

  _item!: RepositoryItem | null;

  set item(val: RepositoryItem | null) {
    if (val === this.item) return;
    if (val !== null)
      this.emit('unbind', val);
    this._item = val;
    if (val !== null)
      this.emit('bind', val);
    this.notify('item');
  }

  get item() {
    return this._item;
  }

  constructor(params = {}) {
    super(params);
  }
}
