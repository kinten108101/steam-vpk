import GObject from 'gi://GObject';
import Adw from 'gi://Adw';

import './omnibar.js';
import { PreferencesWindow } from './preferences-window.js';
import './addonlist-page.js';
import './download-page.js';
import { AddAddonWindow, SelectAddonDialog } from './add-addon.js';
import { ActionEntry, StatelessActionEntry, makeAction } from './actions.js';
import { set_accels_for_local_action } from './application.js';
import { force_profile_self_reload } from './profile-manager.js';

export class MainWindow extends Adw.ApplicationWindow {

  static {
    GObject.registerClass({
      GTypeName: 'MainWindow',
      Template: 'resource:///com/github/kinten108101/SteamVpk/ui/main-window.ui',
    }, this);
  }

  constructor(params = {}) {
    super(params);
    this.#setWinActions();
  }

  #setWinActions() {
    const actionEntries: ActionEntry[] = [
      {
        name: 'show-preferences',
        activate: this.#onShowPreferences.bind(this),
        accels: ['<Control>comma'],
      } as StatelessActionEntry,
      {
        name: 'show-about',
        activate: this.onShowAbout.bind(this),
      } as StatelessActionEntry,
      {
        name: 'reload-data',
        activate: () => {
          force_profile_self_reload();
        },
      } as StatelessActionEntry,
      {
        name: 'add-addon.add_url',
        activate: () => {
          const urlWindow = new AddAddonWindow({
            transient_for: this,
          });
          urlWindow.set_visible(true);
          return urlWindow;
        },
      } as StatelessActionEntry,
      {
        name: 'add-addon.add_archive',
        activate: () => {
          const fileDiag = new SelectAddonDialog({
            transient_for: this,
          });
          fileDiag.show();
        },
      } as StatelessActionEntry,
    ];
    actionEntries.forEach(item => {
      const action = makeAction(item);
      this.add_action(action);
    });
    set_accels_for_local_action(actionEntries, 'win');
  }

  #onShowPreferences() {
    const prefWin = new PreferencesWindow();
    prefWin.set_transient_for(this);
    prefWin.present();
  }

  onShowAbout() {
    const main = {
      application_icon: 'app',
      application_name: 'Steam VPK',
      developer_name: 'Kinten Le',
      version: '0.0.1',
    };
    const troubleshooting = {
      issue_url: 'https://github.com/kinten108101/SteamVpk-Js/issues',
    };
    const credits = {
      developers: [
        'Kinten Le <kinten108101@protonmail.com>',
      ],
    };
    const AboutWin = new Adw.AboutWindow({
      ...main,
      ...troubleshooting,
      ...credits,
      transient_for: this,
    });
    AboutWin.present();
  }


  vfunc_close_request() {
    super.vfunc_close_request();
    this.run_dispose();
    return true;
  }
}
