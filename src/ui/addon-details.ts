import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import { APP_RDNN } from '../utils/const.js';
import { bytes2humanreadable } from '../utils/files.js';
import { FieldRow } from './field-row.js';
import ArchiveList from './addon-details/archive-list.js';
import { ActionRow } from './sensitizable-widgets.js';

export default class AddonDetails extends Gtk.Box {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkAddonDetails',
      Properties: {
        name: GObject.ParamSpec.string(
          'name', 'Name', 'Name of add-on item',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
        creator: GObject.ParamSpec.string(
          'creator', 'Creator', 'Creator (single) of add-on item',
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
        steamid: GObject.ParamSpec.string(
          'steamid', 'Steam ID', 'Published File ID of upstream (Steam Workshop) add-on item',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
        steamid_gvariant: GObject.param_spec_variant(
          'steamid-gvariant', '', '',
          GLib.VariantType.new('s'), null,
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT),
        steamurl: GObject.ParamSpec.string(
          'steamurl', 'Steam URL', 'URL to upstream (Steam Workshop) add-on item',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
        steamurl_gvariant: GObject.param_spec_variant(
          'steamurl-gvariant', '', '',
          GLib.VariantType.new('s'), null,
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT),
        subdir: GObject.ParamSpec.string(
          'subdir', 'Subdirectory', 'Path to add-on item folder',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
        subdir_gvariant: GObject.param_spec_variant(
          'subdir-gvariant', '', '',
          GLib.VariantType.new('s'), null,
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT),
        remote: GObject.ParamSpec.boolean(
          'remote', 'Remote', 'Whether or not the add-on was cloned from upstream',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          false),
        used: GObject.ParamSpec.uint64(
          'used', 'Used', 'Disk space that this add-on folder used',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          0, Number.MAX_SAFE_INTEGER,
          0),
      },
      Template: `resource://${APP_RDNN}/ui/addon-details.ui`,
      Children: [
        'archive_list',
      ],
      InternalChildren: [
        'wintitle_full',
        'headerbar_stack',
        'scroller',
        'title',
        'subtitle',
        'used_label',
        'stvpkid_row',
        'steamid_row',
        'visit_workshop_row',
        'visit_subdir_row',
      ],
    }, this);
  }

  name!: string | null;
  creator!: string | null;
  id!: string | null;
  id_gvariant!: GLib.Variant | null;
  steamid!: string | null;
  steamid_gvariant!: GLib.Variant | null;
  steamurl!: string | null;
  steamurl_gvariant!: GLib.Variant | null;
  subdir!: string | null;
  subdir_gvariant!: GLib.Variant | null;
  remote!: boolean;
  used!: number;

  archive_list!: ArchiveList;

  _wintitle_full!: Adw.WindowTitle;
  _headerbar_stack!: Gtk.Stack;
  _scroller!: Gtk.ScrolledWindow;
  _title!: Gtk.Label;
  _subtitle!: Gtk.Label;
  _used_label!: Gtk.Label;
  _stvpkid_row!: FieldRow;
  _steamid_row!: FieldRow;
  _visit_workshop_row!: ActionRow;
  _visit_subdir_row!: ActionRow;

  _scroller_vadj: Gtk.Adjustment;
  _dwt_bindings: (GObject.Binding | number)[] = [];

  constructor(params = {}) {
    super(params);
    this._setup_gvariants();

    this._scroller_vadj = this._scroller.get_vadjustment();
    this._setup_panel();
    this._setup_remote();
    this._setup_dynamic_window_title();
    this._setup_usage();
    this._setup_keys();
    this._setup_link_rows();
  }

  _setup_gvariants() {
    this.bind_property_full('id', this, 'id-gvariant',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: string | null): [boolean, GLib.Variant] => {
        if (from === null) return [true, GLib.Variant.new_string('')];
        return [true, GLib.Variant.new_string(from)];
      },
      null as unknown as GObject.TClosure);

    this.bind_property_full('steamid', this, 'steamid-gvariant',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: string | null): [boolean, GLib.Variant] => {
        if (from === null) return [true, GLib.Variant.new_string('')];
        return [true, GLib.Variant.new_string(from)];
      },
      null as unknown as GObject.TClosure);

    this.bind_property_full('steamurl', this, 'steamurl-gvariant',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: string | null): [boolean, GLib.Variant] => {
        if (from === null) return [true, GLib.Variant.new_string('')];
        return [true, GLib.Variant.new_string(from)];
      },
      null as unknown as GObject.TClosure);

