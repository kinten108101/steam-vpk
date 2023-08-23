import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import PreferencesWindow from './preferences-window.js';
import DownloadWindow from './download-window.js';
import InjectButtonSet from './inject-button-set.js';

import {
  APP_RDNN,
  SERVER_NAME,
} from './const.js';
import ArchiveActions from './actions/archive-controls.js';
import {
  AddonsPanelDiskActions,
  DiskModal,
} from './actions/addons-panel-actions.js';
import AddonsPanelDiskAllocateModal from './dialogs/allocate.js';
import { AddonsPanelDiskPage } from './addons-panel.js';
import profile_window_implement from './profile-window.js';
import { DownloadWindowActions } from './download-window.js';
import AddonStorageActions from './actions/addon-storage-controls.js';
import StackController from './stack-controller.js';
import TypedBuilder from './typed-builder.js';
import InjectConsolePresenter from './inject-console-presenter.js';
import { BackendPortal, DBusMonitor, ProxyManager } from './api.js';
import InjectorActions from './actions/injector-actions.js';
import { SettingsActions } from './actions/settings-actions.js';
import { ProfileBar } from './profile-bar.js';
import AboutWindow from './about.js';
import DownloadPagePresent from './download-page-present.js';
import { DownloadPage } from './download-page.js';
import { promise_wrap } from './steam-vpk-utils/utils.js';
import AddonDetailsLeafletPage from './addon-details-leaflet-page.js';
import { AddonDetailsPagePresenter } from './addon-details-present.js';
import AddonDetailsActions from './actions/addon-details.js';
import HeaderBox, { HeaderBoxActions } from './headerbox.js';
import ThemeSelector from './themeselector.js';
import StatusPresent from './status-present.js';
import StatusManager, { StatusActions } from './status.js';

export default function Window(
{ application,
  monitor,
  proxies,
  status_manager,
}:
{ application: Gtk.Application;
  monitor: DBusMonitor;
  proxies: ProxyManager;
  status_manager: StatusManager;
}) {
  monitor;
  const builder = new TypedBuilder();
  builder.add_from_resource(`${APP_RDNN}/ui/window.ui`);
  const window = builder.get_typed_object<Adw.ApplicationWindow>('window');
  window.set_application(application);
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
  const download_page = builder
    .get_typed_object<DownloadPage>('downloadPage');
  const headerbox = builder
    .get_typed_object<HeaderBox>('headerbox');

  const main_menu = builder.get_typed_object<Gtk.PopoverMenu>('main_menu');
  main_menu.add_child(new ThemeSelector(), 'themeselector');

  StackController({
    stack: win_view_stack,
    action_map,
    application,
  });

  DownloadPagePresent({
    model: download_page.addons,
  })

  AddonsPanelDiskPage({
    leaflet,
  });

  WindowActions({
    action_map,
    leaflet,
    parent_window,
  });

  const addon_details_builder = AddonDetailsLeafletPage({
    leaflet_page_entry: leaflet.get_child_by_name('addon-details-page') as Adw.Bin,
  });
  const addon_details_present = AddonDetailsPagePresenter({
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
  AddonStorageActions({
    action_map,
    parent_window,
  });

  DownloadWindowActions({
    application,
    window_group: window.get_group(),
    action_map,
    DownloadWindow:
      DownloadWindow.bind(null, {}),
  });

  profile_window_implement({
    main_window: window,
  });

  AddonsPanelDiskActions({
    leaflet,
    action_map,
    Modal: (function() {
            const { present, close } = AddonsPanelDiskAllocateModal();
            return { present, close };
          }) as unknown as { new(): DiskModal },
  });

  ArchiveActions({
    action_map,
  });

  let connect_error: string;
  monitor.connect(DBusMonitor.Signals.connected, (_obj, connected) => {
    promise_wrap(async () => {
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
    });
  });
  InjectorActions({
    proxy: proxies.get_proxy(`${SERVER_NAME}.Injector`),
  }).export2actionMap(action_map);
  InjectConsolePresenter({
    inject_console: headerbox.console_box,
    headerbox,
    inject_button_set,
    proxy: proxies.get_proxy(`${SERVER_NAME}.Injector`),
    monitor,
  }).init();
  HeaderBoxActions({
    action_map,
    headerbox,
    parent_window,
  }).init_headerbox();
  StatusPresent({
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
  settings,
}:
{ action_map: Gio.ActionMap;
  leaflet: Adw.Leaflet;
  parent_window: Gtk.Window;
  settings?: Gio.Settings;
}) {
  const group = new Gio.SimpleActionGroup();
  SettingsActions({
    action_map: group,
    parent_window,
    settings,
  })
  const showPreferences = new Gio.SimpleAction({
    name: 'show-preferences',
  });
  showPreferences.connect('activate', () => {
    const prefWin = PreferencesWindow()
      .bind({
        parent_window,
        settings,
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
  reloadAddons.connect('activate', () => promise_wrap(async () => {
    await addons_service.call_async('ForceUpdate');
  }));
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
