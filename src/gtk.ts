import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Adw from 'gi://Adw';
import { LaunchpadPage } from './launchpad.js';
import { DownloadPage } from './download-page.js';
import { ProfileBar } from './profile-bar.js';
import InjectConsole from './inject-console.js';
import InjectButtonSet from './inject-button-set.js';
import { FieldRow } from './field-row.js';

export const TOAST_TIMEOUT_X_SHORT = 2;
export const TOAST_TIMEOUT_SHORT = 3;

export function update_group_with_list(model: Gio.ListModel, group: Adw.PreferencesGroup) {
  if (model.get_n_items() === 0) {
    group.set_visible(false);
  } else {
    group.set_visible(true);
  }
}

export function widget_ensure() {
  GObject.type_ensure(LaunchpadPage.$gtype);
  GObject.type_ensure(DownloadPage.$gtype);
  GObject.type_ensure(ProfileBar.$gtype);
  GObject.type_ensure(InjectConsole.$gtype);
  GObject.type_ensure(InjectButtonSet.$gtype);
  GObject.type_ensure(FieldRow.$gtype);
}
