import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';

export namespace HeaderboxBuildEnums {
  export type TitleType = 'in-progress' | 'done';
  export type ElapsedDisplayMode = 'free' | 'fixed';
  export type TimeUnitWord = 's' | 'ms';
}

export default class HeaderboxBuild extends Gtk.Box {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkHeaderboxBuild',
      Properties: {
        title_type: GObject.ParamSpec.string('title-type', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          <HeaderboxBuildEnums.TitleType>'in-progress'),
        elapsed: GObject.ParamSpec.uint64('elapsed', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          0, Number.MAX_SAFE_INTEGER, 0),
        elapsed_display_mode: GObject.ParamSpec.string('elapsed-display-mode', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          <HeaderboxBuildEnums.ElapsedDisplayMode>'free'),
        status: GObject.ParamSpec.string('status', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
        time_unit_word: GObject.ParamSpec.string('time-unit-word', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          <HeaderboxBuildEnums.TimeUnitWord>'s'),
      },
      Template: 'resource:///com/github/kinten108101/SteamVPK/ui/headerbox-build.ui',
      InternalChildren: [
        'title_label',
        'time_elapsed_field',
        'status_field',
      ],
    }, this);
  }

  title_type!: HeaderboxBuildEnums.TitleType;
  elapsed!: number;
  elapsed_display_mode!: HeaderboxBuildEnums.ElapsedDisplayMode;
  status!: string;
  /** @todo(kinten) Make this private */
  time_unit_word!: HeaderboxBuildEnums.TimeUnitWord;

  _title_label!: Gtk.Label;
  _time_elapsed_field!: Gtk.Label;
  _status_field!: Gtk.Label;

  _should_update: (time: number) => [boolean, number] = (time: number) => [true, time];

  constructor(params = {}) {
    super(params);
    this.bind_property_full('title-type', this._title_label, 'label',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: string | null) => {
        if (from === null) return [false, ''];
        switch (from as HeaderboxBuildEnums.TitleType) {
        case 'in-progress':
          return [true, 'Injection in Progress'];
        case 'done':
          return [true, 'Injection Completed'];
        default:
          throw new Error;
        }
      }, null as unknown as GObject.TClosure);

    this.bind_property_full('elapsed', this._time_elapsed_field, 'label',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: number | null): [boolean, string] => {
        if (from === null)
          return [false, ''];
        const [ready_update, val] = this._should_update(from);
        if (!ready_update)
          return [false, ''];
        switch (this.elapsed_display_mode) {
        case 'free':
          return [true, `${String(val)}${this.time_unit_word}`];
        case 'fixed':
          throw new Error('Not implemented');
        default:
          throw new Error;
        }
      }, null as unknown as GObject.TClosure);

    this.connect('notify::time-unit-word', this._update_time_unit.bind(this));
    this._update_time_unit();

    this.bind_property_full('status', this._status_field, 'label',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: string | null) => {
        if (from === null) return [true, ''];
        return [true, from];
      }, null as unknown as GObject.TClosure);
  }

  _update_time_unit() {
    switch (this.time_unit_word) {
    case 'ms':
      this._should_update = (time: number) => [true, time];
      break;
    case 's':
      this._should_update = (time: number) => {
        if (time % 1000 !== 0) return [false, 0];
        return [true, time / 1000];
      };
      break;
    default:
      throw new Error;
    }
  }
}
