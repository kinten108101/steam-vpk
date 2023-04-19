import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import Adw from 'gi://Adw';

import './omnibar.js';
import { PreferencesWindow } from './preferences-window.js';

import './addonlist-page.js';
import './download-page.js';

class Js_MainWindow extends Adw.ApplicationWindow {
  constructor(params={}) {
    super(params);
    this.#setWinActions();
  }

  #setWinActions() {
    const actionEntries: Gio.ActionEntry[] = [
      {
        name: 'show-preferences',
        activate: this.#onShowPreferences.bind(this),
        parameter_type: null,
        state: null,
        change_state: () => { return; },
      },
      {
        name: 'show-about',
        activate: this.onShowAbout.bind(this),
        parameter_type: null,
        state: null,
        change_state: () => { return; },
      },
      {
        name: 'show-help',
        activate: function(){
          return;
        }.bind(this),
        parameter_type: null,
        state: null,
        change_state: () => { return; },
      },
      {
        name: 'show-shortcuts',
        activate: function(){
          return;
        }.bind(this),
        parameter_type: null,
        state: null,
        change_state: () => { return; },
      }
    ];
    this.add_action_entries(actionEntries, null);
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

export const MainWindow = GObject.registerClass({
  GTypeName: 'MainWindow',
  // @ts-ignore
  Template: 'resource:///com/github/kinten108101/SteamVpk/ui/main-window.ui',
}, Js_MainWindow);
