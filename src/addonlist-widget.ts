import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import GObject from 'gi://GObject';
import Adw from 'gi://Adw';

import { AddonlistPageItem } from './addonlist-model';

export interface SectionManifest {
  title: string;
  model: Gio.ListStore;
}

const AddonlistRow = GObject.registerClass({
  GTypeName: 'AddonlistRow',
  Properties: {
    'list-item': GObject.ParamSpec.object(
      'list-item',
      'List Item',
      'AddonlistItem object',
      GObject.ParamFlags.READWRITE,
      AddonlistPageItem.$gtype),
  },
  // @ts-ignore
  Template: 'resource:///com/github/kinten108101/SteamVpk/ui/addonlist-row.ui',
  InternalChildren: [
    'description_field',
    'last_update_field',
    'toggle',
  ],
}, class extends Adw.ExpanderRow {
  constructor(params={}){
    super(params);
    // TODO: Property binding is one-way
    const listitem: AddonlistPageItem = this.list_item;
    listitem.bind_property('name', this, 'title', GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL);
    listitem.bind_property('id', this, 'subtitle', GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL);
    listitem.bind_property('enabled', this._toggle, 'active', GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL);
    const descriptionField: Gtk.Label = this._description_field;
    listitem.bind_property('description', descriptionField, 'label', GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL);
    const lastUpdateField: Gtk.Label = this._last_update_field;
    listitem.bind_property('last_update', lastUpdateField, 'label', GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL);
  }
});

export class Js_AddonlistSection extends Gtk.Box {
  [x: string]: any;
  constructor(props={}) {
    super(props);
    const model: Gio.ListStore = this.model;
    const section_title: Gtk.Label = this._section_label;
    section_title.label = this.title;
    const section_list: Gtk.ListBox = this._section_list;
    section_list.bind_model(model, this.#rowFactory.bind(this));
  }

  #rowFactory(entry: AddonlistPageItem): Gtk.Widget {
    return new AddonlistRow({
      'list-item': entry,
    });
  }
}

export const AddonlistSection = GObject.registerClass({
  GTypeName: 'AddonlistSection',
  // @ts-ignore
  Template: 'resource:///com/github/kinten108101/SteamVpk/ui/addonlist-section.ui',
  Properties: {
    'title': GObject.ParamSpec.string(
      'title',
      'Title',
      'Title of this section',
      GObject.ParamFlags.READWRITE,
      null,
    ),
    'model': GObject.ParamSpec.object(
      'model',
      'Model',
      'Model for the boxed list',
      GObject.ParamFlags.READWRITE,
      Gio.ListStore.$gtype,
    ),
  },
  InternalChildren: [
    'section_label',
    'section_list',
  ]
}, Js_AddonlistSection);
