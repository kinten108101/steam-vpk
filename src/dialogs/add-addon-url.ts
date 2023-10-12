import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import SpinningButton from '../ui/spinning-button.js';
import { MakeTitleCompat } from '../utils/markup.js';
import { AsyncSignalMethods, addAsyncSignalMethods } from '../utils/async-signals.js';
import { bytes2humanreadable } from '../utils/files.js';
import { vardict_make } from '../steam-vpk-utils/utils.js';

type Signals = 'input-page::setup' | 'validate' | 'preview-page::setup';

export class PreviewDownload extends Gtk.Box {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkPreviewDownload',
      Properties: {
        name_request: GObject.ParamSpec.string(
          'name-request', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
        creator_request: GObject.ParamSpec.string(
          'creator-request', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
        excerpt_request: GObject.ParamSpec.string(
          'excerpt-request', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
        size_request: GObject.ParamSpec.uint64(
          'size-request', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          0, Number.MAX_SAFE_INTEGER,
          0),
        loading: GObject.ParamSpec.boolean(
          'loading', '', '',
          GObject.ParamFlags.READABLE,
          false),
      },
      Template: 'resource:///com/github/kinten108101/SteamVPK/ui/add-addon-url-preview-download.ui',
      Children: [
        'retry_button',
      ],
      InternalChildren: [
        'addon_name',
        'creator',
        'excerpt',
        'size',
        'download_button',
      ],
    }, this);
  }

  name_request!: string;
  creator_request!: string;
  excerpt_request!: string;
  size_request!: number;

  _loading!: boolean;
  get loading() {
    return this._loading;
  }
  _set_loading(val: boolean) {
    if (this._loading === val) return;
    this._loading = val;
    this.notify('loading');
  }

  retry_button!: Gtk.Button;

  _addon_name!: Gtk.Label;
  _creator!: Gtk.Label;
  _excerpt!: Gtk.Label;
  _size!: Gtk.Label;
  _download_button!: SpinningButton;

  _options: {
    test_prop?: number;
  } = {};
  _session: string | null = null;
  _set_session(val: string) {
    this._session = val;
  }

  constructor(params = {}) {
    super(params);
    const flags = GObject.BindingFlags.SYNC_CREATE;
    (<[string, GObject.Object, string][]>
    [
      ['name-request', this._addon_name, 'label'],
      ['creator-request', this._creator, 'label'],
      ['excerpt-request', this._excerpt, 'label'],
    ]).forEach(([src_prop, tgt, tgt_prop]) => {
      this.bind_property(src_prop, tgt, tgt_prop, flags);
    });
    this.bind_property_full('name-request', this._addon_name, 'label', flags,
      (_binding, from: any) => {
        if (typeof from !== 'string') return [false, ''];
        return [true, MakeTitleCompat(from)];
      },
      null as unknown as GObject.TClosure<any, any>);
    this.bind_property_full('size-request', this._size, 'label', flags,
      (_binding, from: any) => {
        if (typeof from !== 'number') return [false, ''];
        if (from === 0) return [false, 'Unknown size'];
        return [true, bytes2humanreadable(from)];
      },
      null as unknown as GObject.TClosure<any, any>);

    this.connect('notify::loading', this._update_loading.bind(this));
    this._update_loading();

    this._update_options();
  }

  _update_download_actionable() {
    if (this._session === null) throw new Error;
    const options = vardict_make({
      test_prop: (() => {
        const val = this._options.test_prop;
        if (val === undefined) return null;
        return GLib.Variant.new_uint64(val);
      })(),
    });
    this._download_button.set_action_target_value(GLib.Variant.new_tuple(
      [ GLib.Variant.new_string(this._session),
        options,
      ]
    ));
  }

  _update_options() {

  }

  _update_loading() {
    this._download_button.is_spinning = this._loading;
  }
}

