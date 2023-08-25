import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Gtk from 'gi://Gtk';
import FileDialog from '../dialogs/file-dialog.js';
import { BackendPortal } from '../api.js';

Gio._promisify(Gtk.FileDialog.prototype, 'select_folder', 'select_folder_finish');

export function SettingsActions(
{
  action_map,
  parent_window,
}:
{
  action_map: Gio.ActionMap;
  parent_window: Gtk.Window;
}) {
  const settings = BackendPortal({
    interface_name: 'com.github.kinten108101.SteamVPK.Server.Settings',
  });
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
      await settings.property_set('GameDirectory', GLib.Variant.new_string(path));
    })().catch(error => logError(error));
  });
  action_map.add_action(set_game_dir);

  const clear_game_dir = new Gio.SimpleAction({
    name: 'settings.clear-game-dir',
  });
  clear_game_dir.connect('activate', () => {
    (async () => {
      await settings.property_set('GameDirectory', GLib.Variant.new_string(''));
    })().catch(error => logError(error));
  });
  action_map.add_action(clear_game_dir);
}
