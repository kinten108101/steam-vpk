import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

// Adapted to JavaScript from https://gitlab.gnome.org/GNOME/gnome-text-editor/-/blob/cd6e111e3142a80f509684e65c104c8b3a097761/src/editor-theme-selector.c
// Also adapted from https://github.com/sonnyp/Commit/blob/52bedf0a2bc3a456f4d17350bd386abb0475c8e4/src/ThemeSelector.js

export default class ThemeSelector extends Gtk.Widget {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkThemeSelector',
      Properties: {
        theme: GObject.ParamSpec.string(
          'theme', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
      },
      Template: 'resource:///com/github/kinten108101/SteamVPK/ui/themeselector.ui',
      CssName: 'themeselector',
      Children: [ 'follow' ],
    }, this);
  }

  /**
   * @type {!string}
   */
  theme;

  /**
   * @type {!Gtk.CheckButton}
   */
  // @ts-expect-error
  follow;

  constructor(params = {}) {
    super(params);
    this.set_layout_manager(new Gtk.BinLayout)

    const style_manager = Adw.StyleManager.get_default();
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
    this.follow.set_visible(Adw.StyleManager.get_default().get_system_supports_color_schemes());
  }

  _on_notify_dark() {
    if (Adw.StyleManager.get_default().get_dark()) this.add_css_class("dark");
    else this.remove_css_class("dark");
  }
}
