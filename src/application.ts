import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import Adw from 'gi://Adw';
import GLib from 'gi://GLib';
import Gdk from 'gi://Gdk';
import Gtk from 'gi://Gtk';

import { MainWindow } from './main-window.js';
import { initSettingsManager } from './settings';
<<<<<<< HEAD
import { Errors, StvpkError } from './errors';
=======
>>>>>>> 070079f (settings manager: missing import)
let _application_instance: Application | undefined;

function get_application_instance(): Application {
  if (!_application_instance) {
    throw new StvpkError({
      code: Errors.SINGLETON_UNINITIALIZED,
      msg: 'Application has not been instantitated',
    });
  }
  return _application_instance;
}

function save_application_instance(val: Application): void {
  if (_application_instance !== undefined) {
    throw new StvpkError({
      code: Errors.SINGLETON_INITIALIZED,
      msg: 'Application has already been instantiated',
    });
  }
  _application_instance = val;
}

export const Application = GObject.registerClass({
  GTypeName: 'Application',
}, class extends Adw.Application {
  constructor(params={}) {
    super(params);
    GLib.set_application_name('SteamVpk');
    save_application_instance(this);
    initSettingsManager();
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
    {
      name: 'placeholder-command',
      activate: () => {
        log('Run placeholder command!');
        return;
      },
      parameter_type: null,
      state: null,
      change_state: () => { return; },
    },
    ];
    this.add_action_entries(actionEntries, null);
  }

  #setAppAccels() {
    this.set_accels_for_action('app.placeholder-command', ['<Control>x']);
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
