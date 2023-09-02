import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';

import { MakeTitleCompat, SteamMd2Pango } from '../utils/markup.js';
import {
  GtkChildren,
  GtkTemplate,
  param_spec_variant,
  registerClass,
} from '../steam-vpk-utils/utils.js';
import { APP_RDNN } from '../utils/const.js';
import { AddonEntry } from '../model/addonlist.js';

export default class LaunchpadRow extends Adw.ExpanderRow {
  static [GtkTemplate] = `resource://${APP_RDNN}/ui/launchpad-row.ui`;
  static [GtkChildren] = [
    'ztitle',
    'zsubtitle',
    'zexcerpt',
    'description_field',
    'last_update_field',
    'toggle',
  ];

  static {
    registerClass({
      Properties: {
        idgvariant: param_spec_variant({
          name: 'id-gvariant',
          type: GLib.VariantType.new('s'),
          default_value: GLib.Variant.new_string(''),
        }),
      },
    }, this);
  }

  ztitle!: Gtk.Label;
  zsubtitle!: Gtk.Label;
  zexcerpt!: Gtk.Label;
  description_field!: Gtk.Label;
  last_update_field!: Gtk.Label;
  toggle!: Gtk.Switch;

  bind_with_item(item: AddonEntry) {
    const update = () => {
      // target value must be the next state to the current state aka the inverse
      const gvariant = GLib.Variant.new_tuple([
        GLib.Variant.new_string(item.id),
        GLib.Variant.new_boolean(!item.enabled),
      ]);
      (this['toggle'] as Gtk.Switch).set_action_target_value(gvariant);
    };
    const on_enabled = item.connect('notify::enabled', update);
    update();
    const signals: number[] = [];
    signals.push(on_enabled);
    const flags = GObject.BindingFlags.SYNC_CREATE;
    const bindings = [
      item.bind_property_full('name',  this.ztitle, 'label',
        flags,
        (_binding, from: string | null) => {
          if (from === null) return [false, ''];
          return [true, MakeTitleCompat(from)];
        }, null as unknown as GObject.TClosure<any, any>),
      item.bind_property_full('id', this.zsubtitle, 'label',
        flags,
        (_binding, from: string | null) => {
          if (from === null) return [false, ''];
          return [true, MakeTitleCompat(from)];
        }, null as unknown as GObject.TClosure<any, any>),
      item.bind_property_full('id', this, 'id-gvariant',
        flags,
        (_binding, from: string | null) => {
          if (from === null) return [false, GLib.Variant.new_string('')];
          return [true, GLib.Variant.new_string(from)];
        }, null as unknown as GObject.TClosure<any, any>),
      item.bind_property_full('description', this.zexcerpt, 'label',
        flags,
        (_binding, from: string | null) => {
          if (from === null) return [false, ''];
          return [true, MakeTitleCompat(from.substring(0, 100))];
        }, null as unknown as GObject.TClosure<any, any>),
      item.bind_property('enabled', this.toggle, 'active', flags),
      item.bind_property_full('description', this.description_field, 'label',
        flags,
        (_binding, from: string | null) => {
          if (from === null) return [false, ''];
          return [true, SteamMd2Pango(from)];
        }, null as unknown as GObject.TClosure<any, any>),
      item.bind_property_full('last-update', this.last_update_field, 'label',
        flags,
        (_binding, from: Date | null) => {
          if (from === null) return [false, ''];
          return [true, `${from.toDateString()}`];
        }, null as unknown as GObject.TClosure<any, any>),
    ];
    return {
      bindings,
      signals,
    };
  }
}
