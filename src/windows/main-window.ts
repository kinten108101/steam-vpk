import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import PreferencesWindow from '../ui/preferences-window.js';
import InjectButtonSet from '../ui/inject-button-set.js';

import AddonsPanel, { UsageMeter } from '../ui/addons-panel.js';
import StackController from '../actions/stack-controller.js';
import InjectConsolePresenter from '../presenters/inject-console-presenter.js';
import { ProfileBar } from '../ui/profile-bar.js';
import AboutWindow from './about.js';
import { DownloadPage } from '../ui/download-page.js';
import HeaderboxConsole from '../ui/headerbox/console.js';
import HeaderboxBuild from '../ui/headerbox/build.js';
import HeaderBox from '../ui/headerbox.js';
import ThemeSelector from '../ui/themeselector.js';
import StatusManager from '../model/status-manager.js';
import { LaunchpadPage } from '../ui/launchpad.js';
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
import InjectButtonSetPresenter from '../presenters/inject-button-set-presenter.js';
import UsagePresenter from '../presenters/usage-presenter.js';
import { Addonlist } from '../model/addonlist.js';
import AddonDetailsPresenter from '../presenters/addon-details-presenter.js';
import AddonDetails from '../ui/addon-details.js';
import AddonsPanelDisk from '../ui/addons-panel-disk.js';
import Repository from '../model/repository.js';
import ProfileBarActions from '../actions/profile-bar.js';
import ArchiveStore from '../model/archive-store.js';
import ArchiveList from '../ui/addon-details/archive-list.js';
import { ArchiveRow } from '../ui/addon-details/archive-list.js';
import StaticArchiveStorePresenter from '../presenters/static-archive-store-presenter.js';
import DownloadPagePresenter from '../presenters/download-page-presenter.js';
import { ActionRow, PreferencesRow } from '../ui/sensitizable-widgets.js';
import ProfileProxy from '../backend/profile-proxy.js';
import LaunchpadPagePresenter from '../presenters/launchpad-page-presenter.js';
import TextMarkupPresenter from '../presenters/text-markup-presenter.js';
import SettingsTextMarkupPresenter from '../presenters/settings/text-markup.js';
import { globalThis } from '../utils/ts-helper.js';
import NotificationModel from '../model/notification.js';
import NotificationPresenter from '../presenters/notification.js';
import AddonDetailsSelectModel from '../model/addon-details-select.js';
import ArchiveSelectModel from '../model/archive-select.js';
import SettingsDevelStylePresenter from '../presenters/settings/devel-style.js';

GObject.type_ensure(PreferencesRow.$gtype);
GObject.type_ensure(ArchiveRow.$gtype);
GObject.type_ensure(ArchiveList.$gtype);
GObject.type_ensure(AddonDetails.$gtype);
GObject.type_ensure(ActionRow.$gtype);
GObject.type_ensure(UsageMeter.$gtype);
GObject.type_ensure(AddonsPanelDisk.$gtype);
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
        'profile_bar',
        'headerbox',
        'inject_button_set',
        'download_page',
        'launchpad_page',
        'addon_details',
        'addons_panel_disk',
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
  _profile_bar!: ProfileBar;
  _headerbox!: HeaderBox;
  _inject_button_set!: InjectButtonSet;
  _download_page!: DownloadPage;
  _launchpad_page!: LaunchpadPage;
  _addon_details!: AddonDetails;
  _addons_panel_disk!: AddonsPanelDisk;

  constructor(params: {
    application: Gtk.Application;
    client: AddonBoxClient;
    gsettings: Gio.Settings;
    repository: Repository;
  }) {
    super(params as any);
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
    const buildtype = (globalThis as unknown as globalThis).config.buildtype;
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
    SettingsActions({
      parent_window: this,
      main_window: this,
      settings: this.gsettings,
      client: this.client,
      notification_model: this._notification_model,
    }).export2actionMap(group);

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
        inject_button_styles_view: prefWin.inject_button_styles_view,
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
        parent_window: this,
      }).present();
    });
    this.add_action(showAbout);

    let back_from: string | null = null;
    const back = new Gio.SimpleAction({ name: 'back' });
    back.connect('activate', () => {
      const _back_from = this._primary_leaflet.get_visible_child_name();
      if (_back_from === 'addons-page') return;
      this._primary_leaflet.set_visible_child_name('addons-page');
      back_from = _back_from;
    });
    this.add_action(back);

    const forward = new Gio.SimpleAction({ name: 'forward' });
    forward.connect('activate', () => {
      if (back_from === null) return;
      this._primary_leaflet.set_visible_child_name(back_from);
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
      leaflet: this._primary_leaflet,
      action_map: this,
    });
    UsagePresenter({
      client: this.client,
      addons_panel: this._download_page.panel,
      addons_panel_disk: this._addons_panel_disk,
    });
  }

  _setup_headerbox() {
    ProfileBarActions({
      action_map: this,
      profile_bar: this._profile_bar,
    });
    HeaderBoxActions({
      action_map: this,
      headerbox: this._headerbox,
    }).init_headerbox();
    HeaderboxAttachControls({
      action_map: this,
      detachable: this._headerbox.detachable,
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
      stack: this._primary_leaflet,
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
