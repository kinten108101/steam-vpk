import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import { UseStates } from '../model/repository.js';
import AddonsPanel from './addons-panel.js';

export class UseButton extends Gtk.Button {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkUseButton',
      Properties: {
        state: GObject.ParamSpec.string(
          'state', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          ((): UseStates => UseStates.AVAILABLE)(),
        ),
      },
    }, this);
  }

  state!: string | null;

  constructor(param = {}) {
    super(param);
    this.set_valign(Gtk.Align.CENTER);
    this.set_halign(Gtk.Align.CENTER);
    this.connect('notify::state', this.update_state.bind(this));
  }

  vfunc_realize(): void {
    super.vfunc_realize();
    this.update_state();
  }

  update_state() {
    const state = this.state;
    switch (state) {
    case UseStates.USED:
      this.set_label('Added');
      this.remove_css_class('suggested-action');
      this.set_sensitive(false);
      break;
    case UseStates.AVAILABLE:
      this.set_label('Add');
      this.add_css_class('suggested-action');
      this.set_sensitive(true);
      break;
    }
  }
}

export class DownloadPageRow extends Gtk.ListBoxRow {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkDownloadPageRow',
      Properties: {
        title: GObject.ParamSpec.string(
          'title', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
        subtitle: GObject.ParamSpec.string(
          'subtitle', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
        description: GObject.ParamSpec.string(
          'description', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
        use_state: GObject.ParamSpec.string(
          'use_state', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
        id: GObject.ParamSpec.string(
          'id', 'ID', 'In-app ID of add-on item',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
        id_gvariant: GObject.param_spec_variant(
          'id-gvariant', '', '',
          GLib.VariantType.new('s'), null,
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT),
        enable_text_markup: GObject.ParamSpec.boolean(
          'enable-text-markup', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          false),
      },
      Template: `resource:///com/github/kinten108101/SteamVPK/ui/download-page-row.ui`,
      InternalChildren: [
        'title_label',
        'subtitle_label',
        'description_label',
        'use_button',
        'trash',
      ],
    }, this);
  }

  title!: string | null;
  subtitle!: string | null;
  description!: string | null;
  use_state!: UseStates | null;
  id_gvariant!: GLib.Variant | null;
  enable_text_markup!: boolean;

  _title_label!: Gtk.Label;
  _subtitle_label!: Gtk.Label;
  _description_label!: Gtk.Label;
  _use_button!: UseButton;
  _trash!: Gtk.Button;

  constructor(params = {}) {
    super(params);
    this.bind_property_full('title', this._title_label, 'label',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: string | null): [boolean, string] => {
        if (from === null) return [true, 'No title'];
        return [true, from];
      },
      () => {});
    this.bind_property_full('subtitle', this._subtitle_label, 'label',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: string | null): [boolean, string] => {
        if (from === null) return [true, 'Unknown creators'];
        return [true, from];
      },
      () => {});
    this.bind_property_full('description', this._description_label, 'label',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: string | null): [boolean, string] => {
        if (from === null) return [true, 'No description'];
        return [true, from];
      },
      () => {});
    this.bind_property_full('use_state', this._use_button, 'state',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: UseStates | null): [boolean, UseStates] => {
        if (from === null) return [true, UseStates.USED];
        return [true, from];
      },
      () => {});
    this.bind_property_full('id', this, 'id-gvariant',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: string | null): [boolean, GLib.Variant] => {
        if (from === null) return [true, GLib.Variant.new_string('')];
        return [true, GLib.Variant.new_string(from)];
      },
      null as unknown as GObject.TClosure);

    this.bind_property('enable-text-markup', this._description_label, 'use-markup',
      GObject.BindingFlags.SYNC_CREATE);
  }
}

export class DownloadPage extends Adw.PreferencesPage {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkDownloadPage',
      Properties: {
        enable_text_markup: GObject.ParamSpec.boolean(
          'enable-text-markup', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          false),
      },
      Template: `resource:///com/github/kinten108101/SteamVPK/ui/download-page.ui`,
      Children: [
        'panel',
        'local_addons',
        'remote_addons',
        'local_group',
        'remote_group',
      ],
    }, this);
  };

  enable_text_markup!: boolean;

  panel!: AddonsPanel;
  local_addons!: Gtk.ListBox;
  remote_addons!: Gtk.ListBox;
  local_group!: Adw.PreferencesGroup;
  remote_group!: Adw.PreferencesGroup;

  constructor(params = {}) {
    super(params);
  }

  update_group_with_list(model: Gio.ListModel, group: Adw.PreferencesGroup) {
    if (model.get_n_items() === 0) {
      group.set_visible(false);
    } else {
      group.set_visible(true);
    }
  }
}
