import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import * as Adw1 from './utils/adw1.js';
import * as Gio1 from './utils/gio1.js';
import * as Utils from './utils.js';

import './gtk.js';
import './inject-console.js';
import './download-page.js';
import './add-addon.js';
import './launchpad.js';
import './download-page.js';
import './repository-page.js';
import './launchpad.js';
import './profile-bar.js';
import { DownloadPage } from './download-page.js';
import { LaunchpadPage } from './launchpad.js';
import { ProfileBar } from './profile-bar.js';
import { Config } from './config.js'
import PreferencesWindow from './preferences-window.js';
import { LateBindee } from './mvc.js';
import { AddonStorage } from './addon-storage.js';
import { Profile } from './profiles.js';
import AddAddonActions, { AddAddon } from './add-addon.js';
import addon_storage_controls from './addon-storage-controls.js';
import addon_details_implement from './addon-details.js';
import DownloadWindow, { DownloadWindowActions } from './download-window.js';
import profile_window_implement from './profile-window.js';
import { AddonsPanelDiskActions, AddonsPanelDiskAllocateModal, AddonsPanelDiskPage, DiskModal } from './addons-panel.js';
import InjectorActions from './injector-actions.js';
import InjectConsole, { InjectConsoleActions, InjectConsolePresenter } from './inject-console.js';
import ArchiveActions from './archive-controls.js';
import Settings, { SettingsActions } from './settings.js';
import { ActionSynthesizer } from './addon-action.js';
import Downloader from './downloader.js';
import DiskCapacity from './disk-capacity.js';
import { Archiver } from './archive.js';
import SteamworkServices from './steam-api.js';
import Injector from './injector.js';
import InjectButtonSet from './inject-button-set.js';

export type Stvpk = {
  pkg_user_data_dir: Gio.File;
  pkg_user_state_dir: Gio.File;
  addons_dir: Gio.File;
  addonStorage: AddonStorage;
  addonSynthesizer: ActionSynthesizer;
  downloader: Downloader;
  settings: Settings;
  diskCapacity: DiskCapacity;
  archiver: Archiver;
  steamapi: SteamworkServices;
  injector: Injector;
}

export interface MainWindowContext { application: Stvpk, main_window: Window }

enum signals {
}

