import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import GObject from 'gi://GObject';
import { MakeTitleCompat, SteamMd2Pango } from '../utils/markup.js';

export class SeparatorRow extends Adw.ActionRow {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkSeparatorRow',
    }, this);
  }

  constructor(params = {}) {
    super({
      title: 'Example row',
      ...params,
    });
  }
}

export default class LaunchpadRow extends Adw.ExpanderRow {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkLaunchpadRow',
      Properties: {
        addon_title: GObject.ParamSpec.string(
          'addon-title', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
        id: GObject.ParamSpec.string(
          'id', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
        id_gvariant: GObject.param_spec_variant(
          'id-gvariant', '', '',
          GLib.VariantType.new('s'),
          GLib.Variant.new_string(''),
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT),
        active: GObject.ParamSpec.boolean(
          'active', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          false),
        description: GObject.ParamSpec.string(
          'description', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
        last_update: GObject.ParamSpec.jsobject(
          'last-update', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT),
        enable_text_markup: GObject.ParamSpec.boolean(
          'enable-text-markup', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          false),
      },
      Template: 'resource:///com/github/kinten108101/SteamVPK/ui/launchpad-row.ui',
      InternalChildren: [
        'ztitle',
        'description_field',
        'last_update_field',
        'toggle',
      ],
    }, this);
  }

  addon_title!: string | null;
  id!: string | null;
  id_gvariant!: GLib.Variant | null;
  active!: boolean;
  description!: string | null;
  last_update!: Date | null;
  enable_text_markup!: boolean;

  _ztitle!: Gtk.Label;
  _description_field!: Gtk.Label;
  _last_update_field!: Gtk.Label;
  _toggle!: Gtk.Switch;

  constructor(params = {}) {
    super(params);

    this.bind_property_full('id', this, 'id-gvariant',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: string | null): [boolean, GLib.Variant] => {
        if (from === null) return [true, GLib.Variant.new_string('')];
        return [true, GLib.Variant.new_string(from)];
      },
      () => {});

    this.connect('notify::active', this._update_toggle_actionable);

    this.bind_property(
      'active', this._toggle, 'active',
      GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL);

    this.bind_property_full('addon-title', this._ztitle, 'label',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: string | null): [boolean, string] => {
        if (from === null) return [true, 'No title'];
        return [true, MakeTitleCompat(from)];
      },
      () => {});
    this.bind_property_full('description', this._description_field, 'label',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: string | null): [boolean, string] => {
        if (from === null) return [true, 'No description'];
        return [true, SteamMd2Pango(from)];
      },
      () => {});
    this.bind_property_full('last-update', this._last_update_field, 'label',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: Date | null): [boolean, string] => {
        if (from === null) return [true, 'Unknown time'];
        return [true, from.toDateString()];
      },
      () => {});

    this.bind_property('enable-text-markup', this._description_field, 'use-markup',
      GObject.BindingFlags.SYNC_CREATE);
  }

  _update_toggle_actionable() {
    if (this.id_gvariant === null) return;
    const gvariant = GLib.Variant.new_tuple([
      this.id_gvariant,
      GLib.Variant.new_boolean(!this.active),
    ]);
    this._toggle.set_action_target_value(gvariant);
  }
}

export class LaunchpadPage extends Adw.Bin {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkLaunchpadPage',
      Properties: {
        loadorder: GObject.ParamSpec.object(
          'loadorder', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          Gio.ListModel.$gtype),
        enable_text_markup: GObject.ParamSpec.boolean(
          'enable-text-markup', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          false),
      },
      Template: `resource:///com/github/kinten108101/SteamVPK/ui/launchpad-page.ui`,
      Children: [
        'addonlist_box',
        'stack',
      ],
    }, this);
  }

  loadorder: Gio.ListModel | null = null;

  addonlist_box!: Gtk.ListBox;
  stack!: Adw.ViewStack;
  enable_text_markup!: boolean;


  constructor(params = {}) {
    super(params);
    this.connect('notify::loadorder', () => {
      if (this.loadorder === null) return;
      this.loadorder.connect('notify::n-items', this.update_list_appearance);
    });
  }

  vfunc_realize(): void {
    super.vfunc_realize();
    this.update_list_appearance();
  }

  update_list_appearance = () => {
    if (this.loadorder === null) return;
    if (this.loadorder.get_n_items() === 0) {
      this.stack.set_visible_child_name('empty');
    } else {
      this.stack.set_visible_child_name('main');
    }
  }
}
