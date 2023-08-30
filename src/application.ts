import Gtk from 'gi://Gtk';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Adw from 'gi://Adw';

import {
  APP_FULLNAME,
  APP_ID,
  BUILD_TYPE,
  SERVER_NAME,
  SERVER_PATH,
  VERSION,
} from './const.js';
import Shortcuts from './shortcuts.js';
import Window from './window.js';
import { DBusMonitor, ProxyManager } from './api.js';
import { ListenPortalResponses } from './steam-vpk-utils/portals.js';
import DebugWindow from './debug-window.js';

export default function Application() {
  const application = new Adw.Application({
    application_id: APP_ID,
  });
  GLib.set_application_name(APP_FULLNAME);

  const monitor = new DBusMonitor();
  const proxies = new ProxyManager();
  const settings = new Gio.Settings({
    schema_id: APP_ID,
  });

  application.connect('notify::is-registered', () => {
    if (application.is_registered) {
      const connection = application.get_dbus_connection();
      if (connection === null) throw new Error
      ListenPortalResponses({
        connection,
      }).start();
    }
  });

  application.connect('startup', () => {
    console.info(`${APP_FULLNAME} (${APP_ID})`);
    console.info(`build-type: ${BUILD_TYPE}`);
    console.info(`version: ${VERSION}`);

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
      if (parameter === null) throw new Error;
      const active = parameter.get_boolean();
      if (active === true) {
        application.get_windows().forEach(x => {
          if (x instanceof Gtk.ApplicationWindow) x.add_css_class('devel');
        });
      } else {
        application.get_windows().forEach(x => {
          if (x instanceof Gtk.ApplicationWindow) x.remove_css_class('devel');
        });
      }
    });
    application.add_action(devel);

    application.add_action(settings.create_action('color-scheme'));
    const style_manager = Adw.StyleManager.get_default();
    const update_theme = () => {
      style_manager.set_color_scheme(settings.get_int('color-scheme') as Adw.ColorScheme);
    };
    settings.connect('changed::color-scheme', update_theme);
    update_theme();

    DebugWindow({
      application,
    });

    monitor.start().catch(error => logError(error));
    proxies.register_proxy(
      `${SERVER_PATH}/injector`,
      `${SERVER_NAME}.Injector`,
    ).catch(error => logError(error));
  });

  const create_new_window = () => {
    const mainWindow = Window({
      application,
      monitor,
      proxies,
      settings,
    });
    mainWindow.present();
  };

  application.connect('activate', () => {
    create_new_window();
  });

  return application;
}