    this.bind_property_full('subdir', this, 'subdir-gvariant',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: string | null): [boolean, GLib.Variant] => {
        if (from === null) return [true, GLib.Variant.new_string('')];
        return [true, GLib.Variant.new_string(from)];
      },
      null as unknown as GObject.TClosure);
  }

  _setup_panel() {
    this.bind_property_full('name', this._title, 'label',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: string | null): [boolean, string] => {
        if (from === null) return [true, 'No Title'];
        return [true, from];
      },
      null as unknown as GObject.TClosure);
    this.bind_property_full('creator', this._subtitle, 'label',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: string | null): [boolean, string] => {
        if (from === null) return [true, 'Unknown Creator'];
        return [true, from];
      },
      null as unknown as GObject.TClosure);
  }

  _setup_remote() {
    let prev_remote: boolean;
    const update_remote = () => {
      if (this.remote === prev_remote) return;
      prev_remote = this.remote;
      if (this.remote) {
        this._steamid_row.make_visible();
        this._visit_workshop_row.make_visible();
      } else {
        this._steamid_row.make_invisible();
        this._visit_workshop_row.make_invisible();
      }
    };
    this.connect('notify::remote', update_remote);
    update_remote();
  }

  _setup_dynamic_window_title() {
    const using_name = this.bind_property_full('name', this._wintitle_full, 'title',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: string | null): [boolean, string] => {
        if (from === null) return [true, 'No Title'];
        return [true, from];
      },
      null as unknown as GObject.TClosure);
    this._dwt_bindings.push(using_name);

    let show_full_prev = false;
    const using_vadj = this._scroller_vadj.connect('value-changed', (obj) => {
      const show_full = obj.get_value() > 80;
      if (show_full_prev === show_full) return;
      if (show_full) {
        this._headerbar_stack.set_visible_child_name('full');
      } else {
        this._headerbar_stack.set_visible_child_name('flat');
      }
      show_full_prev = show_full;
    });
    this._dwt_bindings.push(using_vadj);
  }

  _setup_usage() {
    this.bind_property_full('used', this._used_label, 'label',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: number): [boolean, string] => {
        return [true, `${bytes2humanreadable(from)} Used`];
      },
      null as unknown as GObject.TClosure);
  }

  _setup_keys() {
    this.bind_property('id', this._stvpkid_row, 'value',
      GObject.BindingFlags.SYNC_CREATE);

    let prev_stvpkid_nonnull: boolean | undefined = undefined;
    const update_stvpkid = () => {
      const val = this.id !== null;
      if (val === prev_stvpkid_nonnull) return;
      prev_stvpkid_nonnull = val;
      if (val === null) this._stvpkid_row.make_invisible();
      else this._stvpkid_row.make_visible();
    };
    this.connect('notify::stvpkid', update_stvpkid);
    update_stvpkid();

    this.bind_property('steamid', this._steamid_row, 'value',
      GObject.BindingFlags.SYNC_CREATE);

    let prev_steamid_nonnull: boolean | undefined = undefined;
    const update_steamid = () => {
      const val = this.steamid !== null;
      if (val === prev_steamid_nonnull) return;
      prev_steamid_nonnull = val;
      if (!val) this._steamid_row.make_invisible();
      else this._steamid_row.make_visible();
      console.debug('steamid_nonnull:', val);
      console.debug('requests:', this._steamid_row._invisible_requests);
    };
    this.connect('notify::steamid', update_steamid);
    update_steamid();
  }

  _setup_link_rows() {
    let prev_steamurl_nonnull: boolean | undefined = undefined;
    const update_steamurl = () => {
      const val = this.steamurl !== null;
      if (val === prev_steamurl_nonnull) return;
      prev_steamurl_nonnull = val;
      if (this.steamurl === null) this._visit_workshop_row.make_invisible();
      else this._visit_workshop_row.make_visible();
    };
    this.connect('notify::steamurl', update_steamurl);
    update_steamurl();

    let prev_subdir_nonnull: boolean | undefined = undefined;
    const update_subdir = () => {
      const val = this.subdir !== null;
      if (val === prev_subdir_nonnull) return;
      prev_subdir_nonnull = val;
      if (this.subdir === null) this._visit_subdir_row.make_invisible();
      else this._visit_subdir_row.make_visible();
    };
    this.connect('notify::subdir', update_subdir);
    update_subdir();
  }
}
