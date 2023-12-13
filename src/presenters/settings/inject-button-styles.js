import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import InjectButtonSet from '../../ui/inject-button-set.js';

/**
 * @param {{
 *   inject_button_styles: Adw.ComboRow;
 *   gsettings: Gio.Settings;
 * }} params
 */
export default function SettingsInjectButtonStylesPresenter({
  inject_button_styles,
  gsettings,
}) {
  const model = /** @type {Gtk.StringList | null} */ (inject_button_styles.get_model());
  if (!model) throw new Error;
  model.splice(0, 0, /** @type {string[]} */ ( /** @type {unknown} */ (InjectButtonSet.ButtonStyles)));

  function get_prev_val_gsettings() {
    let prev_style;
    try {
      const val = gsettings.get_string('inject-button-style');
      if (val === null) throw new Error;
      prev_style = (val);
    } catch (error) {
      logError(error);
      prev_style = 'minimal';
    }
    return prev_style;
  }

  function get_current_enum() {
    if (!model) throw new Error;
    const idx = inject_button_styles.get_selected();
    const val = (model.get_string(idx));
    return val;
  }

  let prev_style = get_prev_val_gsettings();

  inject_button_styles.connect('notify::selected', () => {
    const val = get_current_enum();
    if (val === null) return;
    gsettings.set_string('inject-button-style', val);
  })
  gsettings.connect('changed', (_obj, /** @type {string | null} */ key) => {
    if (key === 'inject-button-style') {
      const val = get_current_enum();
      if (val === null) return;
      const prev_val = get_prev_val_gsettings();
      if (val === prev_val) return;
      inject_button_styles.set_selected(Math.max((/** @type {readonly string[]} */ (InjectButtonSet.ButtonStyles)).indexOf(val), 0))
    }
  });
  inject_button_styles.set_selected(Math.max((/** @type {readonly string[]} */ (InjectButtonSet.ButtonStyles)).indexOf(prev_style || ''), 0));
}
