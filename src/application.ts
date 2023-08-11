import Gtk from 'gi://Gtk';
import Gdk from 'gi://Gdk';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Adw from 'gi://Adw';

import debug_window_implement from './debug-window.js';

import {
  APP_FULLNAME,
  APP_ID,
  APP_RDNN,
  BUILD_TYPE,
  SERVER_NAME,
  VERSION,
} from './const.js';
import { g_variant_unpack, log_error } from './utils.js';
import Shortcuts from './shortcuts.js';
import Window from './window.js';
import { widget_ensure } from './gtk.js';
import { DBusMonitor, ProxyManager } from './api.js';

export default function Application() {
  const application = new Adw.Application({
    application_id: APP_ID,
  });
  GLib.set_application_name(APP_FULLNAME);

  const monitor = new DBusMonitor();
  const proxies = new ProxyManager();
  const settings = new Gio.Settings({ schema_id: APP_ID });

  debug_window_implement({
    application,
  });

  application.connect('startup', () => {
    console.info(`${APP_FULLNAME} (${APP_ID})`);
    console.info(`build-type: ${BUILD_TYPE}`);
    console.info(`version: ${VERSION}`);

    const provider = new Gtk.CssProvider();
    provider.load_from_resource(`${APP_RDNN}/css/style.css`);

    const defaultDisplay: Gdk.Display | null = Gdk.Display.get_default();
    if (!defaultDisplay) throw new Error('Could not retrieve Gdk.Display');

    Gtk.StyleContext.add_provider_for_display(
      defaultDisplay,
      provider,
      Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION,
    );

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

    const devel = new Gio.SimpleAction({ name: 'devel', parameter_type: GLib.VariantType.new('b') });
    devel.connect('activate', (_action, parameter) => {
      const active = g_variant_unpack<boolean>(parameter, 'boolean');
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
    monitor.start().catch(error => log_error(error));
    proxies.register_proxy(`${SERVER_NAME}.Injector`).catch(error => log_error(error));
  });

  const create_new_window = () => {
    widget_ensure();
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


