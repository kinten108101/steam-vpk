import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';

export class ArchiveRow extends Gtk.ListBoxRow {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkArchiveRow',
      Properties: {
        name: GObject.ParamSpec.string(
          'name', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
      },
      Template: 'resource:///com/github/kinten108101/SteamVPK/ui/addon-details/archive-row.ui',
      InternalChildren: [
        'title_label',
      ],
    }, this);
  }

  _title_label!: Gtk.Label;

  constructor(params: {
    name: string;
  }) {
    super(params);
    this.bind_property_full('name', this._title_label, 'label',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: string | null) => {
        if (from === null) return [true, ''];
        return [true, from];
      },
      () => {});
  }
}

export default class ArchiveList extends Gtk.ListBox {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkArchiveList',
    }, this);
  }
}
