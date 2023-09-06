import Gio from 'gi://Gio';
import InjectButtonSet from '../ui/inject-button-set.js';

export default function InjectButtonSetRestore(
{ inject_button_set,
  gsettings,
}:
{ inject_button_set: InjectButtonSet;
  gsettings: Gio.Settings;
}) {
  gsettings.bind('inject-button-style', inject_button_set, 'button_style', Gio.SettingsBindFlags.DEFAULT);
}
