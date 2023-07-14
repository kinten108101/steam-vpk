import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import { Config } from './config.js';
import { gobjectClass } from './utils/decorator.js';
import { MainWindowContext, Window } from './window.js';
import { Addon } from './addons.js';
import { LateBindee } from './mvc.js';
import * as Markup from './markup.js';
import { AddonStorage } from './addon-storage.js';

export class UseButton extends Gtk.Button {
  static States = {
    USED: 'used',
    AVAILABLE: 'available',
  };
  static {
    GObject.registerClass({
      GTypeName: 'StvpkUseButton',
      Properties: {
        state: GObject.ParamSpec.string('state', 'state', 'Enum for the state of StvpkUseButton, see `Stvpk.UseButton.States`.', GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT | GObject.ParamFlags.EXPLICIT_NOTIFY, UseButton.States.AVAILABLE),
      }
    }, this);
  }

  state!: string;

  constructor(param = {}) {
    super(param);
    this.set_valign(Gtk.Align.CENTER);
    this.set_halign(Gtk.Align.CENTER);
    this.connect('notify::state', this.updateState);
  }

  updateState = (button: UseButton) => {
    const state = button.state;
    switch (state) {
    case UseButton.States.USED:
      this.set_label('Used');
      this.remove_css_class('suggested-action');
      this.set_sensitive(false);
      break;
    case UseButton.States.AVAILABLE:
      this.set_label('Use');
      this.add_css_class('suggested-action');
      this.set_sensitive(true);
      break;
    default:
      throw new Error(`Unexpected UseButton.States. Details: ${state}`);
    }
  }

  set_state(val: string) {
    this.state = val;
    this.notify('state');
  }
}

@gobjectClass({
  Template: `resource://${Config.config.app_rdnn}/ui/download-page-row.ui`,
  Children: [ 'title', 'subtitle', 'description', 'use_button' ],
})
export class DownloadPageRow extends Gtk.ListBoxRow {
  data: Addon;
  title!: Gtk.Label;
  subtitle!: Gtk.Label;
  description!: Gtk.Label;
  use_button!: UseButton;

  constructor(param: { data: Addon, title: string, subtitle: string, description: string }) {
    super({});
    this.data = param.data;
    /*
    const flags = GObject.BindingFlags.BIDIRECTIONAL | GObject.BindingFlags.SYNC_CREATE;
    this.title.bind_property('label', this.data, 'title', flags);
    this.subtitle.bind_property('label', this.data, 'subtitle', flags);
    this.description.bind_property('label', this.data, 'description', flags);
    */
    this.title.set_label(param.title);
    this.subtitle.set_label(param.subtitle);
    this.description.set_label(param.description);
  }
}

@gobjectClass({
  Template: `resource://${Config.config.app_rdnn}/ui/download-page.ui`,
  Children: [ 'localRepoList', 'localRepoSection', 'remoteRepoList', 'remoteRepoSection',  ] })
export class DownloadPage extends Adw.PreferencesPage
implements LateBindee<MainWindowContext> {
  localRepoSection!: Adw.PreferencesGroup;
  localRepoList!: Gtk.ListBox;
  localRepoModel: Gio.ListStore<Addon>;

  remoteRepoSection!: Adw.PreferencesGroup;
  remoteRepoList!: Gtk.ListBox;
  remoteRepoModel: Gio.ListStore<Addon>;

  addonStorage!: AddonStorage;
  context!: MainWindowContext;

  constructor(param = {}) {
    super(param);
    this.localRepoModel = new Gio.ListStore({ item_type: Addon.$gtype });
    this.remoteRepoModel = new Gio.ListStore({ item_type: Addon.$gtype });
    this.localRepoList.bind_model(this.localRepoModel, this.widgetCreator);
    this.remoteRepoList.bind_model(this.remoteRepoModel, this.widgetCreator);
  }

  onBind(context: MainWindowContext) {
    this.context = context;
    this.addonStorage = context.application.addonStorage;
    context.application.addonStorage.connect(AddonStorage.Signals.addons_changed, this.updateLayout);
    context.main_window.connect(Window.Signals.first_flush, this.updateLayout);
    //context.application.addonStorage.connect(AddonStorage.Signals.loadorder_changed, this.updateIncludeButtons);
    //context.main_window.connect(Window.Signals.first_flush, this.updateIncludeButtons);
  }

  widgetCreator = (x: GObject.Object): DownloadPageRow => {
    const addon = x as Addon;
    const row = new DownloadPageRow({
      data: addon,
      title: addon.title || '',
      subtitle: (() => {
                const creators: string[] = [];
                addon.creators?.forEach((_, key) => creators.push(key));
                if (creators.length === 0) return 'Unknown author';
                const text: string = creators.reduce((acc, x, i) => {
                  if (i === 0) return `${x}`;
                  return `${acc}, ${x}`;
                });
                return text;
              })(),
      description: Markup.MakeCompatPango(addon.description || ''),
    });
    const id = GLib.Variant.new_string(addon.vanityId);
    row.use_button.set_action_target_value(id);
    const update = () => {
      if (this.addonStorage.loadorder.includes(addon.vanityId)) {
        console.debug('Set use-button state as used!');
        row.use_button.set_state(UseButton.States.USED);
      } else {
        row.use_button.set_state(UseButton.States.AVAILABLE);
      }
    };
    update();
    this.addonStorage.connect(AddonStorage.Signals.loadorder_changed, update);
    this.context.main_window.connect(Window.Signals.first_flush, update);
    row.set_action_target_value(id);
    return row;
  }

  updateLayout = () => {
    console.debug('<<updateLayout>>');
    console.debug('loadorder:', this.context.application.addonStorage.loadorder);
    this.localRepoModel.remove_all();
    this.remoteRepoModel.remove_all();
    this.addonStorage.idmap.forEach(x => {
      if (x.steamId) return this.remoteRepoModel.append(x);
      return this.localRepoModel.append(x);
    })
    if (this.localRepoModel.get_n_items() === 0) this.localRepoSection.set_visible(false);
    else this.localRepoSection.set_visible(true);
    if (this.remoteRepoModel.get_n_items() === 0) this.remoteRepoSection.set_visible(false);
    else this.remoteRepoSection.set_visible(true);
  };
}
