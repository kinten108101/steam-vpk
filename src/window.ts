import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import * as Adw1 from './utils/adw1.js';
import * as Gio1 from './utils/gio1.js';
import * as Const from './const.js';
import * as Utils from './utils.js';

import './gtk.js';
import './inject-console.js';
import './download-page.js';
import './add-addon.js';
import './launchpad.js';
import './download-page.js';
import './launchpad.js';
import './profile-bar.js';
import { DownloadPage } from './download-page.js';
import { LaunchpadPage } from './launchpad.js';
import { ProfileBar } from './profile-bar.js';
import { Config } from './config.js'
import { PreferencesWindow } from './preferences-window.js';
import { LateBindee, Model } from './mvc.js';
import { Stvpk } from './application.js';
import { AddonStorage } from './addon-storage.js';
import { Profile } from './profiles.js';
import { AddAddon } from './add-addon.js';
import ViewModelBinder, { ViewModelBindee } from './view-model-binder.js';
import addon_storage_controls from './addon-storage-controls.js';
import addon_details_implement from './addon-details.js';
import download_window_implement from './download-window.js';
import profile_window_implement from './profile-window.js';
import addons_panel_implement, { addons_panel_disk_implement } from './addons-panel.js';

export interface MainWindowContext { application: Stvpk, main_window: Window }

enum signals {
  first_flush = 'first_flush',
}

export default class Window
extends Adw.ApplicationWindow
implements Adw1.Toaster, Model, ViewModelBindee<MainWindowContext> {
  static readonly Signals = signals;

  static {
    Utils.registerClass({
      Properties: {
        'current-profile': GObject.ParamSpec.string(
          'current-profile', 'current-profile', 'current-profile',
          GObject.ParamFlags.READWRITE, ''),
      },
      Signals: {
        [signals.first_flush]: {},
      },
      Template: `resource://${Config.config.app_rdnn}/ui/window.ui`,
      Children: [
        'launchpadPage',
        'downloadPage',
        'profileBar',
        'toastOverlay',
        'leaflet',
        'view-switcher',
        'profile-bar-clamp',
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
  stvpk: Stvpk;

  actionGroups: Map<string, Gio.SimpleActionGroup>;
  binder: ViewModelBinder<MainWindowContext, this>;
  view_switcher!: Adw.ViewSwitcher;
  profile_bar_clamp!: Adw.Clamp;

  constructor(params: Adw.ApplicationWindow.ConstructorProperties & { stvpk: Stvpk }) {
    const { stvpk, ..._params } = params;
    super(_params);
    this.actionGroups = new Map();


    this.stvpk = params.stvpk;
    if (Const.BUILD_TYPE === Const.BuildTypes.debug)
      this.get_style_context().add_class('devel');

    this.profiles = new Map();
    this.currentProfile = null;

    const context: MainWindowContext = { application: this.stvpk, main_window: this };
    [
      this.downloadPage,
      //this.profileBar.profilePopover,
      this.profileBar.mux,
      this.profileBar,
    ].forEach((x: LateBindee<MainWindowContext>) => {
      x.onBind(context);
    });
    this.binder = new ViewModelBinder<MainWindowContext, this>(
    [
      this.launchpadPage,
    ], this);
    this.binder.bind(context);

    this.setupWindowActions();
    new AddAddon({
      application: this.stvpk,
      window: this,
    });
    addon_details_implement({
      addonStorage: this.stvpk.addonStorage,
      page_slot: this.leaflet.get_child_by_name('addon-details-page') as Adw.Bin,
      leaflet: this.leaflet,
      toaster: this.toastOverlay,
      diskCapacity: this.stvpk.diskCapacity,
      action_map: this,
    });
    addon_storage_controls(context);
    download_window_implement({
      application: this.application,
      main_window: this,
      downloader: this.stvpk.downloader,
    });
    profile_window_implement({
      main_window: this,
    });
    addons_panel_implement({
      builder_entry: this.downloadPage.builder_entry,
      diskCapacity: this.stvpk.diskCapacity,
      addonStorage: this.stvpk.addonStorage,
    });
    addons_panel_disk_implement({
      main_window: this,
      leaflet: this.leaflet,
      addons_dir: this.stvpk.addons_dir,
      disk_capacity: this.stvpk.diskCapacity,
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


  async start() {
    this.emit(signals.first_flush);
  }

  displayToast(toast: Adw.Toast) {
    this.toastOverlay.add_toast(toast);
  }

  setupWindowActions() {
    const showPreferences = Gio1.SimpleAction
      .builder({ name: 'show-preferences' })
      .activate(() => {
        const prefWin = new PreferencesWindow();
        prefWin.set_transient_for(this);
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
        const addonChangeSub = this.stvpk.addonStorage.connect_after(AddonStorage.Signals.addons_changed, () => {
          this.stvpk.addonStorage.disconnect(addonChangeSub);
          Adw1.Toast.builder()
            .title('Add-ons updated!')
            .timeout(3)
            .wrap().build().present(this);
        });
        this.stvpk.addonStorage.emit('force-update');
      })
      .build();
    this.add_action(reloadData);
    this.application.set_accels_for_action('win.reload-data', ['<Control>r']);

    const back = new Gio.SimpleAction({ name: 'back' });
    back.connect('activate', () => {
      this.leaflet.set_visible_child_name('addons-page');
    });
    this.add_action(back);
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
