import Gio from 'gi://Gio';
import AddonBoxClient from '../backend/client.js';
import PreferencesWindow from '../ui/preferences-window.js';

/**
 * @param {{
 *   preferences_window: PreferencesWindow;
 *   client: AddonBoxClient;
 *   gsettings: Gio.Settings;
 * }} params
 */
export default function SettingsPresenter(
{ preferences_window,
  client,
  gsettings,
}) {
  client.services.settings.subscribe(
    'notify::GameDirectory',
    /**
     * @param {string} dir
     */
    dir => {
      preferences_window.set_game_dir_path(dir);
    });

  (async () => {
    /** @type {string | null} */
    let dir;
    try {
      dir = await client.services.settings.property_get('GameDirectory');
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
