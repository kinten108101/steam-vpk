import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import * as Adw1 from './utils/adw1.js';
import * as Gio1 from './utils/gio1.js';
import { gobjectChild, gobjectClass } from './utils/decorator.js';
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
import { LateBindee } from './mvc.js';
import { Application } from './application.js';
import { SessionData } from './session-data.js';

export interface MainWindowContext { application: Application, main_window: Window }

@gobjectClass({
  GTypeName: 'StvpkWindow',
  Template: `resource://${Config.config.app_rdnn}/ui/window.ui`,
  Children: [
    'launchpadPage',
    'downloadPage',
    'profileBar',
    'toastOverlay',
  ],
})
export class Window
extends Adw.ApplicationWindow
implements Adw1.Toaster {
  @gobjectChild launchpadPage!: LaunchpadPage;
  @gobjectChild profileBar!: ProfileBar;
  @gobjectChild downloadPage!: DownloadPage;
  @gobjectChild toastOverlay!: Adw.ToastOverlay;

  session: SessionData;

  constructor(params: Adw.ApplicationWindow.ConstructorProperties & {
    session: SessionData,
  }) {
    const {session, ..._params} = params;
    super(_params);
    this.session = session;

    if (Config.config.build_type === 'debug')
      this.get_style_context().add_class('devel');
  }

  onBind(application: Application) {
    [
      this.launchpadPage.model,
      this.profileBar.profilePopover,
      this.profileBar.mux,
      this.profileBar,
    ].forEach((x: LateBindee<MainWindowContext>) => {
      const context: MainWindowContext = { application, main_window: this };
      x.onBind(context);
    });
    this.setupWindowActions();
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

  vfunc_close_request() {
    super.vfunc_close_request();
    this.run_dispose();
    return true;
  }
}
