import Gio from 'gi://Gio';
import InjectButtonSet from '../../ui/inject-button-set.js';
import PreferencesWindow from '../../ui/preferences-window.js';

export default function SettingsInjectButtonStylesPresenter(
{ inject_button_styles,
  gsettings,
}:
{ inject_button_styles: PreferencesWindow["inject_button_styles"];
  gsettings: Gio.Settings;
}) {
  const model = inject_button_styles.get_model();
  model.splice(0, 0, InjectButtonSet.ButtonStylesList);

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
    const idx = inject_button_styles.get_selected();
    const val = inject_button_styles.get_model().get_string(idx) as InjectButtonSet['button_style'] | null;
    return val;
  }

  let prev_style = get_prev_val_gsettings();

  inject_button_styles.connect('notify::selected', () => {
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
      inject_button_styles.set_selected(Math.max(InjectButtonSet.ButtonStylesList.indexOf(val), 0))
    }
  });
  inject_button_styles.set_selected(Math.max(InjectButtonSet.ButtonStylesList.indexOf(prev_style || ''), 0));
}
