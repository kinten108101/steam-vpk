import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Gtk from 'gi://Gtk';
import { g_variant_unpack, promise_wrap } from '../steam-vpk-utils/utils.js';
import FileDialog from '../dialogs/file-dialog.js';

export function SettingsActions(
{
  action_map,
  parent_window,
  main_window,
  settings,
}:
{
  action_map: Gio.ActionMap;
  parent_window: Gtk.Window;
  main_window: Gtk.ApplicationWindow;
  settings?: Gio.Settings;
}) {
  const set_game_dir = new Gio.SimpleAction({
    name: 'settings.set-game-dir',
    parameter_type: GLib.VariantType.new('s'),
  });
  set_game_dir.connect('activate', (_action, parameter) => {
    promise_wrap(async () => {
      let gui = true;
      const path = g_variant_unpack<string>(parameter, 'string');
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
        const content = file?.get_path() || '';
        content;
        settings?.set_string('game-dir', content);
      }
    });
  });
  action_map.add_action(set_game_dir);

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
  action_map.add_action(remember_winsize);
}
