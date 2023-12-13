import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';

/**
 * @param {{
 *   gsettings: Gio.Settings;
 *   enable_text_markup: Gtk.Switch;
 * }} params
 */
export default function SettingsTextMarkupPresenter(
{ gsettings,
  enable_text_markup,
}) {
  function update_text_markup() {
    let val;
    try {
      val = gsettings.get_boolean('enable-text-markup');
    } catch (error) {
      logError(error);
      return;
    }
    if (val !== enable_text_markup.get_active())
      enable_text_markup.set_active(val);
  }
  gsettings.connect('changed', (_obj, key) => {
    if (key === 'enable-text-markup') {
      update_text_markup();
    }
  });
  update_text_markup();
}
