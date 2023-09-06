import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import PreferencesWindow from '../ui/preferences-window.js';
import InjectButtonSet from '../ui/inject-button-set.js';

import {
  APP_RDNN,
} from '../utils/const.js';
import AddonsPanel, { AddonsPanelDiskPage } from '../ui/addons-panel.js';
import StackController from '../actions/stack-controller.js';
import TypedBuilder from '../utils/typed-builder.js';
import InjectConsolePresenter from '../presenters/inject-console-presenter.js';
import { ProfileBar } from '../ui/profile-bar.js';
import AboutWindow from './about.js';
import DownloadPagePresent from '../presenters/download-page-present.js';
import { DownloadPage } from '../ui/download-page.js';
import AddonDetailsLeafletPage from '../ui/addon-details-leaflet-page.js';
import HeaderBox, { HeaderboxBuild, HeaderboxConsole } from '../ui/headerbox.js';
import ThemeSelector from '../ui/themeselector.js';
import StatusManager from '../model/status-manager.js';
import LaunchpadPresent from '../presenters/launchpad-present.js';
import { LaunchpadPage } from '../ui/launchpad.js';
import AddonDetailsUpdate from '../presenters/addon-details-update.js';
import StatusBroker from '../presenters/status-broker.js';
import AddonStorageControls from '../actions/addon-storage-controls.js';
import { FieldRow } from '../ui/field-row.js';
import ArchiveActions from '../actions/archive-controls.js';
import { AddonsPanelDiskActions } from '../actions/addons-panel-actions.js';
import AddonBoxClient from '../backend/client.js';
import AddAddonUrl, { InputUrl, PreviewDownload } from '../dialogs/add-addon-url.js';
import AddAddonName from '../dialogs/add-addon-name.js';
import AddAddonAction from '../actions/add-addon.js';
import SpinningButton from '../ui/spinning-button.js';
import AddonDetailsActions from '../actions/addon-details.js';
import InjectorActions from '../actions/injection.js';
import HeaderBoxActions, { HeaderboxAttachControls } from '../actions/headerbox.js';
import HeaderboxDetachable from './headerbox-detachable.js';
import SettingsPresenter from '../presenters/settings.js';
import SettingsActions from '../actions/settings.js';
import { StatusDebugActions } from '../actions/status-debug-actions.js';
import SettingsInjectButtonStylesPresenter from '../presenters/settings/inject-button-styles.js';
import InjectButtonSetRestore from '../presenters/inject-button-set-restore.js';

GObject.type_ensure(AddonsPanel.$gtype);
GObject.type_ensure(LaunchpadPage.$gtype);
GObject.type_ensure(DownloadPage.$gtype);
GObject.type_ensure(ProfileBar.$gtype);
GObject.type_ensure(InjectButtonSet.$gtype);
GObject.type_ensure(FieldRow.$gtype);
GObject.type_ensure(HeaderboxDetachable.$gtype);
GObject.type_ensure(HeaderBox.$gtype);
GObject.type_ensure(HeaderboxConsole.$gtype);
GObject.type_ensure(HeaderboxBuild.$gtype);
GObject.type_ensure(SpinningButton.$gtype);
GObject.type_ensure(InputUrl.$gtype);
GObject.type_ensure(PreviewDownload.$gtype);
GObject.type_ensure(AddAddonUrl.$gtype);
GObject.type_ensure(AddAddonName.$gtype);

export default function MainWindow(
{ application,
  client,
  settings,
}:
{ application: Gtk.Application;
  client: AddonBoxClient;
  settings: Gio.Settings,
}) {
  const builder = new TypedBuilder();
  builder.add_from_resource(`${APP_RDNN}/ui/window.ui`);
  const window = builder.get_typed_object<Adw.ApplicationWindow>('window');
  window.set_application(application);
  try {
    if (settings.get_boolean('remember-winsize')) {
      const val: [number, number, boolean] = settings.get_value('window-size').recursiveUnpack();
      window.set_default_size(val[0], val[1]);
      if (val[2] === true) window.maximize();
    }
  } catch (error) {
    logError(error);
  }
  client.services.injector.call
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
  InjectButtonSetRestore({
    inject_button_set,
    gsettings: settings,
  });

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
    client,
  });

  LaunchpadPresent({
    model: launchpad_page.loadorder,
    client,
  });

  AddonsPanelDiskPage({
    leaflet,
  });

  const group = new Gio.SimpleActionGroup();
  SettingsActions({
    parent_window,
    main_window: window,
    settings,
    client,
  }).export2actionMap(group);

  const showPreferences = new Gio.SimpleAction({
    name: 'show-preferences',
  });
  showPreferences.connect('activate', () => {
    const prefWin = new PreferencesWindow();
    prefWin.insert_actions(group);
    SettingsPresenter({
      preferences_window: prefWin,
      client,
      gsettings: settings,
    });
    SettingsInjectButtonStylesPresenter({
      inject_button_styles: prefWin.inject_button_styles,
      gsettings: settings,
    })

    prefWin.set_transient_for(parent_window);
    prefWin.present();
  });
  action_map.add_action(showPreferences);

  const reloadAddons = new Gio.SimpleAction({
    name: 'reload-addons',
  });
  reloadAddons.connect('activate', () => {
    (async () => {
      await client.services.addons.call('ForceUpdate');
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

  const addon_details_builder = AddonDetailsLeafletPage({
    leaflet_page_entry: leaflet.get_child_by_name('addon-details-page') as Adw.Bin,
  });
  const addon_details_present = AddonDetailsUpdate({
    toaster,
    builder_cont: addon_details_builder,
    action_map,
    leaflet,
    leaflet_page: 'addon-details-page',
    client,
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
    client,
  });

  AddonsPanelDiskActions({
    leaflet,
    action_map,
  });

  ArchiveActions({
    action_map,
  });

  let connect_error: string;
  function update_connected_status(connected: boolean) {
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
  }
  update_connected_status(client.connected);
  client.connect('notify::connected', (_obj) => {
    update_connected_status(client.connected);
  });
  InjectorActions({
    action_map,
    client,
  });
  InjectConsolePresenter({
    inject_console: headerbox.console_box,
    headerbox,
    inject_button_set,
    client,
    status_manager,
  }).init();
  HeaderBoxActions({
    action_map,
    headerbox,
  }).init_headerbox();
  HeaderboxAttachControls({
    action_map,
    detachable: headerbox.detachable,
  })
  StatusBroker({
    status_manager,
    headerbox,
    profile_bar,
  }).init_headerbox();
  StatusDebugActions({
    action_map,
    status_manager,
  });

  AddAddonAction({
    parent_window,
    action_map,
    client,
  });

  return window;
}
