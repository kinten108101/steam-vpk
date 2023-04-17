import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import Adw from 'gi://Adw';

import './omnibar.js';
import { PreferencesWindow } from './preferences-window.js';

import './addonlist-page.js';
import './download-page.js';

class Js_MainWindow extends Adw.ApplicationWindow {
  constructor(params={}) {
    /** TODO: So registration --> widget construction. Then am I ensuring too late?
     *  When is a component tree built from a template? Right after registration?
     *  TODO: Look around repos for how they a. ensure type, and b. load blp
     *  TODO: What happens when you import from a module? Will that whole file be run?
     */
    super(params);
    this.#ensureWidgets();
    this.#setWinActions();
  }

  #ensureWidgets() {
    // TODO: Document $gtype
    // GObject.type_ensure(Omnibar.$gtype);
    // GObject.type_ensure(PreferencesWindow)
  }

  #setWinActions() {
    const actionEntries: Gio.ActionEntry[] = [
      {
        name: 'show-preferences',
        activate: this.#onShowPreferences.bind(this),
        // accels: ['<Control>comma'],
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
        // accels: ['F1'],
        parameter_type: null,
        state: null,
        change_state: () => { return; },
      },
      {
        name: 'show-shortcuts',
        activate: function(){
          return;
        }.bind(this),
        // accels: ['<Control>question'],
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
    const contributors = {
      'kinten108101': 'Kinten Le <kinten108101@protonmail.com>',
    };
    const main = {
      application_icon: 'run-start-symbolic',
      application_name: 'Steamed VPK',
      developer_name: 'Kinten Le',
      version: '0.0.1',
    };
    const troubleshooting = {
      issue_url: 'https://github.com/kinten108101/SteamVpk-Js/issues',
    };
    const credits = {
      developers: [
        contributors['kinten108101'],
      ],
      designers: [
        contributors['kinten108101'],
      ],
      documenters: [
        contributors['kinten108101']
      ],
    };
    const legal = {
      copyright: '© 2023 Kinten Le',
    };
    const AboutWin = new Adw.AboutWindow({
      ...main,
      ...troubleshooting,
      ...credits,
      ...legal,
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

// TODO: Document Gjs_XXX
export const MainWindow = GObject.registerClass({
  GTypeName: 'MainWindow',
  // @ts-ignore
  Template: 'resource:///com/github/kinten108101/SteamVpk/ui/main-window.ui',
}, Js_MainWindow);
