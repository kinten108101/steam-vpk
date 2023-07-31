import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import { APP_ID } from './const.js';
import { g_param_default, g_variant_unpack, promise_wrap, registerClass } from './utils.js';
import { FileDialog, FileFilter } from './utils/file-dialog.js';

Gio._promisify(Gtk.FileDialog.prototype, 'select_folder', 'select_folder_finish');

export default class Settings extends GObject.Object {
  static [GObject.properties] = {
    'game-dir': GObject.ParamSpec.object('game-dir', 'game-dir', 'game-dir', g_param_default, Gio.File.$gtype),
    'game-dir-raw': GObject.ParamSpec.string('game-dir-raw', 'game-dir-raw', 'game-dir-raw', g_param_default, null),
  };

  static {
    registerClass({}, this);
  }
  gio_settings: Gio.Settings;

  game_dir!: Gio.File;
  game_dir_raw!: string;

  constructor() {
    super({});
    this.gio_settings = new Gio.Settings({ schema_id: APP_ID });
  }

  bind() {
    this.connect('notify::game-dir-raw', this.updateGameDir);
    this.gio_settings.bind('game-dir', this, 'game-dir-raw', Gio.SettingsBindFlags.DEFAULT);
  }

  async start() {
    this.updateGameDir();
    console.info('game-dir:', this.game_dir.get_path());
  }

  updateGameDir = () => {
    this.game_dir = Gio.File.new_for_path(this.game_dir_raw);
  }

  set_game_dir(val: string) {
    this.gio_settings.set_string('game-dir', val);
  }
}

export function SettingsActions(
{
  action_map,
  settings,
  parent_window,
}:
{
  settings: Settings;
  action_map: Gio.ActionMap;
  parent_window: Gtk.Window;
}) {
  const set_game_dir = new Gio.SimpleAction({
    name: 'settings.set-game-dir',
    parameter_type: null,
    state: GLib.Variant.new_string(''),
  });
  set_game_dir.connect('activate', (action) => {
    promise_wrap(async () => {
      const fileDialog = FileDialog.builder()
        .title('Select a directory')
        .filter(
          FileFilter.builder()
            .pattern('*')
            .build()
        )
        .acceptLabel('Select')
        .build();
      let file: Gio.File | undefined;
      try {
        // @ts-ignore
        file = await fileDialog.select_folder(parent_window, null);
      } catch (error) {
        if (error instanceof GLib.Error) {
          if (error.matches(Gtk.dialog_error_quark(), Gtk.DialogError.DISMISSED)) { return; }
        } else throw error;
      }
      const content = file?.get_path() || '';
      action.change_state(GLib.Variant.new_string(content));
    });
  });
  set_game_dir.connect('change-state', (action, parameter) => {
    if (parameter === null) {
      throw new Error('Bad Implementation: Parameter for action \"settings.set-game-dir\" is null.');
    }
    if (parameter?.deepUnpack() === action.get_state()?.deepUnpack()) {
      console.log('States are the same!');
      return;
    }
    const val = g_variant_unpack<string>(parameter, 'string');
    settings.set_game_dir(val);
    action.set_state(parameter);
  });
  set_game_dir.set_state(GLib.Variant.new_string(settings.game_dir.get_path() || ''));
  action_map.add_action(set_game_dir);
}
