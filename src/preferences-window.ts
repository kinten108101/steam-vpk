import GLib from 'gi://GLib';
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
    gsettings,
  }:
  { parent_window: Gtk.Window,
    gsettings: Gio.Settings;
  }) {
    window.set_transient_for(parent_window);

    const backend_settings = BackendPortal({
      interface_name: 'com.github.kinten108101.SteamVPK.Server.Settings'
    });
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
    const clear_game_dir = builder.get_typed_object<Gtk.Button>(
      'clear_game_dir'
    );
    backend_settings.subscribe('notify::GameDirectory', (dir: string) => {
      update_game_dir_path(dir);
    });
    backend_settings.property_get<string>('GameDirectory')
      .then((dir) => {
        update_game_dir_path(dir);
      })
      .catch(error => logError(error));

    const enable_remember_winsize = builder.get_typed_object<Gtk.Switch>(
      'enable_remember_winsize'
    );
    enable_remember_winsize.set_active(gsettings.get_boolean('remember-winsize') || false);
    const update_remember_winsize = () => {
      enable_remember_winsize.set_action_target_value(
        GLib.Variant.new_boolean(!enable_remember_winsize.get_active())
      );
    };
    update_remember_winsize();
    gsettings.connect('changed', (_obj, key) => {
      if (key === null) return;
      if (key === 'remember-winsize') {
        update_remember_winsize();
      }
    });

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
