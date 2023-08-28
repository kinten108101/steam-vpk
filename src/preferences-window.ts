import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import TypedBuilder from './typed-builder.js';
import { APP_RDNN } from './const.js';

export default function PreferencesWindow() {
  const builder = new TypedBuilder();
  builder.add_from_resource(`${APP_RDNN}/ui/preferences-window.ui`);

  const game_dir_path = builder.get_typed_object<Gtk.Label>('game-dir-path');
  const window = builder.get_typed_object<Adw.Window>('window');

  function bind(
  { settings,
    parent_window,
  }:
  { settings?: Gio.Settings;
    parent_window: Gtk.Window,
  }) {
    window.set_transient_for(parent_window);

    const update_game_dir_path = () => {
      const val = null;
      if (val === null) return;
      let dir: Gio.File = Gio.File.new_for_path(val);
      const name = dir?.get_basename() || null;
      const display = (() => {
        if (name === null) return '(None)';
        return name;
      })()
      game_dir_path.set_label(display);
    };
    // listen to settings signal notify::game-dir
    update_game_dir_path();

    const enable_remember_winsize = builder.get_typed_object<Gtk.Switch>(
      'enable_remember_winsize'
    );

    enable_remember_winsize.set_active(settings?.get_boolean('remember-winsize') || false);
    const update_remember_winsize = () => {
      enable_remember_winsize.set_action_target_value(
        GLib.Variant.new_boolean(!enable_remember_winsize.get_active())
      );
    };
    update_remember_winsize();

    settings?.connect('changed', (_obj, key) => {
      if (key === null) return;
      if (key === 'game-dir') {
        update_game_dir_path();
      } else if (key === 'remember-winsize') {
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
