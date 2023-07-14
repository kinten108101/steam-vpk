import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Gio from 'gi://Gio';
import Adw from 'gi://Adw';

import { Config } from './config.js';
import { LateBindee } from './mvc.js';
import { MainWindowContext, Window } from './window.js';
import { AddonStorage } from './addon-storage.js';
import { Addon } from './addons.js';
import { gobjectClass } from './utils/decorator.js';
import * as Markup from './markup.js';

class AddonlistPageItem extends GObject.Object {
  name!: string;

  id!: string;

  enabled!: boolean;

  description!: string;

  last_update!: string;

  in_randomizer!: boolean;

  static {
    GObject.registerClass({
      GTypeName: 'StvpkAddonlistPageItem',
      Properties: {
        'name': GObject.ParamSpec.string('name', 'name', 'name', GObject.ParamFlags.READWRITE, ''),
        'id': GObject.ParamSpec.string('id', 'id', 'id', GObject.ParamFlags.READWRITE, ''),
        'enabled': GObject.ParamSpec.boolean('enabled', 'enabled', 'enabled', GObject.ParamFlags.READWRITE, true),
        'description': GObject.ParamSpec.string('description', 'description', 'description', GObject.ParamFlags.READWRITE, ''),
        'last_update': GObject.ParamSpec.string('last_update', 'last_update', 'last_update', GObject.ParamFlags.READWRITE, ''),
        'in_randomizer': GObject.ParamSpec.boolean('in_randomizer', 'in_randomizer', 'in_randomizer', GObject.ParamFlags.READWRITE, false),
      },
    }, this);
  }
}

export class LaunchpadRow extends Adw.ExpanderRow {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkLaunchpadRow',
      Properties: {
        'itemk': GObject.ParamSpec.object(
          'itemk', 'itemk', 'itemk',
          GObject.ParamFlags.READWRITE,
          AddonlistPageItem.$gtype),
      },
      Template: `resource://${Config.config.app_rdnn}/ui/launchpad-row.ui`,
      Children: [
        'description_field',
        'last_update_field',
        'toggle',
        'seeDetails',
        'removeAddon',
        'moveSection',
      ],
    }, this);
  }

  itemk!: AddonlistPageItem;

  description_field!: Gtk.Label;
  last_update_field!: Gtk.Label;
  toggle!: Gtk.Switch;
  seeDetails!: Gtk.Button;
  removeAddon!: Gtk.Button;

  moveSection!: Gio.Menu;
  moveUp: Gio.MenuItem;
  moveDown: Gio.MenuItem;

  constructor(params: { itemk: AddonlistPageItem } & Adw.ExpanderRow.ConstructorProperties) {
    super(params);
    this.itemk.bind_property('name', this, 'title', GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL);
    this.itemk.bind_property('id', this, 'subtitle', GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL);
    this.itemk.bind_property('enabled', this.toggle, 'active', GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL);
    this.itemk.bind_property('description', this.description_field, 'label', GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL);
    this.itemk.bind_property('last_update', this.last_update_field, 'label', GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL);
    this.moveUp = new Gio.MenuItem();
    this.moveUp.set_label('Move Up');
    this.moveSection.append_item(this.moveUp);
    this.moveDown = new Gio.MenuItem();
    this.moveDown.set_label('Move Down');
    this.moveSection.append_item(this.moveDown);
  }
}

class LaunchpadSection extends Gtk.Box {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkLaunchpadSection',
      Template: `resource://${Config.config.app_rdnn}/ui/launchpad-section.ui`,
      Properties: {
        'model': GObject.ParamSpec.object(
          'model',
          'model',
          'model',
          GObject.ParamFlags.READWRITE,
          Gio.ListStore.$gtype,
        ),
        'title': GObject.ParamSpec.string(
          'title',
          'Title',
          'Title of this section',
          GObject.ParamFlags.READWRITE,
          'Unknown title',
        ),
      },
      InternalChildren: [
        'section_list',
      ],
    }, this);
  }

  model !: Gio.ListStore<AddonlistPageItem>;
  title!: string;

  private _section_list !: Gtk.ListBox;

  constructor(props: { title: string; } & Gtk.Box.ConstructorProperties) {
    super(props);
    this._section_list.bind_model(this.model, this.rowFactory.bind(this));
  }

  rowFactory(val: GObject.Object): Gtk.Widget {
    const _val = val as AddonlistPageItem;
    const row = new LaunchpadRow({
      itemk: _val,
    });
    return row;
  }
}

// View model interface (Interactor)
class ListStore<T extends GObject.Object> extends Gio.ListStore<T> {
  static {
    GObject.registerClass({
      GTypeName: 'ListStore',
      Signals: {
        'state-changed': {},
      },
    }, this);
  }
}

