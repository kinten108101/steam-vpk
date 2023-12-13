import Gio from 'gi://Gio';
import InjectButtonSet from '../../ui/inject-button-set.js';
import PreferencesWindowInjectButtonStylesView from '../../ui/preferences-window/inject-button-styles-view.js';

/**
 * @param {{
 *   inject_button_styles_view: PreferencesWindowInjectButtonStylesView;
 *   gsettings: Gio.Settings;
 * }} params
 */
export default function SettingsInjectButtonStylesPresenter({
  inject_button_styles_view,
  gsettings,
}) {
  const model = inject_button_styles_view.get_model();
  model.splice(0, 0, /** @type {string[]} */ ( /** @type {unknown} */ (InjectButtonSet.ButtonStyles)));

  function get_prev_val_gsettings() {
    /** @type {InjectButtonSet['button_style']} */
    let prev_style;
    try {
      const val = gsettings.get_string('inject-button-style');
      if (val === null) throw new Error;
      prev_style = /** @type {InjectButtonSet['button_style']} */ (val);
    } catch (error) {
      logError(error);
      prev_style = 'minimal';
    }
    return prev_style;
  }

  function get_current_enum() {
    const idx = inject_button_styles_view.get_selected();
    const val = /** @type {InjectButtonSet['button_style'] | null} */ (inject_button_styles_view.get_model().get_string(idx));
    return val;
  }

  let prev_style = get_prev_val_gsettings();

  inject_button_styles_view.connect('notify::selected', () => {
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
      inject_button_styles_view.set_selected(Math.max(InjectButtonSet.ButtonStyles.indexOf(val), 0))
    }
  });
  inject_button_styles_view.set_selected(Math.max(InjectButtonSet.ButtonStyles.indexOf(prev_style || ''), 0));
}
