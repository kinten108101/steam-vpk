import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import * as Adw1 from './utils/adw1.js';
import * as Gio1 from './utils/gio1.js';
import './utils/revealer.js';

import './download-page.js';
import './add-addon.js';
import './launchpad.js';
import './download-page.js';
import { DownloadPage } from './download-page.js';
import './launchpad.js';
import { LaunchpadPage } from './launchpad.js';
import './profile-bar.js';
import { ProfileBar } from './profile-bar.js';
import { Config } from './config.js'
import { PreferencesWindow } from './preferences-window.js';
import { LateBindee, Model } from './mvc.js';
import { Application } from './application.js';
import { AddonStorage } from './addon-storage.js';
import { addon_details_implement } from './addon-details.js';
import { Profile } from './profiles.js';
import { AddAddon } from './add-addon.js';
import implementAddonStorageControls from './addon-storage-controls.js';
import { BUILD_TYPE, BuildTypes } from './const.js';

export interface MainWindowContext { application: Application, main_window: Window }

export class Window
extends Adw.ApplicationWindow
implements Adw1.Toaster, Model {
  static Signals = {
    first_flush: 'first_flush',
  }

  static {
    GObject.registerClass({
      GTypeName: 'StvpkWindow',
      Properties: {
        'current-profile': GObject.ParamSpec.string(
          'current-profile', 'current-profile', 'current-profile',
          GObject.ParamFlags.READWRITE, ''),
      },
      Signals: {
        [Window.Signals.first_flush]: {},
      },
      Template: `resource://${Config.config.app_rdnn}/ui/window.ui`,
      Children: [
        'launchpadPage',
        'downloadPage',
        'profileBar',
        'toastOverlay',
      ],
    }, this);
  }

  launchpadPage!: LaunchpadPage;
  profileBar!: ProfileBar;
  downloadPage!: DownloadPage;
  toastOverlay!: Adw.ToastOverlay;

  profiles: Map<string, Profile>;
  currentProfile: Profile | null;
  application: Application;

  constructor(params: Adw.ApplicationWindow.ConstructorProperties & { application: Application }) {
    super(params);
    this.application = params.application;
    if (BUILD_TYPE === BuildTypes.debug)
      this.get_style_context().add_class('devel');

    this.profiles = new Map();
    //const defaultProfile = Profile.makeDefault(this.application.addonStorage);
    this.currentProfile = null;
    //this.profiles.set(defaultProfile.id, defaultProfile);

    const context: MainWindowContext = { application: this.application, main_window: this };
    [
      this.downloadPage,
      this.launchpadPage.model,
      this.launchpadPage,
      this.profileBar.profilePopover,
      this.profileBar.mux,
      this.profileBar,
    ].forEach((x: LateBindee<MainWindowContext>) => {
      x.onBind(context);
    });
    this.setupWindowActions();
    // should have been just an initializing function
    new AddAddon({
      application: this.application,
      window: this,
    });
    addon_details_implement(context);
    implementAddonStorageControls(context);
  }

  async start() {
    this.emit(Window.Signals.first_flush);
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
        });
        about.present();
      })
      .build();
    this.add_action(showAbout);

    const reloadData = Gio1.SimpleAction
      .builder({ name: 'reload-data' })
      .activate(() => {
        const app = (this.application as Application);
        const addonChangeSub = app.addonStorage.connect(AddonStorage.Signals.addons_changed, () => {
          app.addonStorage.disconnect(addonChangeSub);
          Adw1.Toast.builder()
            .title('Add-ons updated!')
            .timeout(3)
            .wrap().build().present(this);
        });
        app.addonStorage.emit('force-update');
      })
      .build();
    this.add_action(reloadData);
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
