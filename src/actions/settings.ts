import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';

import FileDialog from '../dialogs/file-dialog.js';
import AddonBoxClient from '../backend/client.js';

Gio._promisify(Gtk.FileDialog.prototype, 'select_folder', 'select_folder_finish');

export default function SettingsActions(
{ parent_window,
  main_window,
  settings,
  client,
}:
{ parent_window: Gtk.Window;
  main_window: Gtk.ApplicationWindow;
  settings: Gio.Settings;
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
      settings.set_boolean('remember-winsize', true);

      function update_size() {
        try {
          settings.set_value('window-size', GLib.Variant.new_tuple([
            GLib.Variant.new_int32(main_window.default_width),
            GLib.Variant.new_int32(main_window.default_height),
            GLib.Variant.new_boolean(main_window.maximized)
          ]));
        } catch (error) {
          logError(error);
        }
      }
      const using_dh = main_window.connect('notify::default-height', update_size);
      const using_dw = main_window.connect('notify::default-width', update_size);
      const using_maximized = main_window.connect('notify::maximized', update_size);
      update_size();

      rw_handlers.push(using_dh, using_dw, using_maximized);
    } else {
      settings.set_boolean('remember-winsize', false);
      rw_handlers.forEach(x => {
        main_window.disconnect(x);
      });
    }
  });
  remember_winsize.activate(GLib.Variant.new_boolean(settings.get_boolean('remember-winsize')));
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

  const enable_text_markup = new Gio.SimpleAction({
    name: 'settings.enable-text-markup',
    parameter_type: GLib.VariantType.new('b'),
  });
  enable_text_markup.connect('activate', (_action, parameter) => {
    const val = parameter?.get_boolean();
    if (typeof val !== 'boolean') throw new Error;
    settings.set_boolean('enable-text-markup', val);
  });
  actions.push(enable_text_markup);

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