export interface InputUrl {
  connect(signal: 'notify::loading', callback: (obj: this, pspec: GObject.ParamSpec) => void): number;
  notify(signal: 'loading'): void;
  notify(signal: 'error'): void;
  notify(signal: 'error-responded'): void;
  /* inherit */
  connect(signal: string, callback: (obj: this, ...args: any[]) => void): number;
  emit(signal: string): void;
}

export class InputUrl extends Gtk.Box {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkInputUrl',
      Properties: {
        error: GObject.ParamSpec.string(
          'error', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          ''),
        error_responded: GObject.ParamSpec.boolean(
          'error-responded', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          true),
        loading: GObject.ParamSpec.boolean(
          'loading', '', '',
          GObject.ParamFlags.READABLE,
          false),
      },
      Template: 'resource:///com/github/kinten108101/SteamVPK/ui/add-addon-url-input-url.ui',
      Children: [
        'url_bar',
      ],
      InternalChildren: [
        'validate_button',
        'msg',
      ],
    }, this);
  }

  _error!: string;
  get error() {
    return this._error;
  }
  set error(val: string) {
    if (this._error === val) return;
    this._error = val;
    this.notify('error');
  }

  _error_responded!: boolean;
  get error_responded() {
    return this._error_responded;
  }
  set error_responded(val: boolean) {
    if (this._error_responded === val) return;
    this._error_responded = val;
    this.notify('error-responded');
  }

  _loading!: boolean;
  get loading() {
    return this._loading;
  }
  _set_loading(val: boolean) {
    if (this._loading === val) return;
    this._loading = val;
    this.notify('loading');
  }

  url_bar!: Adw.EntryRow;

  _validate_button!: SpinningButton;
  _msg!: Gtk.Label;

  constructor(params = {}) {
    super(params);
    this._setup_actionables();
    this._setup_error_state();
    this._setup_loading();
  }

  _setup_loading() {
    this.connect('notify::loading', this._update_loading.bind(this));
    this._update_loading();
  }

  _update_loading() {
    this._validate_button.is_spinning = this._loading;
  }

  _setup_actionables() {
    this.url_bar.bind_property_full(
      'text', this._validate_button, 'action-target',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: string | null) => {
        if (from === null) return [true, GLib.Variant.new_string('')];
        return [true, GLib.Variant.new_string(from)];
      },
      null as unknown as GObject.TClosure<any, any>);
  }

  _setup_error_state() {
    this.connect('notify::error-responded', this._update_error_responded.bind(this));
    this.connect('notify::error', () => {
      if (this.error === '') return;
      this.error_responded = false;
    });
    this.url_bar.connect('notify::text', () => {
      this.error_responded = true;
    });
    this.connect('notify::error', this._update_error_state.bind(this));
  }

  _update_error_state() {
    if (this.error === '') {
      this.url_bar.remove_css_class('error');
      this._msg.set_label('');
    } else {
      this.url_bar.add_css_class('error');
      this._msg.set_label(this.error);
    }
  }

  _update_error_responded() {
    if (this.error_responded) {
      this._validate_button.sensitize();
    } else {
      this._validate_button.insensitize();
    }
  }

  set_url(val: string) {
    this.url_bar.set_text(val);
    this.url_bar.grab_focus();
  }

  set_error(msg: string) {
    this.error = msg;
  }

  resolve_error() {
    this.error = '';
  }
}

