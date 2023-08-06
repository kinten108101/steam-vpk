import Adw from 'gi://Adw';
import GObject from 'gi://GObject';
import * as Utils from './utils.js';
import * as Consts from './const.js';

export const TOAST_TIMEOUT_SHORT = 2;

export class FieldRow extends Adw.ActionRow {
  static {
    Utils.registerClass({
      Properties: {
        value: GObject.ParamSpec.string('value', 'value', 'value', Utils.g_param_default, null),
      },
      Template: `resource://${Consts.APP_RDNN}/ui/field-row.ui`,
    }, this);
  }

  value!: string;

  set_value(val: string) {
    this.value = val;
  }
}
