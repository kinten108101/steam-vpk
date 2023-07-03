import GLib from 'gi://GLib';
import Gdk from 'gi://Gdk';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import { gobjectClass } from './utils/decorator.js';
import * as Gio1 from './utils/gio1.js';
import * as Utils from './utils.js';
import { Log } from './utils/log.js';

import { Config } from './config.js';
import { Window } from './window.js';
import { SessionData } from './session-data.js';
import { Downloader } from './downloader.js';
import { ActionSynthesizer } from './addon-action.js';
import { AddonStorage } from './addon-storage.js';
import { AddAddon } from './add-addon.js';

@gobjectClass()
export class Application extends Adw.Application {
  settings: Gio.Settings;
  addonStorage: AddonStorage;
  addonSynthesizer: ActionSynthesizer;
  downloader: Downloader;

  pkg_user_data_dir: Gio.File;
  pkg_user_state_dir: Gio.File;

  constructor(params: Adw.Application.ConstructorProperties = {}) {
    super(params);
    GLib.set_application_name(Config.config.app_fullname);
    this.settings = new Gio.Settings({
      schema_id: Config.config.app_id,
    })
    this.downloader = new Downloader();
    Log.info(`${Config.config.app_fullname} (${Config.config.app_id})`);
    Log.info(`build-type: ${Config.config.build_type}`);
    Log.info(`version: ${Config.config.version}`);

    this.pkg_user_data_dir = Gio.File.new_for_path(Config.config.pkg_user_data_dir);
    Utils.makeDirectory(this.pkg_user_data_dir);
    Log.info(`pkg-user-data-dir: ${this.pkg_user_data_dir.get_path()}`);

    this.pkg_user_state_dir = Gio.File.new_for_path(Config.config.pkg_usr_state_dir);
    Utils.makeDirectory(this.pkg_user_state_dir);
    Log.info(`pkg-user-state-dir: ${this.pkg_user_state_dir.get_path()}`);

    this.addonStorage = new AddonStorage({ application: this });
    this.addonSynthesizer = new ActionSynthesizer({ writeable: this.addonStorage.indexer.writeable, storage: this.addonStorage, index: this.addonStorage.indexer });
  }

  vfunc_startup() {
    super.vfunc_startup();
    this.setStylesheet();
    this.setAppActions();
    this.setAppAccels();
    this.addonStorage.start();
  }

  setAppActions() {
    const quit = Gio1.SimpleAction
      .builder({ name: 'quit' })
      .activate(() => {
        this.get_windows().forEach(win => {
          win.close();
        });
      })
      .build();
    this.add_action(quit);
  }

  setAppAccels() {
    this.set_accels_for_action('app.quit', ['<Control>q']);
    this.set_accels_for_action('win.close', ['<Control>w']);
  }

  setStylesheet() {
    const provider = new Gtk.CssProvider();
    provider.load_from_resource(`${Config.config.app_rdnn}/css/style.css`);

    const defaultDisplay: Gdk.Display | null = Gdk.Display.get_default();
    if (!defaultDisplay) {
      return;
    }
    Gtk.StyleContext.add_provider_for_display(
      defaultDisplay,
      provider,
      Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION,
    );
  }

  vfunc_activate() {
    super.vfunc_activate();
    const sessionData = new SessionData({
      application: this,
    });
    const mainWindow = new Window({
      application: this,
      title: GLib.get_application_name(),
      icon_name: 'addon-box',
      session: sessionData,
    });
    new AddAddon({
      application: this,
      window: mainWindow,
      downloader: this.downloader,
    });
    mainWindow.onBind(this);
    sessionData.start();
    mainWindow.present();
  }
}
