import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import PreferencesWindow, { SettingsActions } from './preferences-window.js';
import InjectButtonSet from './ui/inject-button-set.js';

import {
  APP_RDNN,
  SERVER_NAME,
} from './const.js';
import { AddonsPanelDiskPage } from './ui/addons-panel.js';
import StackController from './stack-controller.js';
import TypedBuilder from './typed-builder.js';
import InjectConsolePresenter, { InjectorActions } from './inject-console-presenter.js';
import { BackendPortal, DBusMonitor, ProxyManager } from './api.js';
import { ProfileBar } from './ui/profile-bar.js';
import AboutWindow from './about.js';
import DownloadPagePresent from './download-page-present.js';
import { DownloadPage } from './download-page.js';
import AddonDetailsLeafletPage from './addon-details-leaflet-page.js';
import HeaderBox, { HeaderBoxActions, HeaderboxBuild, HeaderboxConsole } from './ui/headerbox.js';
import ThemeSelector from './ui/themeselector.js';
import StatusManager, { StatusActions } from './model/status-manager.js';
import LaunchpadPresent from './launchpad-present.js';
import { LaunchpadPage } from './launchpad.js';
import AddonDetailsActions, { AddonDetailsUpdate } from './addon-details-update.js';
import StatusBroker from './status-broker.js';
import AddonStorageControls from './addon-storage-controls.js';
import { FieldRow } from './ui/field-row.js';
import ArchiveActions from './archive-controls.js';
import { AddonsPanelDiskActions } from './addons-panel-actions.js';

GObject.type_ensure(LaunchpadPage.$gtype);
GObject.type_ensure(DownloadPage.$gtype);
GObject.type_ensure(ProfileBar.$gtype);
GObject.type_ensure(InjectButtonSet.$gtype);
GObject.type_ensure(FieldRow.$gtype);
GObject.type_ensure(HeaderBox.$gtype);
GObject.type_ensure(HeaderboxConsole.$gtype);
GObject.type_ensure(HeaderboxBuild.$gtype);

export default function Window(
{ application,
  monitor,
  proxies,
  settings,
}:
{ application: Gtk.Application;
  monitor: DBusMonitor;
  proxies: ProxyManager;
  settings: Gio.Settings,
}) {
  monitor;
  const builder = new TypedBuilder();
  builder.add_from_resource(`${APP_RDNN}/ui/window.ui`);
  const window = builder.get_typed_object<Adw.ApplicationWindow>('window');
  window.set_application(application);
  if (settings.get_boolean('remember-winsize')) {
    window.set_default_size(
      settings.get_int('default-width'),
      settings.get_int('default-height'),
    );
  }
  const window_group = new Gtk.WindowGroup();
  window_group.add_window(window);

  const action_map = window;
  const parent_window = window;
  const toaster = builder
    .get_typed_object<Adw.ToastOverlay>('toastOverlay');
  const win_view_stack = builder
    .get_typed_object<Adw.ViewStack>('win-view-stack');
  const leaflet = builder
    .get_typed_object<Adw.Leaflet>('leaflet');
  const inject_button_set = builder
    .get_typed_object<InjectButtonSet>('inject-button-set');
  const profile_bar = builder
    .get_typed_object<ProfileBar>('profileBar');
  const launchpad_page = builder
    .get_typed_object<LaunchpadPage>('launchpadPage');
  const download_page = builder
    .get_typed_object<DownloadPage>('downloadPage');
  const headerbox = builder
    .get_typed_object<HeaderBox>('headerbox');

  const main_menu = builder.get_typed_object<Gtk.PopoverMenu>('main_menu');
  main_menu.add_child(new ThemeSelector(), 'themeselector');

  const status_manager = new StatusManager();

  StackController({
    stack: win_view_stack,
    action_map,
    application,
  });

  DownloadPagePresent({
    model: download_page.addons,
  });

  LaunchpadPresent({
    model: launchpad_page.loadorder,
  });

  AddonsPanelDiskPage({
    leaflet,
  });

  WindowActions({
    action_map,
    leaflet,
    parent_window,
    main_window: window,
    settings,
  });

  const addon_details_builder = AddonDetailsLeafletPage({
    leaflet_page_entry: leaflet.get_child_by_name('addon-details-page') as Adw.Bin,
  });
  const addon_details_present = AddonDetailsUpdate({
    toaster,
    builder_cont: addon_details_builder,
    action_map,
    leaflet,
    leaflet_page: 'addon-details-page',
  });
  AddonDetailsActions({
    toaster,
    action_map,
    parent_window,
    present_details: addon_details_present,
  });
  const seeDetails = new Gio.SimpleAction({
    name: 'addon-details.see-details',
    parameter_type: GLib.VariantType.new('s'),
  });
  seeDetails.connect('activate', (_action, parameter) => {
    (async () => {
      if (parameter === null) throw new Error;
      const [id] = parameter.get_string();
      if (id === null) throw new Error;
      await addon_details_present(id);
    })().catch(error => logError(error));
  });
  action_map.add_action(seeDetails);
  AddonStorageControls({
    action_map,
    parent_window,
  });

  AddonsPanelDiskActions({
    leaflet,
    action_map,
  });

  ArchiveActions({
    action_map,
  });

  let connect_error: string;
  monitor.connect(DBusMonitor.Signals.connected, (_obj, connected) => {
    (async () => {
      if (!connected) {
        // unavailable
        connect_error = status_manager.add_error({
          short: 'Disconnected',
          msg: 'Could not connect to daemon. Make sure that you\'ve installed Add-on Box.',
        });
      } else {
        // available
        status_manager.clear_status(connect_error);
      }
    })().catch(error => logError(error));
  });
  InjectorActions({
    action_map,
    proxy: proxies.get_proxy(`${SERVER_NAME}.Injector`),
  });
  InjectConsolePresenter({
    inject_console: headerbox.console_box,
    headerbox,
    inject_button_set,
    proxy: proxies.get_proxy(`${SERVER_NAME}.Injector`),
    monitor,
    status_manager,
  }).init();
  HeaderBoxActions({
    action_map,
    headerbox,
    parent_window,
  }).init_headerbox();
  StatusBroker({
    status_manager,
    headerbox,
    profile_bar,
  }).init_headerbox();
  StatusActions({
    action_map,
    status_manager,
  });

  return window;
}

