import Gio from 'gi://Gio';
import Adw from 'gi://Adw';

export const TOAST_TIMEOUT_X_SHORT = 2;
export const TOAST_TIMEOUT_SHORT = 3;

export function update_group_with_list(model: Gio.ListModel, group: Adw.PreferencesGroup) {
  if (model.get_n_items() === 0) {
    group.set_visible(false);
  } else {
    group.set_visible(true);
  }
}

