import Gio from 'gi://Gio';
import Adw from 'gi://Adw';

export const TOAST_TIMEOUT_X_SHORT = 2;
export const TOAST_TIMEOUT_SHORT = 3;

/**
 * @param {Gio.ListModel} model
 * @param {Adw.PreferencesGroup} group
 * @returns {void}
 */
export function update_group_with_list(model, group) {
  if (model.get_n_items() === 0) {
    group.set_visible(false);
  }
  else {
    group.set_visible(true);
  }
}