export default class Window
extends Adw.ApplicationWindow
implements Adw1.Toaster {
  static readonly Signals = signals;

  static {
    Utils.registerClass({
      Properties: {
        'current-profile': GObject.ParamSpec.string(
          'current-profile', 'current-profile', 'current-profile',
          GObject.ParamFlags.READWRITE, ''),
      },
      Template: `resource://${Config.config.app_rdnn}/ui/window.ui`,
      Children: [
        'launchpadPage',
        'downloadPage',
        'profileBar',
        'toastOverlay',
        'leaflet',
        'inject-console',
        'win-view-stack',
        'toolbar-revealer',
        'header-bar',
        'inject-button-set',
        'secondary-bar',
      ],
    }, this);
  }

  launchpadPage!: LaunchpadPage;
  profileBar!: ProfileBar;
  downloadPage!: DownloadPage;
  toastOverlay!: Adw.ToastOverlay;
  leaflet!: Adw.Leaflet;

  profiles: Map<string, Profile>;
  currentProfile: Profile | null;

  actionGroups: Map<string, Gio.SimpleActionGroup>;
  view_switcher!: Adw.ViewSwitcher;
  inject_console?: InjectConsole;
  inject_button_set?: InjectButtonSet;
  win_view_stack?: Adw.ViewStack;
  toolbar_revealer?: Gtk.Revealer;
  header_bar?: Adw.HeaderBar;
  secondary_bar?: Gtk.SearchBar;

  constructor(
  { application,
    title,
    pkg_user_data_dir,
    pkg_user_state_dir,
    addons_dir,
    addon_storage,
    addon_synthesizer,
    downloader,
    settings,
    disk_capacity,
    archiver,
    steamapi,
    injector,
  }:
  { application: Gtk.Application;
    title: string | null;
    pkg_user_data_dir: Gio.File;
    pkg_user_state_dir: Gio.File;
    addons_dir: Gio.File;
    addon_storage: AddonStorage;
    addon_synthesizer: ActionSynthesizer;
    downloader: Downloader;
    settings: Settings;
    disk_capacity: DiskCapacity;
    archiver: Archiver;
    steamapi: SteamworkServices;
    injector: Injector;
  }) {
    super({
      application,
      title,
    });
    const main_window = this;
    const action_map = this;
    const stvpk = {
      pkg_user_data_dir,
      pkg_user_state_dir,
      addons_dir,
      addonStorage: addon_storage,
      addonSynthesizer: addon_synthesizer,
      downloader,
      settings,
      diskCapacity: disk_capacity,
      archiver,
      steamapi,
      injector,
    };

    const stack = this.win_view_stack;
    if (stack) {
      const update = () => {
        const current = stack.get_visible_child_name();
        switch (current) {
        case 'main-page':
          this.secondary_bar?.set_search_mode(true);
          break;
        case 'download-page':
        default:
          this.secondary_bar?.set_search_mode(false);
          break;
        }
      }
      stack.get_pages().connect('selection-changed', update);
      update();
    }

    this.downloadPage.panel.addon_storage = addon_storage;
    this.downloadPage.panel.disk_capacity = disk_capacity;

    AddonsPanelDiskPage({
      leaflet: this.leaflet,
      disk_capacity,
    });

    this.actionGroups = new Map();
    this.profiles = new Map();
    this.currentProfile = null;
    [
      this.downloadPage,
      this.profileBar.mux,
      this.profileBar,
    ].forEach((x: LateBindee<MainWindowContext>) => {
      x.onBind({ application: stvpk, main_window: this });
    });
    this.launchpadPage.bind({ addon_storage });
    this.launchpadPage.model.bind({ addon_storage });
    this.launchpadPage.defaultSection.bind({ addon_storage });

    this.setupWindowActions({ settings, addon_storage });
    new AddAddon({
      application: stvpk,
      window: this,
      archiver,
    });
    AddAddonActions({
      action_map,
      addon_storage,
    });
    addon_details_implement({
      addon_storage,
      page_slot: this.leaflet.get_child_by_name('addon-details-page') as Adw.Bin,
      leaflet: this.leaflet,
      leaflet_details_page: 'addon-details-page',
      toaster: this.toastOverlay,
      disk_capacity,
      action_map,
    });
    addon_storage_controls({ application: stvpk, main_window: this });
    DownloadWindowActions({
      application,
      main_window,
      downloader,
      DownloadWindow:
        DownloadWindow.bind(null, { addon_storage, downloader }),
    });
    profile_window_implement({
      main_window,
    });
    AddonsPanelDiskActions({
      leaflet: this.leaflet,
      main_window,
      action_map,
      addons_dir: addon_storage.subdirFolder,
      disk_capacity,
      Modal: (function() {
              const { present, close } = AddonsPanelDiskAllocateModal();
              return { present, close };
            }) as unknown as { new(): DiskModal },
    });
    InjectorActions({
      injector,
      action_map,
      parent_window: this,
    });
    InjectConsolePresenter({
      inject_console: this.inject_console,
      button_set: this.inject_button_set,
      injector,
    })
    InjectConsoleActions({
      inject_console: this.inject_console,
      action_map,
    });
    ArchiveActions({
      action_map,
      addon_storage,
      archiver,
    });
  }

  onBind(_context: MainWindowContext): void {}

  insert_action_group(name: string, group: Gio.SimpleActionGroup | null): void {
    super.insert_action_group(name, group);
    if (group !== null) this.actionGroups.set(name, group);
  }

  lookup_action(action_name: string | null): Gio.Action | null {
    let action = super.lookup_action(action_name);
    if (action !== null) return action;
    this.actionGroups.forEach(group => {
      action = group.lookup_action(action_name);
      if (action !== null) return;
    });
    return action;
  }

  list_actions(): string[] {
    const actions: string[] = [];
    super.list_actions().forEach(x => actions.push(x));
    this.actionGroups.forEach(group => {
      group.list_actions().forEach(x => actions.push(x));
    });
    return actions;
  }

  displayToast(toast: Adw.Toast) {
    this.toastOverlay.add_toast(toast);
  }

  setupWindowActions(
  { settings,
    addon_storage,
  }:
  { settings: Settings,
    addon_storage: AddonStorage,
  }) {
    const group = new Gio.SimpleActionGroup();
    SettingsActions({
      action_map: group,
      settings,
      parent_window: this,
    });
    const showPreferences = Gio1.SimpleAction
      .builder({ name: 'show-preferences' })
      .activate(() => {
        const [prefWin, bind, insert_action_group] = PreferencesWindow();
        bind({
          parent_window: this,
          settings,
        });
        insert_action_group(group);
        prefWin.present();
      })
      .build();
    this.add_action(showPreferences);
    this.application.set_accels_for_action('win.show-preferences', ['<Control>comma'])

    const showAbout = Gio1.SimpleAction
      .builder({ name: 'show-about' })
      .activate(() => {
        const about = new Adw.AboutWindow({
          application_icon: 'addon-box',
          application_name: Config.config.app_fullname,
          developer_name: `Kinten Le`,
          license_type: Gtk.License.GPL_3_0,
          version: Config.config.version,
          issue_url: 'https://github.com/kinten108101/steam-vpk/issues',
          developers: [ 'Kinten Le <kinten108101@protonmail.com>' ],
          transient_for: this,
          debug_info: Config.getInstance().toString(),
          release_notes: '',
          comments: '<span weight=\'bold\' size=\'medium\'>The Name</span>\n<tt>steam-vpk</tt> was an ad-hoc name for a shell-script program I wrote back in 2022, and the name stuck.',
        });
        about.present();
      })
      .build();
    this.add_action(showAbout);

    const reloadData = Gio1.SimpleAction
      .builder({ name: 'reload-data' })
      .activate(() => {
        const addonChangeSub = addon_storage.connect_after(AddonStorage.Signals.addons_changed, () => {
          addon_storage.disconnect(addonChangeSub);
          Adw1.Toast.builder()
            .title('Add-ons updated!')
            .timeout(3)
            .wrap().build().present(this);
        });
        addon_storage.emit('force-update');
      })
      .build();
    this.add_action(reloadData);
    this.application.set_accels_for_action('win.reload-data', ['<Control>r']);

    const back = new Gio.SimpleAction({ name: 'back' });
    back.connect('activate', () => {
      this.leaflet.set_visible_child_name('addons-page');
    });
    this.add_action(back);
    this.application.set_accels_for_action('win.back', ['<Alt>Left']);
  }

  updateCurrentProfileCb() {
    // fit test
    this.notify('current-profile');
  }

  manualUpdateCurrentProfileWithId(val: string) {
    const profile = this.profiles.get(val);
    if (profile === undefined) {
      // fit test
      return;
    }
    this.currentProfile = profile;
    this.notify('current-profile');
  }

  manualUpdateCurrentProfile(val: Profile) {
    if (!this.profiles.has(val.id)) {
      // fit test
      return;
    }
    this.currentProfile = val;
    this.notify('current-profile');
  }

  vfunc_close_request() {
    super.vfunc_close_request();
    this.run_dispose();
    return true;
  }
}
