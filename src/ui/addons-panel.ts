import GObject from 'gi://GObject';
import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import { bytes2humanreadable } from '../utils/files.js';
import { PreferencesRow } from './sensitizable-widgets.js';

export namespace UsageMeter {
  export type Colors = 'yellow' | 'red';
}

export class UsageMeter extends Gtk.ProgressBar {
  static Colors = ['yellow', 'red'];

  static {
    GObject.registerClass({
      GTypeName: 'StvpkUsageMeter',
    }, this);
  }

  constructor(params = {}) {
    super(params);
    this.connect('notify::fraction', this._update_usage_meter.bind(this));
    this._update_usage_meter();
  }

  _update_usage_meter() {
    const remove_all_except = (except: string) => {
      UsageMeter.Colors.forEach(color => {
        if (color === except) return;
        this.remove_css_class(color);
      });
    };
    if (this.fraction < 0.8) {
      remove_all_except('');
    } else if (this.fraction < 0.9) {
      this.add_css_class('yellow');
      remove_all_except('yellow');
    } else {
      this.add_css_class('red');
      remove_all_except('red');
    }
  }
}

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
      Template: `resource:///com/github/kinten108101/SteamVPK/ui/addons-panel.ui`,
      InternalChildren: [
        'panel',
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

  set stat_enabled(val: boolean) {
    if (val === this._stat_enabled) return;
    this._stat_enabled = val;
    this.notify('stat-enabled');
  }
  get stat_enabled() {
    return this._stat_enabled;
  }

  _panel!: PreferencesRow;
  _real_icon!: Gtk.Image;
  _stat_box!: Gtk.Box;
  _main_row!: Gtk.Label;
  _sub_row!: Gtk.Label;
  _usage_meter!: Gtk.ProgressBar;

  _prev_panel_sensitive: boolean | undefined = undefined;

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
        return [true, (this.size - from)/this.size || 0];
      },
      null as unknown as GObject.TClosure);
    this.bind_property_full('size', this._usage_meter, 'fraction',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: number | null): [boolean, number] => {
        if (from === null) return [false, 0];
        if (this.free > from) return [false, 0];
        return [true, (from - this.free)/from || 0];
      },
      null as unknown as GObject.TClosure);

    this.bind_property('stat-enabled', this._stat_box, 'visible',
      GObject.BindingFlags.SYNC_CREATE);
    this.bind_property('stat-enabled', this._usage_meter, 'visible',
      GObject.BindingFlags.SYNC_CREATE);
    this.connect('notify::stat-enabled', this._update_panel.bind(this));
    this._update_panel();
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

  _update_panel() {
    if (this.stat_enabled === this._prev_panel_sensitive) return;
    this._prev_panel_sensitive = this.stat_enabled;
    if (this.stat_enabled) {
      this._panel.sensitize();
    } else {
      this._panel.insensitize();
    }
    console.debug('stat-enabled:', this.stat_enabled);
    console.debug('semaphore:', this._panel._insensitize_requests);
  }
}
