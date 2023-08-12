import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Gtk from 'gi://Gtk';
import { g_variant_unpack, promise_wrap } from '../steam-vpk-utils/utils.js';
import FileDialog from '../dialogs/file-dialog.js';

export function SettingsActions(
{
  action_map,
  parent_window,
  settings,
}:
{
  action_map: Gio.ActionMap;
  parent_window: Gtk.Window;
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
}
