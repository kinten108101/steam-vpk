import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import TypedBuilder from './typed-builder.js';
import { APP_RDNN } from './const.js';
import FileDialog from './dialogs/file-dialog.js';
import AddonBoxClient from './backend/client.js';

Gio._promisify(Gtk.FileDialog.prototype, 'select_folder', 'select_folder_finish');

export function SettingsActions(
{ parent_window,
  main_window,
  settings,
  client,
}:
{ parent_window: Gtk.Window;
  main_window: Gtk.ApplicationWindow;
  settings?: Gio.Settings;
  client: AddonBoxClient;
}) {
  const actions: Gio.Action[] = [];
  const set_game_dir = new Gio.SimpleAction({
    name: 'settings.set-game-dir',
    parameter_type: GLib.VariantType.new('s'),
  });
  set_game_dir.connect('activate', (_action, parameter: GLib.Variant) => {
    (async () => {
      let gui = true;
      let path = parameter.recursiveUnpack() as string;
      if (path === '') gui = true;
      else gui = false;

      if (gui) {
        const fileDialog = new FileDialog();
        fileDialog.set_title('Select a directory');
        fileDialog.set_filters((() => {
          const filters = new Gio.ListStore({ item_type: Gtk.FileFilter.$gtype });
          const default_filter = new Gtk.FileFilter({ patterns: ['*'] });
          filters.append(default_filter);
          return filters;
        })());
        fileDialog.set_accept_label('Select');
        let file: Gio.File | undefined;
        try {
          file = await fileDialog.select_folder_async(parent_window, null);
        } catch (error) {
          if (error instanceof GLib.Error) {
            if (error.matches(Gtk.dialog_error_quark(), Gtk.DialogError.DISMISSED)) { return; }
          } else throw error;
        }
        path = file?.get_path() || '';
      }
      await client.services.settings.property_set('GameDirectory', GLib.Variant.new_string(path));
    })().catch(error => logError(error));
  });
  actions.push(set_game_dir);

  const rw_handlers: number[] = [];
  const remember_winsize = new Gio.SimpleAction({
    name: 'settings.remember-winsize',
    parameter_type: GLib.VariantType.new('b'),
  });
  remember_winsize.connect('activate', (_action, parameter: GLib.Variant) => {
    const val = parameter.recursiveUnpack() as boolean;
    if (val) {
      settings?.set_boolean('remember-winsize', true);
      const using_dh = main_window.connect('notify::default-height', () => {
        settings?.set_int('default-height', main_window.default_height);
      });
      const using_dw = main_window.connect('notify::default-width', () => {
        settings?.set_int('default-width', main_window.default_width);
      });
      rw_handlers.push(using_dh, using_dw);
    } else {
      settings?.set_boolean('remember-winsize', false);
      rw_handlers.forEach(x => {
        main_window.disconnect(x);
      });
    }
  });
  actions.push(remember_winsize);

  const clear_game_dir = new Gio.SimpleAction({
    name: 'settings.clear-game-dir',
  });
  clear_game_dir.connect('activate', () => {
    (async () => {
      await client.services.settings.property_set('GameDirectory', GLib.Variant.new_string(''));
    })().catch(error => logError(error));
  });
  actions.push(clear_game_dir);

  function export2actionMap(action_map: Gio.ActionMap) {
    actions.forEach(x => {
      action_map.add_action(x);
    });
    return services;
  }

  const services = {
    export2actionMap,
  }

  return services;
}

export default function PreferencesWindow() {
  const builder = new TypedBuilder();
  builder.add_from_resource(`${APP_RDNN}/ui/preferences-window.ui`);

  const game_dir_path = builder.get_typed_object<Gtk.Label>('game-dir-path');
  const window = builder.get_typed_object<Adw.Window>('window');

  function bind(
  { parent_window,
    gsettings,
    client,
  }:
  { parent_window: Gtk.Window,
    gsettings: Gio.Settings;
    client: AddonBoxClient;
  }) {
    window.set_transient_for(parent_window);
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
    client.services.settings.subscribe('notify::GameDirectory', (dir: string) => {
      update_game_dir_path(dir);
    });
    client.services.settings.property_get<string>('GameDirectory')
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
