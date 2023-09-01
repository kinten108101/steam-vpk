import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import {
  GtkInternalChildren,
  GtkChildren,
  GtkTemplate,
  registerClass,
  param_spec_string,
} from '../steam-vpk-utils/utils.js';
import { APP_RDNN } from '../const.js';
import SpinningButton from '../spinning-button.js';
import { bytes2humanreadable } from '../steam-vpk-utils/files.js';
import { MakeTitleCompat } from '../markup.js';
import { AsyncSignalMethods, addAsyncSignalMethods } from './async-signals.js';

type Signals = 'input-page::setup' | 'validate' | 'preview-page::setup';

export class PreviewDownload extends Gtk.Box {
  static [GObject.properties] = {
    name_request: param_spec_string({ name: 'name-request' }),
    creator_request: param_spec_string({ name: 'creator-request' }),
    excerpt_request: param_spec_string({ name: 'excerpt-request' }),
    size_request: GObject.ParamSpec.uint64('size-request', '', '', GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT, 0, Number.MAX_SAFE_INTEGER, 0),
  };

  static [GtkTemplate] = `resource://${APP_RDNN}/ui/add-addon-url-preview-download.ui`;
  static [GtkChildren] = [
    'retry_button',
  ];
  static [GtkInternalChildren] = [
    'addon_name',
    'creator',
    'excerpt',
    'size',
  ];

  static {
    registerClass({}, this);
  }

  _addon_name!: Gtk.Label;
  _creator!: Gtk.Label;
  _excerpt!: Gtk.Label;
  _size!: Gtk.Label;

  name_request!: string;
  creator_request!: string;
  excerpt_request!: string;
  size_request!: number;
  retry_button!: Gtk.Button;

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
  }
}

export class InputUrl extends Gtk.Box {
  static [GObject.properties] = {
    error: param_spec_string({ name: 'error', flags: GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT }),
  };
  static [GtkTemplate] = `resource://${APP_RDNN}/ui/add-addon-url-input-url.ui`;
  static [GtkChildren] = [
    'url_bar',
    'validate_button',
  ];

  static {
    registerClass({}, this);
  }

  url_bar!: Adw.EntryRow;
  validate_button!: SpinningButton;
  error!: string;
  _last_error: string = '';

  constructor(params = {}) {
    super(params);
    this.url_bar.bind_property_full(
      'text', this.validate_button, 'action-target',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: string | null) => {
        if (from === null) return [true, GLib.Variant.new_string('')];
        return [true, GLib.Variant.new_string(from)];
      },
      null as unknown as GObject.TClosure<any, any>);
    this._setup_error_state();
  }

  _setup_error_state() {
    this._update_error_state();
    this.connect('notify::error', this._update_error_state.bind(this));
    this.url_bar.connect('notify::text', () => {
      this.error = '';
    });
  }

  _update_error_state() {
    if (this.error === this._last_error) return;
    this._last_error = this.error;
    if (this.error === '') {
      this.url_bar.remove_css_class('error');
      this.validate_button.sensitize();
    } else {
      this.url_bar.add_css_class('error');
      this.validate_button.insensitize();
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

export default interface AddAddonUrl {
  connect_signal(signal: 'input-page::setup', cb: (obj: this, input_page: InputUrl) => Promise<boolean>): (obj: this, input_page: InputUrl) => Promise<boolean>;
  connect_signal(signal: 'validate', cb: (obj: this, request_error: (msg: string) => void, url: string) => Promise<boolean>): (obj: this, url: GLib.Uri) => Promise<boolean>;
  connect_signal(signal: 'preview-page::setup', cb: (obj: this, url: string, preview_page: PreviewDownload) => Promise<boolean>): (obj: this, url: GLib.Uri) => Promise<boolean>;
  _emit_signal(signal: 'input-page::setup', input_page: InputUrl): Promise<boolean>;
  _emit_signal(signal: 'validate', request_error: (msg: string) => void, url: string): Promise<boolean>;
  _emit_signal(signal: 'preview-page::setup', url: string, preview_page: PreviewDownload): Promise<boolean>;
}
export default class AddAddonUrl extends Adw.Window {
  static [GtkTemplate] = `resource://${APP_RDNN}/ui/add-addon-url.ui`;
  static [GtkInternalChildren] = [
    'view_stack',
  ];
  static [GtkChildren] = [
    'input_url',
    'preview_download',
  ];

  static {
    registerClass({}, this);
    addAsyncSignalMethods<Signals>(this.prototype);
  }

  _view_stack!: Gtk.Stack;

  preview_download!: PreviewDownload;
  input_url!: InputUrl;

  constructor(params: Adw.Window.ConstructorProperties = {}) {
    super(params);
    this._setup_actions();
  }

  vfunc_realize(): void {
    super.vfunc_realize();
    this._emit_signal('input-page::setup', this.input_url).catch(error => logError(error));
  }

  _setup_actions() {
    const actions = new Gio.SimpleActionGroup();

    const validate = new Gio.SimpleAction({
      name: 'validate',
      parameter_type: GLib.VariantType.new('s'),
    });
    validate.connect('activate', (_action, parameter) => {
      if (parameter === null) throw new Error;
      const [url] = parameter.get_string();
      if (url === null) throw new Error('Entry text is null');
      this.on_validate(url);
    });
    actions.add_action(validate);

    const retry = new Gio.SimpleAction({
      name: 'retry',
    });
    retry.connect('activate', () => {
      this.on_retry();
    });
    actions.add_action(retry);

    this.insert_action_group('add-addon-url', actions);
  }

  vfunc_constructed(): void {
    super.vfunc_constructed();

  }

  on_retry() {
    this._view_stack.set_visible_child_name('input-url');
  }

  on_validate(url: string) {
    const on_exit = () => {
      this.input_url.validate_button.is_spinning = false;
    };
    (async () => {
      this.input_url.validate_button.is_spinning = true;
      const request_error = (hint: string) => {
        this.input_url.set_error(hint);
      };
      const result = await this._emit_signal('validate', request_error, url);
      if (result === false) {
        // error
        on_exit();
        return;
      }
      await this._emit_signal('preview-page::setup', url, this.preview_download);
      this._view_stack.set_visible_child_name('preview-download');
    })().finally(() => {
      on_exit();
    });
  }
}


