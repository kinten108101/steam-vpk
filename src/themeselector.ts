import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import { GtkChildren, GtkTemplate, param_spec_string, registerClass } from './steam-vpk-utils/utils.js';
import { APP_RDNN } from './const.js';

// Adapted to JavaScript from https://gitlab.gnome.org/GNOME/gnome-text-editor/-/blob/cd6e111e3142a80f509684e65c104c8b3a097761/src/editor-theme-selector.c
// Also adapted from https://github.com/sonnyp/Commit/blob/52bedf0a2bc3a456f4d17350bd386abb0475c8e4/src/ThemeSelector.js

const style_manager = Adw.StyleManager.get_default();

export default class ThemeSelector extends Gtk.Widget {
  static [GObject.properties] = {
    theme: param_spec_string({ name: 'theme' }),
  }
  static [GtkTemplate] = `resource://${APP_RDNN}/ui/themeselector.ui`;
  static [GtkChildren] = ['follow']

  static {
    registerClass({
      CssName: 'themeselector',
    }, this);
  }

  follow!: Gtk.CheckButton;
  theme!: string;

  constructor(params = {}) {
    super(params);
    this.set_layout_manager(new Gtk.BinLayout)

    style_manager.connect(
      "notify::system-supports-color-schemes",
      this._on_notify_system_supports_color_schemes.bind(this),
    );
    this._on_notify_system_supports_color_schemes();

    const dark = style_manager.get_dark();
    this.theme = dark ? "dark" : "light";

    style_manager.connect("notify::dark", this._on_notify_dark.bind(this));
    this._on_notify_dark();
  }

  _on_notify_system_supports_color_schemes() {
    this.follow.set_visible(style_manager.get_system_supports_color_schemes());
  }

  _on_notify_dark() {
    if (style_manager.get_dark()) this.add_css_class("dark");
    else this.remove_css_class("dark");
  }
}
