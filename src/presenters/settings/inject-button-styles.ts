import Gio from 'gi://Gio';
import InjectButtonSet from '../../ui/inject-button-set.js';
import PreferencesWindowInjectButtonStylesView from '../../ui/preferences-window/inject-button-styles-view.js';

export default function SettingsInjectButtonStylesPresenter(
{ inject_button_styles_view,
  gsettings,
}:
{ inject_button_styles_view: PreferencesWindowInjectButtonStylesView;
  gsettings: Gio.Settings;
}) {
  const model = inject_button_styles_view.get_model();
  model.splice(0, 0, InjectButtonSet.ButtonStyles as unknown as string[]);

  function get_prev_val_gsettings() {
    let prev_style: InjectButtonSet['button_style'];
    try {
      prev_style = gsettings.get_string('inject-button-style') as InjectButtonSet['button_style'];
    } catch (error) {
      logError(error);
      prev_style = 'minimal';
    }
    return prev_style;
  }

  function get_current_enum() {
    const idx = inject_button_styles_view.get_selected();
    const val = inject_button_styles_view.get_model().get_string(idx) as InjectButtonSet['button_style'] | null;
    return val;
  }

  let prev_style = get_prev_val_gsettings();

  inject_button_styles_view.connect('notify::selected', () => {
    const val = get_current_enum();
    if (val === null) return;
    gsettings.set_string('inject-button-style', val);
  })
  gsettings.connect('changed', (_obj, key: string | null) => {
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
