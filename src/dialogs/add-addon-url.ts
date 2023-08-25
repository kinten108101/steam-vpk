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

type Signals = 'validate' | 'preview-page::setup';

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

export default interface AddAddonUrl {
  connect_signal(signal: 'validate', cb: (obj: this, request_error: (msg: string) => void, url: string) => Promise<boolean>): (obj: this, url: GLib.Uri) => Promise<boolean>;
  connect_signal(signal: 'preview-page::setup', cb: (obj: this, url: string, preview_page: PreviewDownload) => Promise<boolean>): (obj: this, url: GLib.Uri) => Promise<boolean>;
  _emit_signal(signal: 'validate', request_error: (msg: string) => void, url: string): Promise<boolean>;
  _emit_signal(signal: 'preview-page::setup', url: string, preview_page: PreviewDownload): Promise<boolean>;
}
export default class AddAddonUrl extends Adw.Window {
  static [GtkTemplate] = `resource://${APP_RDNN}/ui/add-addon-url.ui`;
  static [GtkInternalChildren] = [
    'url_bar',
    'validate_button',
    'view_stack',
  ];
  static [GtkChildren] = [
    'preview_download',
  ];

  static {
    registerClass({}, this);
  }

  _url_bar!: Gtk.Entry;
  _view_stack!: Gtk.Stack;
  _validate_button!: SpinningButton;
  preview_download!: PreviewDownload;
  _slots: Map<string, ((_obj: this, ...args: any[]) => Promise<boolean>)[]> = new Map;

  constructor(params: Adw.Window.ConstructorProperties = {}) {
    super(params);
    this._slots.set('validate', []);
    this._slots.set('preview-page::setup', []);
    this._slots.set('download', []);
    this._validate_button.button.connect('clicked', this.on_validate.bind(this));
    this.preview_download.retry_button.connect('clicked', this.on_retry.bind(this));
  }

  on_retry() {
    this._view_stack.set_visible_child_name('input-url');
  }

  on_validate() {
    const on_exit = () => {
      this._validate_button.spinning = false;
    };
    (async () => {
      this._validate_button.spinning = true;
      const url = this._url_bar.get_text() || '';
      if (url === null) throw new Error('Entry text is null');
      const result = await this._emit_signal('validate', (msg: string) => console.log(msg), url);
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

  connect_signal(signal: Signals, cb: (_obj: this, ...args: any[]) => Promise<boolean>) {
    const handlers = this._slots.get(signal);
    if (handlers === undefined) throw new Error;
    handlers.push(cb);
    return cb;
  }

  disconnect_signal(signal: Signals, cb: (_obj: this, ...args: any[]) => Promise<boolean>): boolean {
    const handlers = this._slots.get(signal);
    if (handlers === undefined) throw new Error;
    const idx = handlers.indexOf(cb as (_obj: this, ...args: any[]) => Promise<boolean>);
    if (idx === -1) return false;
    handlers.splice(idx, 1);
    return true;
  }

  async _emit_signal(signal: Signals, ...args: any[]) {
    const handlers = this._slots.get(signal);
    if (handlers === undefined) throw new Error;
    for (const x of handlers) {
      const result = await x(this, ...args);
      if (!result) return false;
    }
    return true;
  }
}
