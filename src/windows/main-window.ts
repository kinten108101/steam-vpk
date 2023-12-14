import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import PreferencesWindow from '../ui/preferences-window.js';
import InjectButtonSet from '../ui/inject-button-set.js';
import StackController from '../actions/stack-controller.js';
import InjectConsolePresenter from '../presenters/inject-console-presenter.js';
import { ProfileBar } from '../ui/profile-bar.js';
import AboutWindow from './about.js';
import { DownloadPage } from '../ui/download-page.js';
import HeaderBox from '../ui/headerbox.js';
import ThemeSelector from '../ui/themeselector.js';
import StatusManager from '../model/status-manager.js';
import { LaunchpadPage } from '../ui/launchpad.js';
import StatusBroker from '../presenters/status-broker.js';
import AddonStorageControls from '../actions/addon-storage-controls.js';
import ArchiveActions from '../actions/archive-controls.js';
import { AddonsPanelDiskActions } from '../actions/addons-panel-actions.js';
import AddonBoxClient from '../backend/client.js';
import AddAddonAction from '../actions/add-addon.js';
import AddonDetailsActions from '../actions/addon-details.js';
import InjectorActions from '../actions/injection.js';
import { HeaderBoxActions, HeaderboxAttachControls } from '../actions/headerbox.js';
import SettingsPresenter from '../presenters/settings.js';
import SettingsActions from '../actions/settings.js';
import { StatusDebugActions } from '../actions/status-debug-actions.js';
import SettingsInjectButtonStylesPresenter from '../presenters/settings/inject-button-styles.js';
import InjectButtonSetPresenter from '../presenters/inject-button-set-presenter.js';
import UsagePresenter from '../presenters/usage-presenter.js';
import { Addonlist } from '../model/addonlist.js';
import AddonDetailsPresenter from '../presenters/addon-details-presenter.js';
import AddonDetails from '../ui/addon-details.js';
import AddonsPanelDisk from '../ui/addons-panel-disk.js';
import Repository from '../model/repository.js';
import ArchiveStore from '../model/archive-store.js';
import StaticArchiveStorePresenter from '../presenters/static-archive-store-presenter.js';
import DownloadPagePresenter from '../presenters/download-page-presenter.js';
import ProfileProxy from '../backend/profile-proxy.js';
import LaunchpadPagePresenter from '../presenters/launchpad-page-presenter.js';
import TextMarkupPresenter from '../presenters/text-markup-presenter.js';
import SettingsTextMarkupPresenter from '../presenters/settings/text-markup.js';
import NotificationModel from '../model/notification.js';
import NotificationPresenter from '../presenters/notification.js';
import AddonDetailsSelectModel from '../model/addon-details-select.js';
import ArchiveSelectModel from '../model/archive-select.js';
import SettingsDevelStylePresenter from '../presenters/settings/devel-style.js';
import AddonlistActions from '../actions/debug/addonlist.js';
import UseStorePageNavigation from '../actions/navigate-to-store-page.js';
import UseStoreDetails from '../presenters/store-details.js';
import StorePage from '../ui/store-page.js';
import Folder from '../presenters/folder.js';
import UseHeaderboxInteraction from '../presenters/headerbox-interaction.js';
import { SwipeTracker } from '../main.js';
import CustomSwipeTracker from '../ui/swipe-tracker.js';

