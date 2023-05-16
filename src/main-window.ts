import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import Adw from 'gi://Adw';

import './omnibar.js';
import { PreferencesWindow } from './preferences-window.js';

import './addonlist-page.js';
import './download-page.js';
import { AddAddonWindow, SelectAddonDialog } from './add-addon';
import { ActionEntry, StatelessActionEntry, make_compat_action_entries } from './actions';
import { set_accels_for_local_action } from './application';

export const MainWindow = GObject.registerClass({
  GTypeName: 'MainWindow',
  // @ts-ignore
  Template: 'resource:///com/github/kinten108101/SteamVpk/ui/main-window.ui',
}, class Js_MainWindow extends Adw.ApplicationWindow {
  [x: string]: any;
  constructor(params={}) {
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
        name: 'show-help',
        activate: function(){
          return;
        }.bind(this),
        accels: ['F1'],
      } as StatelessActionEntry,
      {
        name: 'show-shortcuts',
        activate: () => {
          return;
        },
        accels: ['<Control>question']
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
    this.add_action_entries(make_compat_action_entries(actionEntries), null);
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
});
