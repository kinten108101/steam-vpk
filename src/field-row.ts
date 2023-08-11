import GObject from 'gi://GObject';
import Adw from 'gi://Adw';

import { GtkTemplate, param_spec_string, registerClass } from './utils.js';
import { APP_RDNN } from './const.js';

export class FieldRow extends Adw.ActionRow {
  static [GObject.properties] = {
    value: param_spec_string({ name: 'value', blurb: 'Markup is allowed' }),
  };
  static [GtkTemplate] = `resource://${APP_RDNN}/ui/field-row.ui`;

  static {
    registerClass({}, this);
  }

  value!: string;

  set_value(val: string) {
    this.value = val;
  }
}
