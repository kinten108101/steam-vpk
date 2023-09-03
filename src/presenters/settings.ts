import Gio from 'gi://Gio';
import AddonBoxClient from '../backend/client.js';
import PreferencesWindow from '../ui/preferences-window.js';

export default function SettingsPresenter(
{ preferences_window,
  client,
  gsettings,
}:
{ preferences_window: PreferencesWindow;
  client: AddonBoxClient;
  gsettings: Gio.Settings;
}) {
  client.services.settings.subscribe('notify::GameDirectory', (dir: string) => {
    preferences_window.set_game_dir_path(dir);
  });
  (async () => {
    let dir: string | null;
    try {
      dir = await client.services.settings.property_get<string>('GameDirectory');
    } catch (error) {
      logError(error);
      dir = null;
    }
    preferences_window.set_game_dir_path(dir);
  })().catch(error => {
    logError(error)
  });

  const update_remember_winsize = () => {
    const state = gsettings.get_boolean('remember-winsize') || false;
    if (state !== preferences_window.enable_remember_winsize.get_active()) {
      preferences_window.enable_remember_winsize.set_active(state);
    }
  };
  update_remember_winsize();
  gsettings.connect('changed', (_obj, key) => {
    if (key === null) return;
    if (key === 'remember-winsize') {
      update_remember_winsize();
    }
  });
}
