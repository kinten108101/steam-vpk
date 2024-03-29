import Gtk from 'gi://Gtk';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Adw from 'gi://Adw';

import Shortcuts from './actions/shortcuts.js';
import MainWindow from './windows/main-window.js';
import { ListenPortalResponses } from './steam-vpk-utils/portals.js';
import AddonBoxClient from './backend/client.js';
import Repository from './model/repository.js';
import AddonsProxy from './backend/addons-proxy.js';
import RepositoryActions from './actions/debug/repository.js';

/**
 * @type {Gtk.Application | undefined}
 */
let application;

/** @returns {Gtk.Application} */
export function getApplication() {
  if (application === undefined) {
    application = Application();
  }
  return application;
}

export default function Application() {
  const application = new Adw.Application({
    application_id: 'com.github.kinten108101.SteamVPK',
  });
  const buildtype = globalThis.config.buildtype;
  if (buildtype === 'debug')
    GLib.log_set_debug_enabled(true);

  GLib.set_application_name('Steam VPK');

  const client = new AddonBoxClient();
  const settings = new Gio.Settings({
    schema_id: 'com.github.kinten108101.SteamVPK',
  });
  const repository = new Repository();
  AddonsProxy({
    model: repository,
    client,
  });
  Object.values(RepositoryActions({
    store: repository,
  })).forEach(x => {
    application.add_action(x);
  });

  application.connect('notify::is-registered', () => {
    if (application.is_registered) {
      const connection = application.get_dbus_connection();
      if (connection === null)
        throw new Error;
      ListenPortalResponses({
        connection,
      }).start();
    }
  });

  application.connect('startup', () => {
    Shortcuts({
      application,
    });

    const quit = new Gio.SimpleAction({ name: 'quit' });
    quit.connect('activate', () => {
      application.get_windows().forEach(win => {
        win.close();
      });
    });
    application.add_action(quit);

    const new_window = new Gio.SimpleAction({ name: 'new-window' });
    new_window.connect('activate', create_new_window);
    application.add_action(new_window);

    const devel = new Gio.SimpleAction({
      name: 'devel',
      parameter_type: GLib.VariantType.new('b'),
    });
    devel.connect('activate', (_action, parameter) => {
      if (parameter === null)
        throw new Error;
      const active = parameter.get_boolean();
      if (active === true) {
        application.get_windows().forEach(x => {
          if (x instanceof Gtk.ApplicationWindow)
            x.add_css_class('devel');
        });
      }
      else {
        application.get_windows().forEach(x => {
          if (x instanceof Gtk.ApplicationWindow)
            x.remove_css_class('devel');
        });
      }
    });
    application.add_action(devel);

    application.add_action(settings.create_action('color-scheme'));
    const style_manager = Adw.StyleManager.get_default();
    const update_theme = () => {
      style_manager.set_color_scheme(settings.get_int('color-scheme'));
    };
    settings.connect('changed::color-scheme', update_theme);
    update_theme();

    client.start().catch(error => logError(error));
  });

  const create_new_window = () => {
    const mainWindow = new MainWindow({
      application,
      client,
      gsettings: settings,
      repository,
    });
    mainWindow.present();
  };

  application.connect('activate', () => {
    create_new_window();
  });

  return application;
}
