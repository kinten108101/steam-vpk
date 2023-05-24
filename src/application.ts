import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import Adw from 'gi://Adw';
import Gdk from 'gi://Gdk';
import Gtk from 'gi://Gtk';

import { MainWindow } from './main-window.js';
import { initSettingsManager } from './settings.js';
import { init_profile_manager, restore_last_profile, save_current_as_last_profile } from './profile-manager.js';
import { initAddonManager } from './addon-manager.js';
import { ActionEntry, StatelessActionEntry, makeAction } from './actions.js';
import { Errors, StvpkError } from './errors.js';

let _application_instance: Application | undefined;

function get_application_instance(): Application {
  if (!_application_instance) {
    throw new StvpkError({
      code: Errors.SINGLETON_UNINITIALIZED,
      message: 'Application has not been instantitated',
    });
  }
  return _application_instance;
}

function save_application_instance(val: Application): void {
  if (_application_instance !== undefined) {
    throw new StvpkError({
      code: Errors.SINGLETON_INITIALIZED,
      message: 'Application has already been instantiated',
    });
  }
  _application_instance = val;
}

/**
 * @note Application must be registered with the prop `application-id` before accessing its data and resources.
 */
export class Application extends Adw.Application {

  static {
    GObject.registerClass(this);
  }

  constructor(params = {}) {
    super(params);
    GLib.set_application_name('SteamVpk');
    save_application_instance(this);
    initSettingsManager();
    init_profile_manager();
    initAddonManager();
    this.connect('shutdown', () => {
      save_current_as_last_profile();
    });
  }

  vfunc_startup() {
    super.vfunc_startup();
    this.#setAppActions();
    this.#setAppAccels();
    this.#setStylesheet();
  }

  #setAppActions() {
    const actionEntries: ActionEntry[] = [{
      name: 'quit',
      activate: () => {
        this.get_windows().forEach(win => {
          win.close();
        });
      },
    } as StatelessActionEntry,
    {
      name: 'placeholder-command',
      activate: () => {
        log('Run placeholder command!');
      },
    } as StatelessActionEntry];
    actionEntries.forEach(item => {
      const action = makeAction(item);
      this.add_action(action);
    });
  }

  #setAppAccels() {
    set_accels_for_local_action('app.placeholder-command', ['<Control>x']);
    set_accels_for_local_action('app.quit', ['<Control>q']);
  }

  #setStylesheet() {
    const provider = new Gtk.CssProvider();
    provider.load_from_resource('com/github/kinten108101/SteamVpk/css/style.css');

    const default_display: any = Gdk.Display.get_default();
    if (!default_display)
      return;
    Gtk.StyleContext.add_provider_for_display(
      default_display,
      provider,
      Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION,
    );
  }

  vfunc_activate() {
    super.vfunc_activate();
    const main_window = new MainWindow({ application: this });
    restore_last_profile();
    main_window.present();
  }
}

/**
 * @param actionList An array of ActionEntry
 * @param prefix The prefix for the action group of the above actionList
 */
export function set_accels_for_local_action(actionList: ActionEntry[], prefix?: string): void;
/**
 * @param detailed_action_name Name of the action, including prefix
 * @param accels The accelerators that bind to this action
 */
export function set_accels_for_local_action(detailed_action_name: string, accels: string[]): void;
export function set_accels_for_local_action(arg1: any, arg2: any): void {
  if (typeof arg1 === 'string' && Array.isArray(arg2)) {
    const detailed_action_name: string = arg1;
    const accels: string[] = arg2;
    get_application_instance().set_accels_for_action(detailed_action_name, accels);
  } else {
    const actionList: ActionEntry[] = arg1;
    const prefix: string | undefined = arg2;
    actionList.forEach(actionEntry => {
      if (!actionEntry.name || !actionEntry.accels)
        return;
      const detailed_action_name: string =
        prefix
          ? `${prefix}.${actionEntry.name}`
          : actionEntry.name;
      get_application_instance().set_accels_for_action(detailed_action_name, actionEntry.accels);
    });
  }
}
