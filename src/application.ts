import Gtk from 'gi://Gtk';
import Gdk from 'gi://Gdk';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Adw from 'gi://Adw';
import * as Gio1 from './utils/gio1.js';
import * as File from './file.js';
import * as Consts from './const.js'
import Downloader from './downloader.js';
import { AddonStorage } from './addon-storage.js';
import { ActionSynthesizer } from './addon-action.js';
import Window from './window.js';
import DiskCapacity from './disk-capacity.js';

export type Stvpk = {
  pkg_user_data_dir: Gio.File;
  pkg_user_state_dir: Gio.File;
  addons_dir: Gio.File;
  addonStorage: AddonStorage;
  addonSynthesizer: ActionSynthesizer;
  downloader: Downloader;
  settings: Gio.Settings;
  diskCapacity: DiskCapacity;
}

export default function application_implement() {
  const application = new Adw.Application({
    application_id: Consts.APP_ID,
  });
  GLib.set_application_name(Consts.APP_FULLNAME);
  application.add_main_option('new-window', 'n'.charCodeAt(0), GLib.OptionFlags.NONE, GLib.OptionArg.NONE, 'Open a new window', null);
  application.add_main_option('version', 'v'.charCodeAt(0), GLib.OptionFlags.NONE, GLib.OptionArg.NONE, 'Print current product version', null);

  const pkg_user_data_dir = Gio.File.new_for_path(
    GLib.build_filenamev([Consts.USER_DATA_DIR, Consts.APP_SHORTNAME]),
  );
  const pkg_user_state_dir = Gio.File.new_for_path(
    GLib.build_filenamev([Consts.USER_STATE_DIR, Consts.APP_SHORTNAME]),
  );
  const addons_dir = pkg_user_data_dir.get_child(Consts.ADDON_DIR);

  const settings = new Gio.Settings({ schema_id: Consts.APP_ID });
  const downloader = new Downloader({ download_dir: pkg_user_state_dir.get_child(Consts.DOWNLOAD_DIR) });
  const addonStorage = new AddonStorage({ subdir_folder: addons_dir, pkg_user_state_dir });
  const addonSynthesizer = new ActionSynthesizer({
    storage: addonStorage,
    index: addonStorage.indexer,
  });
  const diskCapacity = new DiskCapacity();

  application.connect('startup', () => {
    console.info(`${Consts.APP_FULLNAME} (${Consts.APP_ID})`);
    console.info(`build-type: ${Consts.BUILD_TYPE}`);
    console.info(`version: ${Consts.VERSION}`);

    const provider = new Gtk.CssProvider();
    provider.load_from_resource(`${Consts.APP_RDNN}/css/style.css`);

    const defaultDisplay: Gdk.Display | null = Gdk.Display.get_default();
    if (!defaultDisplay) {
      return;
    }
    Gtk.StyleContext.add_provider_for_display(
      defaultDisplay,
      provider,
      Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION,
    );

    const quit = Gio1.SimpleAction
      .builder({ name: 'quit' })
      .activate(() => {
        application.get_windows().forEach(win => {
          win.close();
        });
      })
      .build();
    application.add_action(quit);
    application.set_accels_for_action('app.quit', ['<Control>q']);

    const new_window = new Gio.SimpleAction({ name: 'new-window' });
    new_window.connect('activate', create_new_window);
    application.add_action(new_window);
    application.set_accels_for_action('app.new-window', ['<Control>n']);

    application.set_accels_for_action('win.close', ['<Control>w']);

    try {
      File.make_dir_nonstrict(pkg_user_data_dir);
      console.info(`pkg-user-data-dir: ${pkg_user_data_dir.get_path()}`);
    } catch (error) {
      logError(error);
      console.error('Quitting...');
      return;
    }

    try {
      File.make_dir_nonstrict(pkg_user_state_dir);
      console.info(`pkg-user-state-dir: ${pkg_user_data_dir.get_path()}`);
    } catch (error) {
      logError(error)
      console.error('Quitting...');
      return;
    }

    downloader.start();
    addonStorage.start();
    addonSynthesizer.start();
  });

  const create_new_window = () => {
    const mainWindow = new Window({
      application,
      title: GLib.get_application_name(),
      stvpk: {
        pkg_user_data_dir,
        pkg_user_state_dir,
        addons_dir,
        addonStorage,
        addonSynthesizer,
        downloader,
        settings,
        diskCapacity,
      },
    });
    new Gtk.WindowGroup()
      .add_window(mainWindow);
    mainWindow.start();
    mainWindow.present();
  };

  application.connect('handle-local-options', (_application, options: GLib.VariantDict): number => {
    const new_window = options.lookup_value('new-window', GLib.VariantType.new('b'));
    if (new_window !== null) {
      console.log('New Window:', new_window.deepUnpack());
      create_new_window();
      return -1;
    }
    if (options.contains('version')) {
      print(`version ${Consts.VERSION}`);
      return 0;
    }
    return -1;
  });

  application.connect('activate', () => {
    create_new_window();
  });

  return application;
}
