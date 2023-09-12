import Gio from 'gi://Gio';
import GObject from 'gi://GObject';

export class ArchiveItem extends GObject.Object {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkArchiveItem',
      Properties: {
        id: GObject.ParamSpec.string(
          'id', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
        owner: GObject.ParamSpec.string(
          'owner', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
      },
    }, this);
  }

  id!: string;
  owner!: string;

  constructor(params: {
    id: string;
    owner: string;
  }) {
    super(params);
  }
}

export default class ArchiveStore extends Gio.ListStore<ArchiveItem> {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkArchiveStore',
    }, this);
  }

  exists: Map<string, ArchiveItem> = new Map;

  constructor(params = {}) {
    super({
      item_type: ArchiveItem.$gtype,
      ...params,
    });
  }


  refill(items: ArchiveItem[]) {
    const deletables: Map<string, ArchiveItem> = new Map(this.exists);
      items.forEach(x => {
        deletables.delete(x.id);
        if (this.exists.has(x.id)) {

        } else {
          this.append(x);
          this.exists.set(x.id, x);
        }
      });
      deletables.forEach(x => {
        const [found, idx] = this.find(x);
        if (!found) {
          console.log('Item not found?');
          return;
        }
        this.remove(idx);
        this.exists.delete(x.id);
      });
  }
}
