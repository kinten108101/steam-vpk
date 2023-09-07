import GObject from 'gi://GObject';
import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import { APP_RDNN } from '../utils/const.js';
import TypedBuilder from '../utils/typed-builder.js';
import { FieldRow } from './field-row.js';
import { bytes2humanreadable } from '../steam-vpk-utils/files.js';

export default class AddonsPanel extends Adw.PreferencesGroup {
  static [GObject.properties] = {
    icon_name: GObject.ParamSpec.string('icon-name', '', '',
      GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
      null),
    usage: GObject.ParamSpec.uint64('usage', '', '',
      GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
      0, Number.MAX_SAFE_INTEGER,
      0),
    free: GObject.ParamSpec.uint64('free', '', '',
      GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
      0, Number.MAX_SAFE_INTEGER,
      0),
    size: GObject.ParamSpec.uint64('size', '', '',
      GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
      0, Number.MAX_SAFE_INTEGER,
      0),
    stat_enabled: GObject.ParamSpec.boolean('stat-enabled', '', '',
      GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
      false),
  };

  static {
    GObject.registerClass({
      GTypeName: 'StvpkAddonsPanel',
      Template: `resource://${APP_RDNN}/ui/addons-panel.ui`,
      InternalChildren: [
        'real_icon',
        'stat_box',
        'main_row',
        'sub_row',
        'usage_meter',
      ],
    }, this);
  }

  icon_name!: string;
  usage!: number;
  free!: number;
  size!: number;
  _stat_enabled!: boolean;

  _stat_disable_semaphore: number = 0;
  set stat_enabled(val: boolean) {
    if (val) {
      this._stat_disable_semaphore--;
    } else {
      this._stat_disable_semaphore++;
    }
    const newval = this._stat_disable_semaphore <= 0;
    if (newval === this._stat_enabled) return;
    this._stat_enabled = newval;
    this.notify('stat-enabled');
  }
  get stat_enabled() {
    return this._stat_enabled;
  }

  _real_icon!: Gtk.Image;
  _stat_box!: Gtk.Box;
  _main_row!: Gtk.Label;
  _sub_row!: Gtk.Label;
  _usage_meter!: Gtk.ProgressBar;

  constructor(params = {}) {
    super(params);
    this._setup_usage();
    this._setup_icon();
  }

  _setup_usage() {
    this.bind_property_full('usage', this._main_row, 'label',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: number | null): [boolean, string] => {
        if (from === null) return [false, ''];
        return [true, ``];
      },
      null as unknown as GObject.TClosure);
    this.bind_property_full('free', this._sub_row, 'label',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: number | null): [boolean, string] => {
        if (from === null) return [false, ''];
        return [true, `${bytes2humanreadable(from)} Available`];
      },
      null as unknown as GObject.TClosure);

    this.bind_property_full('free', this._usage_meter, 'fraction',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: number | null): [boolean, number] => {
        if (from === null) return [false, 0];
        if (from > this.size) return [false, 0];
        return [true, (this.size - from)/this.size];
      },
      null as unknown as GObject.TClosure);
    this.bind_property_full('size', this._usage_meter, 'fraction',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: number | null): [boolean, number] => {
        if (from === null) return [false, 0];
        if (this.free > from) return [false, 0];
        return [true, (from - this.free)/from];
      },
      null as unknown as GObject.TClosure);

    this.bind_property('stat-enabled', this._stat_box, 'visible',
      GObject.BindingFlags.SYNC_CREATE);
    this.bind_property('stat-enabled', this._usage_meter, 'visible',
      GObject.BindingFlags.SYNC_CREATE);
  }

  _setup_icon() {
    this.bind_property_full('icon-name', this._real_icon, 'icon-name',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: string | null): [boolean, string] => {
        if (from === null) return [false, ''];
        return [true, from];
      },
      null as unknown as GObject.TClosure);
  }
}

export function
AddonsPanelDiskPage(
{
  leaflet,
}:
{
  leaflet: Adw.Leaflet;
}
) {
  const builder = new TypedBuilder();
  builder.add_from_resource(`${APP_RDNN}/ui/addons-panel-disk.ui`);
  const page = builder.get_typed_object<Gtk.Box>('page');
  const page_slot = leaflet.get_child_by_name('addons-panel-disk-page') as Adw.Bin;
  page_slot.child = page;

  const current_allocation = builder.get_typed_object<FieldRow>('current-allocation');
  const updateCurrentAllocation = () => {
    const val = '108.101 B';
    current_allocation.set_value(val);
  };
  updateCurrentAllocation();
}
