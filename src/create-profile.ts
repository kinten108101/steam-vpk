import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import GLib from 'gi://GLib';

import * as Gio1 from './utils/gio1.js';
import * as Gtk1 from './utils/gtk1.js';

import { Config } from './config.js';
import { gobjectClass } from './utils/decorator.js';
import { Result } from './utils/result.js';
import { generateName } from './id.js';

@gobjectClass({
  Template: `resource://${Config.config.app_rdnn}/ui/create-profile.ui`,
  Children: [
    'nameRow',
    'idRow',
    'useAllSwitch',
  ],
  Implements: [
    Gio.ActionMap,
  ],
})
export class CreateProfileDialog extends Adw.Window {
  nameRow!: Adw.EntryRow;
  idRow!: Adw.EntryRow;
  useAllSwitch!: Gtk.Switch;

  resolve!: Gtk1.PromiseResolve<Result<[string, string, boolean], GLib.Error>>;
  reject!: Gtk1.PromiseReject;

  actionGroup: Gio.SimpleActionGroup;

  constructor(param = {}) {
    super(param);
    this.actionGroup = new Gio.SimpleActionGroup();
    this.insert_action_group('create-profile', this.actionGroup);
    this.setupActions();
  }

  setupActions() {
    const apply = Gio1.SimpleAction
      .builder({ name: 'apply' })
      .activate(() => {
        const id = this.idRow.get_text() || '';
        const name = this.nameRow.get_text() || '';
        const useAll = this.useAllSwitch.get_active();
        const result: [string, string, boolean] = [id, name, useAll]
        this.resolve(Result.compose.OK(result));
        this.close();
      })
      .build();
    this.actionGroup.add_action(apply);

    const cancel = Gio1.SimpleAction
      .builder({ name: 'cancel' })
      .activate(() => {
        this.reject(new GLib.Error(Gtk.dialog_error_quark(), Gtk.DialogError.DISMISSED, ''));
        this.close();
      })
      .build();
    this.actionGroup.add_action(cancel);
  }

  onNameApply() {
    const name = this.nameRow.text;
    if (name === null)
      return;
    this.idRow.set_text(generateName(name));
  }

  async fill(parentWindow: Gtk.Window): Promise<Result<[string, string, boolean], GLib.Error>> {
    return new Promise<Result<[string, string, boolean], GLib.Error>>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
      this.set_transient_for(parentWindow);
      this.present();
    }).then(
      (value) => {
        return Result.compose.OK(value);
      },
      (error) => {
        if (error instanceof GLib.Error) {
          return Result.compose.NotOK(error);
        }
        return error;
      }
    );
  }
}
