import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';

export default interface HeaderboxConsole {
  connect(signal: 'lines-changed', callback: (obj: this) => void): number;
  emit(signal: 'lines-changed'): void;
  connect(signal: 'notify::text-empty', callback: (obj: this, pspec: GObject.ParamSpec) => void): number;
  notify(prop: 'text-empty'): void;
  /* inherit */
  connect(sigName: string, callback: (obj: this, ...args: any[]) => any): number
  emit(sigName: string, ...args: any[]): void
}

export default class HeaderboxConsole extends Gtk.Box {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkHeaderboxConsole',
      Properties: {
        text_empty: GObject.ParamSpec.boolean(
          'text-empty', '', '',
          GObject.ParamFlags.READABLE,
          false),
      },
      Signals: {
        'lines-changed': {},
      },
      Template: 'resource:///com/github/kinten108101/SteamVPK/ui/headerbox-console.ui',
      Children: [
        'output',
      ],
    }, this);
  }

  _text_empty!: boolean;
  get text_empty() {
    return this._text_empty;
  }
  _set_text_empty(val: boolean) {
    if (this._text_empty === val) return;
    this._text_empty = val;
    this.notify('text-empty');
  }

  output!: Gtk.Label;

  lines: string[] = [];

  constructor(params = {}) {
    super(params);
    this.connect('lines-changed', this.#render_lines.bind(this));
  }

  reset() {
    this.clean_output();
  }

  #render_lines() {
    const text = this.lines.reduce((acc, val, i) => {
      if (i === 0) return `${val}`;
      return `${acc}\n${val}`;
    }, '');
    if (text === '') {
      this._set_text_empty(true);
    } else {
      this._set_text_empty(false);
    }
    this.output?.set_label(text);
  }

  add_line(line: string) {
    this.lines.push(line);
    this.emit('lines-changed');
  }

  clean_output() {
    this.lines = [];
    this.emit('lines-changed');
  }
}
