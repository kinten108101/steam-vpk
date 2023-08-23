import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Adw from 'gi://Adw';
import { LaunchpadPage } from './launchpad.js';
import { DownloadPage } from './download-page.js';
import { ProfileBar } from './profile-bar.js';
import InjectButtonSet from './inject-button-set.js';
import { param_spec_string, registerClass, GtkTemplate } from './steam-vpk-utils/utils.js';
import { APP_RDNN } from './const.js';
import HeaderBox, { HeaderboxConsole } from './headerbox.js';

export const TOAST_TIMEOUT_X_SHORT = 2;
export const TOAST_TIMEOUT_SHORT = 3;

export function update_group_with_list(model: Gio.ListModel, group: Adw.PreferencesGroup) {
  if (model.get_n_items() === 0) {
    group.set_visible(false);
  } else {
    group.set_visible(true);
  }
}

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

export function widget_ensure() {
  GObject.type_ensure(LaunchpadPage.$gtype);
  GObject.type_ensure(DownloadPage.$gtype);
  GObject.type_ensure(ProfileBar.$gtype);
  GObject.type_ensure(InjectButtonSet.$gtype);
  GObject.type_ensure(FieldRow.$gtype);
  GObject.type_ensure(HeaderBox.$gtype);
  GObject.type_ensure(HeaderboxConsole.$gtype);
}