export class AddonlistModel extends ListStore<AddonlistPageItem>
implements LateBindee<MainWindowContext> {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkAddonlistModel',
      Implements: [
        Gio.ListModel,
      ],
    }, this);
  }

  context!: MainWindowContext;

  constructor() {
    super({
      item_type: AddonlistPageItem.$gtype,
    });
  }

  onBind(context: MainWindowContext) {
    this.context = context;
    //context.application.addonStorage.connect(AddonStorage.Signals.storage_changed, this.updateModel);
    context.application.addonStorage.connect(AddonStorage.Signals.addons_changed, this.updateModel);
    context.application.addonStorage.connect(AddonStorage.Signals.loadorder_changed, this.updateModel);
    context.application.addonStorage.connect(AddonStorage.Signals.loadorder_order_changed, this.updateModel);
    context.main_window.connect(Window.Signals.first_flush, this.updateModel);
    //context.main_window.connect('notify::current-profile', this.updateModel);
    /*
    context.addonManager.connect(AddonManager.Signals.DATA_RELOADED, () => {
      const loaderstore = context.addonManager.getAddonFilterList();
      const datastore = context.addonManager.getAddonDataList();
      const list = this.makePageItems(loaderstore, datastore);
      this.changeState(list);
    });
    */
  }

  updateModel = () => {
    const arr: AddonlistPageItem[] = [];
    const loadorder: Addon[] = (() => {
      if (this.context.main_window.currentProfile !== null) {
        return this.context.main_window.currentProfile.adapt_loadorder(this.context.application.addonStorage.idmap) as Addon[];
      }
      const draft: Addon[] = [];
      this.context.application.addonStorage.loadorder.forEach(x => {
        const addon = this.context.application.addonStorage.get(x);
        if (addon === undefined) return;
        draft.push(addon);
      });
      return draft;
    })();
    if (loadorder.length === 0) {
      return;
    }
    loadorder.forEach(x => {
      const newItem = this.factory(x);
      arr.push(newItem);
    });
    this.changeState(arr);
  }

  factory(addon: Addon): AddonlistPageItem {
    const session = this.context.main_window;
    return new AddonlistPageItem({
      name: addon.title || '',
      id: addon.vanityId || '',
      enabled: (() => {
              if (session.currentProfile?.activelist?.has(addon.vanityId)) return true;
              return false;
            })(),
      description: Markup.SteamMd2Pango(addon.description || ''),
      last_update: (() => {
                const date = addon?.timeUpdated;
                if (date === undefined) return '';
                const display = `${date.toDateString()} @ ${date.toLocaleTimeString()}`;
                return display;
              })(),
      in_randomizer: false,
    })
  }

  // TODO(kinten): Unless we do diffing, there is no difference between a BST and an array if we'll just refill content every thing. So for now, use an array
  arrStorage?: AddonlistPageItem[] = [];

  /*
  changeState(col: AddonlistPageItem[]) {
    this.remove_all();
    col.forEach(x => {
      this.append(x);
    });
    this.emit('state-changed');
  }
  */

  changeState(col: AddonlistPageItem[]) {
    delete this.arrStorage;
    this.arrStorage = col;
    this.emit('state-changed');
  }

  vfunc_get_n_items(): number {
    return this.arrStorage?.length || 0;
  }

  vfunc_get_item(position: number): AddonlistPageItem | null {
    const val = this.arrStorage?.[position];
    if (val === undefined) {
      return null;
    }
    return val;
  }
}

@gobjectClass({
  Template: `resource://${Config.config.app_rdnn}/ui/launchpad-page.ui`,
  Children: [ 'contentArea', 'enable-addon' ],
})
export class LaunchpadPage extends Gtk.Box implements LateBindee<MainWindowContext> {
  model: AddonlistModel;
  contentArea!: Gtk.Box;
  enable_addon!: Gtk.Switch;
  private _listSections: LaunchpadSection[] = [];

  constructor(params = {}) {
    super(params);
    this.model = new AddonlistModel();
    try {
      this._listSections.push(new LaunchpadSection({
        title: 'Default Box',
      }));
      this._listSections[0]?.set_parent(this.contentArea);
      this._listSections.push(new LaunchpadSection({
        title: 'Mixins',
      }));
      this._listSections[1]?.set_parent(this.contentArea);

      this.model.connect('state-changed', () => {
        this._refreshAll();
      });
    } catch (error) {
      // @ts-ignore
      logError(error);
    }
  }

  onBind(source: MainWindowContext): void {
    source.application.addonStorage.connect(AddonStorage.Signals.addons_enabled_changed, () => {
      const val = source.application.addonStorage.get_addons_enabled();
      this._listSections.forEach(x => {
        x.set_sensitive(val);
      })
    });
    this.enable_addon.set_active(source.application.addonStorage.get_addons_enabled());
  }

  _refreshAll() {
    this._listSections[0]?.model.remove_all();
    this._listSections[1]?.model.remove_all();
    for (let i = 0; i < this.model.get_n_items(); i++) {
      const addon: AddonlistPageItem | null = this.model.get_item(i) as unknown as AddonlistPageItem;
      if (addon === null) {
        continue;
      }
      if (addon.in_randomizer) {
        this._listSections[1]?.model.append(addon);
      } else {
        this._listSections[0]?.model.append(addon);
      }
    }

    if (this._listSections[0]?.model.get_n_items()) {
      this._listSections[0]?.set_visible(true);
    } else {
      this._listSections[0]?.set_visible(false);
    }
    if (this._listSections[1]?.model.get_n_items()) {
      this._listSections[1]?.set_visible(true);
    } else {
      this._listSections[1]?.set_visible(false);
    }

  }
}
