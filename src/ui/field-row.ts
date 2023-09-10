import GObject from 'gi://GObject';
import Adw from 'gi://Adw';
import UseSensitivitySemaphore from '../utils/sensitivity-semaphore.js';

export class ActionRow extends UseSensitivitySemaphore(Adw.ActionRow) {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkActionRow',
    }, this);
  }
}

export class FieldRow extends ActionRow {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkFieldRow',
      Properties: {
        value: GObject.ParamSpec.string(
          'value', 'Value', 'Field value, markup is allowed',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
      },
      Template: 'resource:///com/github/kinten108101/SteamVPK/ui/field-row.ui',
    }, this);
  }

  value!: string;
}
