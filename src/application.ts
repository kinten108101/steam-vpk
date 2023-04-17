import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import Adw from 'gi://Adw';
import GLib from 'gi://GLib';
import Gdk from 'gi://Gdk';
import Gtk from 'gi://Gtk';

import { MainWindow } from './main-window.js';

export const Application = GObject.registerClass({
  GTypeName: 'Application',
}, class extends Adw.Application {
  constructor(params={}) {
    super(params);
    GLib.set_application_name('SteamVpk');
  }

  vfunc_startup() {
    super.vfunc_startup();
    this.#setAppActions();
    this.#setAppAccels();
    this.#setStylesheet();
  }

  #setAppActions() {
    const actionEntries: Gio.ActionEntry[] = [{
      name: 'quit',
      activate: (() =>{
        this.get_windows().forEach( win => {
          win.close();
        });
      }).bind(this as Adw.Application),
      parameter_type: null,
      state: null,
      change_state: () => { return; },
    },
    ];
    this.add_action_entries(actionEntries, null);
  }

  #setAppAccels() {
    this.set_accels_for_action('app.quit', ['<Control>q']);
    this.set_accels_for_action('win.show-preferences', ['<Control>comma']);
  }

  #setStylesheet(){
    const provider = new Gtk.CssProvider();
    provider.load_from_resource('com/github/kinten108101/SteamVpk/css/style.css');

    const default_display: any = Gdk.Display.get_default();
    if (!default_display) return;
    Gtk.StyleContext.add_provider_for_display(
      default_display,
      provider,
      Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
    );
  }

  vfunc_activate() {
    super.vfunc_activate();
    const main_window = new MainWindow({ application: this });
    main_window.present();
  }
});
