import GObject from 'gi://GObject';
import { ActionRow } from './sensitizable-widgets.js';

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
