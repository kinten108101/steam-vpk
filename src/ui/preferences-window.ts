import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import { APP_RDNN } from '../utils/const.js';
import { GtkChildren, GtkInternalChildren, GtkTemplate, registerClass } from '../steam-vpk-utils/utils.js';

export default class PreferencesWindow extends Adw.PreferencesWindow {
  static [GtkTemplate] = `resource://${APP_RDNN}/ui/preferences-window.ui`;
  static [GtkChildren] = [
    'enable_remember_winsize',
  ];
  static [GtkInternalChildren] = [
    'clear_game_dir',
    'game-dir-path',
  ];
  static {
    registerClass({}, this);
  }

  enable_remember_winsize!: Gtk.Switch;

  _clear_game_dir!: Gtk.Button;
  _game_dir_path!: Gtk.Label;

  constructor(params = {}) {
    super(params);
    this.enable_remember_winsize.bind_property_full('active', this.enable_remember_winsize, 'action-target', GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: boolean) => {
        return [true, GLib.Variant.new_boolean(!from)];
      }, null as unknown as GObject.TClosure);
  }

  set_game_dir_path(val: string | null) {
    const name = (() => {
      if (val === null) return null;
      return Gio.File.new_for_path(val)?.get_basename() || null;
    })();
    if (name === null) {
      this._game_dir_path.set_label('(None)');
      this._clear_game_dir.set_sensitive(false);
    } else {
      this._game_dir_path.set_label(name);
      this._clear_game_dir.set_sensitive(true);
    }
  };

  insert_actions(group: Gio.ActionGroup) {
    this.insert_action_group('pref-win', group);
  }
}