export default interface AddAddonUrl extends AsyncSignalMethods<Signals> {
  connect_signal(signal: 'input-page::setup', cb: (obj: this, input_page: InputUrl) => Promise<boolean>): (obj: this, input_page: InputUrl) => Promise<boolean>;
  connect_signal(signal: 'validate', cb: (obj: this, request_error: (msg: string | undefined) => void, url: string) => Promise<boolean>): (obj: this, url: GLib.Uri) => Promise<boolean>;
  connect_signal(signal: 'preview-page::setup', cb: (obj: this, url: string, preview_page: PreviewDownload) => Promise<boolean>): (obj: this, url: GLib.Uri) => Promise<boolean>;
  connect_signal(signal: 'download', cb: (obj: this, request_error: (msg: string | undefined) => void, url: string, config: any) => Promise<boolean>): Function;
  _emit_signal(signal: 'input-page::setup', input_page: InputUrl): Promise<boolean>;
  _emit_signal(signal: 'validate', request_error: (msg: string | undefined) => void, url: string): Promise<boolean>;
  _emit_signal(signal: 'preview-page::setup', url: string, preview_page: PreviewDownload): Promise<boolean>;
  _emit_signal(signal: 'download', request_error: (msg: string | undefined) => void, url: string, config: any): Promise<boolean>;
}
export default class AddAddonUrl extends Adw.Window {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkAddAddonUrl',
      Template: 'resource:///com/github/kinten108101/SteamVPK/ui/add-addon-url.ui',
      Children: [
        'input_url',
        'preview_download',
      ],
      InternalChildren: [
        'view_stack',
      ],
    }, this);
    addAsyncSignalMethods<Signals>(this.prototype);
  }

  _view_stack!: Gtk.Stack;

  preview_download!: PreviewDownload;
  input_url!: InputUrl;

  constructor(params: Adw.Window.ConstructorProperties = {}) {
    super(params);
    const actions = new Gio.SimpleActionGroup();

    const validate = new Gio.SimpleAction({
      name: 'validate',
      parameter_type: GLib.VariantType.new('s'),
    });
    validate.connect('activate', (_action, parameter) => {
      if (parameter === null) throw new Error;
      const [url] = parameter.get_string();
      if (url === null) throw new Error('Entry text is null');
      this._on_validate(url);
    });
    actions.add_action(validate);

    const retry = new Gio.SimpleAction({
      name: 'retry',
    });
    retry.connect('activate', () => {
      this._on_retry();
    });
    actions.add_action(retry);

    const download = new Gio.SimpleAction({
      name: 'download',
      parameter_type: GLib.VariantType.new('(sa{sv})'),
    });
    download.connect('activate', (_action, parameter) => {
      if (parameter === null) throw new Error;
      const val: unknown = parameter.recursiveUnpack();
      if (!Array.isArray(val)) throw new Error;
      if (val.length != 2) throw new Error;
      if (typeof val[0] != 'string') throw new Error;
      if (typeof val[1] != 'object') throw new Error;
      this._on_download(...<[string, object]>val);
    });
    actions.add_action(download);

    this.insert_action_group('add-addon-url', actions);

    this.connect_signal('preview-page::setup', async (_obj, _url, preview_page) => {
      preview_page._update_download_actionable();
      return true;
    });
  }

  vfunc_realize(): void {
    super.vfunc_realize();
    this._emit_signal('input-page::setup', this.input_url).catch(error => logError(error));
  }

  _on_retry() {
    this._view_stack.set_visible_child_name('input-url');
  }

  _on_validate(url: string) {
    const on_exit = () => {
      this.input_url._set_loading(false);
    };
    (async () => {
      this.input_url._set_loading(true);
      this.input_url.resolve_error();
      const request_error = (hint?: string) => {
        this.input_url.set_error(hint || 'An error has occured.');
      };
      let result = await this._emit_signal('validate', request_error, url);
      if (result === false) {
        on_exit();
        return;
      }
      this.preview_download._set_session(url);
      result = await this._emit_signal('preview-page::setup', url, this.preview_download);
      if (result === false) {
        on_exit();
        return;
      }
      this._view_stack.set_visible_child_name('preview-download');
    })().finally(() => {
      on_exit();
    });
  }

  _on_download(url: string, config: any) {
    const on_exit = () => {
      this.preview_download._set_loading(false);
    };
    (async () => {
      this.preview_download._set_loading(true);
      function request_error(msg?: string) {
        console.log('request-error:', msg);
      }
      const result = await this._emit_signal('download', request_error, url, config);
      if (!result) {
        on_exit();
        return;
      }
      this.close();
    })().catch(logError)
      .finally(() => {
        on_exit();
      });
  }
}


