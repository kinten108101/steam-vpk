import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import { FieldRow } from './field-row.js';
import { bytes2humanreadable } from '../utils/files.js';
import { PreferencesRow } from './sensitizable-widgets.js';

export default interface AddonsPanelDisk extends Gtk.Box {
  connect(signal: 'notify::active', callback: (obj: this) => void): number;
  notify(property: 'active'): void;
  connect(signal: 'notify::used', callback: (obj: this) => void): number;
  notify(property: 'used'): void;
  connect(signal: 'notify::free', callback: (obj: this) => void): number;
  notify(property: 'free'): void;
  connect(sigName: string, callback: (...args: any[]) => void): number;
  emit(sigName: string, ...args: any[]): void;
}

export default class AddonsPanelDisk extends Gtk.Box {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkAddonsPanelDisk',
      Properties: {
        used: GObject.ParamSpec.uint64(
          'used', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          0, Number.MAX_SAFE_INTEGER,
          0),
        free: GObject.ParamSpec.uint64(
          'free', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          0, Number.MAX_SAFE_INTEGER,
          0),
      },
      Template: `resource:///com/github/kinten108101/SteamVPK/ui/addons-panel-disk.ui`,
      InternalChildren: [
        'used_row',
        'free_row',
      ],
    }, this);
  }

  used!: number;
  free!: number;

  _panel!: PreferencesRow;
  _used_row!: FieldRow;
  _free_row!: FieldRow;

  constructor(params = {}) {
    super(params);
    this.bind_property_full('used', this._used_row, 'value',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: number): [boolean, string] => {
        return [true, bytes2humanreadable(from)];
      },
      () => {});
    this.bind_property_full('free', this._free_row, 'value',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: number): [boolean, string] => {
        return [true, bytes2humanreadable(from)];
      },
      () => {});
  }
}
