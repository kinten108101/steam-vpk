import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import TypedBuilder from './typed-builder.js';
import { APP_RDNN } from './const.js';
import Settings from './settings.js';

export default function PreferencesWindow(): [Gtk.Window, (params: {parent_window: Gtk.Window, settings: Settings}) => void, (group: Gio.ActionGroup) => void] {
  const builder = new TypedBuilder();
  builder.add_from_resource(`${APP_RDNN}/ui/preferences-window.ui`);

  const game_dir_path = builder.get_typed_object<Gtk.Label>('game-dir-path');
  const window = builder.get_typed_object<Adw.Window>('window');

  function bind(
  {
    parent_window,
    settings,
  }:
  {
    parent_window: Gtk.Window,
    settings: Settings;
  }) {
    const update_game_dir_path = () => {
      const dir = settings.game_dir;
      const name = dir.get_basename();
      game_dir_path.set_label(name);
    };
    settings.connect_after('notify::game-dir', update_game_dir_path);
    update_game_dir_path();
    window.set_transient_for(parent_window);
  }

  function insert_action_group(group: Gio.ActionGroup) {
    window.insert_action_group('pref-win', group);
  }

  return [window, bind, insert_action_group];
}