export default class MainWindow extends Adw.ApplicationWindow {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkMainWindow',
      Properties: {
        addonlist: GObject.ParamSpec.object('addonlist', '', '',
          GObject.ParamFlags.READABLE | GObject.ParamFlags.CONSTRUCT,
          Addonlist.$gtype),
        status_manager: GObject.ParamSpec.object('status-manager', '', '',
          GObject.ParamFlags.READABLE | GObject.ParamFlags.CONSTRUCT,
          Addonlist.$gtype),
        notification_model: GObject.ParamSpec.object('notification-model', '', '',
          GObject.ParamFlags.READABLE | GObject.ParamFlags.CONSTRUCT,
          NotificationModel.$gtype),
        addon_details_select_model: GObject.ParamSpec.object('addon-details-select-model', '', '',
          GObject.ParamFlags.READABLE | GObject.ParamFlags.CONSTRUCT,
          AddonDetailsSelectModel.$gtype),
        archive_select_model: GObject.ParamSpec.object('archive-select-model', '', '',
          GObject.ParamFlags.READABLE | GObject.ParamFlags.CONSTRUCT,
          ArchiveSelectModel.$gtype),
        repository: GObject.ParamSpec.object('repository', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          Repository.$gtype),
        client: GObject.ParamSpec.object('client', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          AddonBoxClient.$gtype),
        gsettings: GObject.ParamSpec.object('gsettings', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          Gio.Settings.$gtype),
      },
      Template: `resource:///com/github/kinten108101/SteamVPK/ui/main-window.ui`,
      InternalChildren: [
        'primary_toast_overlay',
        'primary_leaflet',
        'primary_view_stack',
        'primary_menu_popover',
        'headerbar',
        'profile_bar',
        'headerbox',
        'inject_button_set',
        'download_page',
        'launchpad_page',
        'addon_details',
        'addons_panel_disk',
        'store_page',
      ],
    }, this);
  }

  _addonlist: Addonlist = new Addonlist;
  _status_manager: StatusManager = new StatusManager;
  _notification_model: NotificationModel = new NotificationModel;
  _addon_details_select_model: AddonDetailsSelectModel = new AddonDetailsSelectModel;
  _archive_select_model: ArchiveSelectModel = new ArchiveSelectModel;

  client!: AddonBoxClient;
  gsettings!: Gio.Settings;
  repository!: Repository;

  _primary_toast_overlay!: Adw.ToastOverlay;
  _primary_leaflet!: Adw.Leaflet;
  _primary_view_stack!: Adw.ViewStack;
  _primary_menu_popover!: Gtk.PopoverMenu;
  _headerbar!: Adw.HeaderBar;
  _profile_bar!: ProfileBar;
  _headerbox!: HeaderBox;
  _inject_button_set!: InjectButtonSet;
  _download_page!: DownloadPage;
  _launchpad_page!: LaunchpadPage;
  _addon_details!: AddonDetails;
  _addons_panel_disk!: AddonsPanelDisk;
  _store_page!: StorePage;

  folder: Folder = new Folder;
  swipe_tracker: SwipeTracker;

  constructor(params: {
    application: Gtk.Application;
    client: AddonBoxClient;
    gsettings: Gio.Settings;
    repository: Repository;
  }) {
    super(params as any);

    this.swipe_tracker = new CustomSwipeTracker({
      swipeable: this._headerbar,
    });

    [
      'addons-page',
      'addon-details-page',
      'addons-panel-disk-page',
      'store-page',
    ].forEach(x => {
      this.folder.add_handler(x,
        (_current, _target, target_view) => {
          this._primary_leaflet.set_visible_child_name(target_view);
          return true;
        });
    });

    this.folder.set_visible_child_name('addons-page');

    Object.values(AddonlistActions({
      store: this._addonlist,
    })).forEach(x => {
      this.add_action(x);
    });

    const [present] = UseStoreDetails({
      store_page: this._store_page,
    });
    Object.values(UseStorePageNavigation({
      present,
      model: this.repository,
      navigate: (id: string) => {
        this.folder.set_visible_child_name(`store-page/${id}`);
      },
    })).forEach(x => {
      this.add_action(x);
    });

    UseHeaderboxInteraction({
      toggleable: this._profile_bar.primary_button,
      swipe_tracker: this.swipe_tracker,
      headerbox: this._headerbox,
    });

    this._setup_style();
    this._setup_group();
    this._setup_notification();
    this._setup_themeselector();
    this._setup_winsize();
    this._setup_connection_monitor();
    this._setup_actions();
    this._setup_injection();
    this._setup_addon_details();
    this._setup_headerbox();
    this._setup_addons_panel();
    this._setup_addon_interaction();
  }

  get addonlist() {
    return this._addonlist;
  }

  get status_manager() {
    return this._status_manager;
  }

  get notification_model() {
    return this._notification_model;
  }

  get addon_details_select_model() {
    return this._addon_details_select_model;
  }

  get archive_select_model() {
    return this._archive_select_model;
  }

  _update_style() {
    const val = this.gsettings.get_boolean('enable-devel-style');
    const buildtype = globalThis.config.buildtype;
    if (val && (buildtype === 'debug' || buildtype === 'debugoptimized'))
      this.add_css_class('devel');
    else
      this.remove_css_class('devel');
  }

  _setup_style() {
    this.gsettings.connect('changed::enable-devel-style', this._update_style.bind(this));
    this._update_style();
  }

  _setup_group() {
    const window_group = new Gtk.WindowGroup();
    window_group.add_window(this);
  }

  _setup_themeselector() {
    const themeselector = new ThemeSelector();
    this._primary_menu_popover.add_child(themeselector, 'themeselector');
  }

  _setup_winsize() {
    try {
      if (this.gsettings.get_boolean('remember-winsize')) {
        const val: [number, number, boolean] = this.gsettings.get_value('window-size').recursiveUnpack();
        this.set_default_size(val[0], val[1]);
        if (val[2] === true) this.maximize();
      }
    } catch (error) {
      logError(error);
    }
  }

  _setup_connection_monitor() {
    let connect_error: string;
    const update_connected_status = (connected: boolean) => {
      if (!connected) {
        // unavailable
        connect_error = this._status_manager.add_error({
          short: 'Disconnected',
          msg: 'Could not connect to daemon. Make sure that you\'ve installed Add-on Box.',
        });
      } else {
        // available
        this._status_manager.clear_status(connect_error);
      }
    }
    update_connected_status(this.client.connected);
    this.client.connect('notify::connected', (_obj) => {
      update_connected_status(this.client.connected);
    });
  }

  _setup_actions() {
    const group = new Gio.SimpleActionGroup();
    Object.values(SettingsActions({
      parent_window: this,
      main_window: this,
      settings: this.gsettings,
      client: this.client,
      notification_model: this._notification_model,
    })).forEach(x => {
      group.add_action(x);
    });

    const showPreferences = new Gio.SimpleAction({
      name: 'show-preferences',
    });
    showPreferences.connect('activate', () => {
      const prefWin = new PreferencesWindow();
      prefWin.insert_actions(group);
      SettingsPresenter({
        preferences_window: prefWin,
        client: this.client,
        gsettings: this.gsettings,
      });
      SettingsInjectButtonStylesPresenter({
        inject_button_styles: prefWin.inject_button_styles,
        gsettings: this.gsettings,
      });
      SettingsTextMarkupPresenter({
        enable_text_markup: prefWin.enable_text_markup,
        gsettings: this.gsettings,
      });
      SettingsDevelStylePresenter({
        enable_switch: prefWin.enable_devel_style,
        gsettings: this.gsettings,
      });
      prefWin.present();
    });
    this.add_action(showPreferences);

    const reloadAddons = new Gio.SimpleAction({
      name: 'reload-addons',
    });
    reloadAddons.connect('activate', () => {
      (async () => {
        await this.client.services.addons.call('ForceUpdate');
      })().catch(error => logError(error));
    });
    this.add_action(reloadAddons);

    const showAbout = new Gio.SimpleAction({ name: 'show-about' });
    showAbout.connect('activate', () => {
      AboutWindow({
        gsettings: this.gsettings,
        parent_window: this,
      }).present();
    });
    this.add_action(showAbout);

    const back = new Gio.SimpleAction({ name: 'back' });
    back.connect('activate', () => {
      this.folder.navigate_backward();
    });
    this.add_action(back);

    const forward = new Gio.SimpleAction({ name: 'forward' });
    forward.connect('activate', () => {
      this.folder.navigate_forward();
    });
    this.add_action(forward);

    StackController({
      stack: this._primary_view_stack,
      action_map: this,
    });
  }

  _setup_addon_interaction() {
    AddAddonAction({
      parent_window: this,
      action_map: this,
      client: this.client,
    });
    ArchiveActions({
      action_map: this,
    });
    AddonStorageControls({
      action_map: this,
      parent_window: this,
      client: this.client,
    });
    DownloadPagePresenter({
      download_page: this._download_page,
      local_addons: this.repository.local_addons,
      remote_addons: this.repository.remote_addons,
    });
    LaunchpadPagePresenter({
      boxed_list: this._launchpad_page.addonlist_box,
      loadorder_model: this.addonlist.sort_model,
      launchpad_page: this._launchpad_page,
    });
    TextMarkupPresenter({
      gsettings: this.gsettings,
      launchpad_page: this._launchpad_page,
      download_page: this._download_page,
    });
    ProfileProxy({
      model: this._addonlist,
      client: this.client,
    });
    this._launchpad_page.loadorder = this._addonlist.sort_model;
  }

  _setup_addons_panel() {
    AddonsPanelDiskActions({
      action_map: this,
      on_navigate: () => {
        this.folder.set_visible_child_name('addons-panel-disk-page');
      },
    });
    UsagePresenter({
      client: this.client,
      addons_panel: this._download_page.panel,
      addons_panel_disk: this._addons_panel_disk,
    });
  }

  _setup_headerbox() {
    const [, headerbox_box_switch ] = Object.values(HeaderBoxActions({
      headerbox: this._headerbox,
    })).map(x => {
        this.add_action(x);
        return x;
    });

    // Initialize default page
    headerbox_box_switch?.activate(GLib.Variant.new_string('status_box'));

    Object.values(HeaderboxAttachControls({
      detachable: this._headerbox.detachable,
    })).forEach(x => {
        this.add_action(x);
    });

    StatusDebugActions({
      action_map: this,
      status_manager: this._status_manager,
    });
    StatusBroker({
      status_manager: this._status_manager,
      headerbox: this._headerbox,
      profile_bar: this._profile_bar,
    }).init_headerbox();
  }

  _setup_injection() {
    const { run, done, cancel } = InjectorActions({
      action_map: this,
      client: this.client,
      gsettings: this.gsettings,
    }).get_actions();
    InjectButtonSetPresenter({
      inject_button_set: this._inject_button_set,
      gsettings: this.gsettings,
    });
    InjectConsolePresenter({
      inject_console: this._headerbox.console_box,
      headerbox: this._headerbox,
      inject_button_set: this._inject_button_set,
      inject_actions: [
        run, done, cancel,
      ],
      client: this.client,
      status_manager: this._status_manager,
      gsettings: this.gsettings,
    }).init();
  }

  _setup_addon_details() {
    const archive_store = new ArchiveStore();
    StaticArchiveStorePresenter({
      select_model: this._archive_select_model,
      archive_store,
    });
    AddonDetailsPresenter({
      archive_model: archive_store,
      page: this._addon_details,
      page_model: this._addon_details_select_model,
      client: this.client,
    });
    AddonDetailsActions({
      toaster: this._primary_toast_overlay,
      action_map: this,
      parent_window: this,
      repository: this.repository,
      on_navigate: (id: string) => {
        this.folder.set_visible_child_name(`addon-details-page/${id}`);
      },
      addon_details_select_model: this._addon_details_select_model,
      archive_select_model: this._archive_select_model,
    });
  }

  _setup_notification() {
    NotificationPresenter({
      toast_overlay: this._primary_toast_overlay,
      model: this._notification_model,
    });
  }
}
