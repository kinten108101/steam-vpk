import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import TypedBuilder from './typed-builder.js';
import { APP_RDNN } from './const.js';
import { BackendPortal } from './api.js';

export default function PreferencesWindow() {
  const builder = new TypedBuilder();
  builder.add_from_resource(`${APP_RDNN}/ui/preferences-window.ui`);

  const game_dir_path = builder.get_typed_object<Gtk.Label>('game-dir-path');
  const window = builder.get_typed_object<Adw.Window>('window');

  function bind(
  { parent_window,
  }:
  { parent_window: Gtk.Window,
  }) {
    window.set_transient_for(parent_window);
    const settings = BackendPortal({
      interface_name: 'com.github.kinten108101.SteamVPK.Server.Settings'
    });

    const clear_game_dir = builder.get_typed_object<Gtk.Button>(
      'clear_game_dir'
    );

    const update_game_dir_path = (val: string) => {
      let dir: Gio.File = Gio.File.new_for_path(val);
      const name = dir.get_basename() || null;
      if (name === null) {
        game_dir_path.set_label('(None)');
        clear_game_dir.set_sensitive(false);
      } else {
        game_dir_path.set_label(name);
        clear_game_dir.set_sensitive(true);
      }
    };
    settings.subscribe('notify::GameDirectory', (dir: string) => {
      update_game_dir_path(dir);
    });
    settings.property_get<string>('GameDirectory')
      .then((dir) => {
        update_game_dir_path(dir);
      })
      .catch(error => logError(error));

    return window_builder;
  }

  function insert_action_group(group: Gio.ActionGroup) {
    window.insert_action_group('pref-win', group);
    return window_builder;
  }

  function build() {
    return window;
  }

  const window_builder = {
    bind,
    insert_action_group,
    build,
  };

  return window_builder;
}