function WindowActions(
{ action_map,
  leaflet,
  parent_window,
  main_window,
  settings,
}:
{ action_map: Gio.ActionMap;
  leaflet: Adw.Leaflet;
  parent_window: Gtk.Window;
  main_window: Gtk.ApplicationWindow;
  settings: Gio.Settings;
}) {
  const group = new Gio.SimpleActionGroup();
  SettingsActions({
    parent_window,
    main_window,
    settings,
  }).export2actionMap(group);

  const showPreferences = new Gio.SimpleAction({
    name: 'show-preferences',
  });
  showPreferences.connect('activate', () => {
    const prefWin = PreferencesWindow()
      .bind({
        parent_window,
        gsettings: settings,
      })
      .insert_action_group(group)
      .build();
    prefWin.present();
  });
  action_map.add_action(showPreferences);

  const addons_service = BackendPortal({
    interface_name: 'com.github.kinten108101.SteamVPK.Server.Addons',
  });

  const reloadAddons = new Gio.SimpleAction({
    name: 'reload-addons',
  });
  reloadAddons.connect('activate', () => {
    (async () => {
      await addons_service.call_async('ForceUpdate');
    })().catch(error => logError(error));
  });
  action_map.add_action(reloadAddons);

  const showAbout = new Gio.SimpleAction({ name: 'show-about' });
  showAbout.connect('activate', () => {
    AboutWindow({
      parent_window,
    }).present();
  });
  action_map.add_action(showAbout);

  let back_from: string | null = null;

  const back = new Gio.SimpleAction({ name: 'back' });
  back.connect('activate', () => {
    const _back_from = leaflet.get_visible_child_name();
    if (_back_from === 'addons-page') return;
    leaflet.set_visible_child_name('addons-page');
    back_from = _back_from;
  });
  action_map.add_action(back);

  const forward = new Gio.SimpleAction({ name: 'forward' });
  forward.connect('activate', () => {
    if (back_from === null) return;
    leaflet.set_visible_child_name(back_from);
  });
  action_map.add_action(forward);
}
