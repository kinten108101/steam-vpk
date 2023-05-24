import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import GObject from 'gi://GObject';
import Adw from 'gi://Adw';

export interface IAddonlistPageItem {
  name: string;
  id: string;
  enabled: boolean;
  description: string;
  last_update: string;
  in_randomizer?: boolean;
}

export class AddonlistPageItem extends GObject.Object {
  public name!: string;
  public id!: string;
  public enabled!: boolean;
  public description!: string;
  public last_update!: string;
  public in_randomizer!: boolean;
  static {
    GObject.registerClass({
      GTypeName: 'AddonlistPageItem',
      Properties: {
        'name': GObject.ParamSpec.string('name', 'name', 'name', GObject.ParamFlags.READWRITE, ''),
        'id': GObject.ParamSpec.string('id', 'id', 'id', GObject.ParamFlags.READWRITE, ''),
        'enabled': GObject.ParamSpec.boolean('enabled', 'enabled', 'enabled', GObject.ParamFlags.READWRITE, true),
        'description': GObject.ParamSpec.string('description', 'description', 'description', GObject.ParamFlags.READWRITE, ''),
        'last_update': GObject.ParamSpec.string('last_update', 'last_update', 'last_update', GObject.ParamFlags.READWRITE, ''),
        'in_randomizer': GObject.ParamSpec.boolean('in_randomizer', 'in_randomizer', 'in_randomizer', GObject.ParamFlags.READWRITE, false),
      }
    }, this);
  }
}

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
  public list_item!: AddonlistPageItem;

  private _toggle!: Gtk.Switch;

  private _description_field!: Gtk.Label;

  private _last_update_field!: Gtk.Label;

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

  #rowFactory(entry: GObject.Object): Gtk.Widget {
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
      'Unknown title',
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
