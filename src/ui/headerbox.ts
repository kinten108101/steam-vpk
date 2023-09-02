import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import { APP_RDNN } from '../utils/const.js';
import {
  GtkChildren,
  GtkCssName,
  GtkInternalChildren,
  GtkTemplate,
  param_spec_boolean,
  param_spec_object,
  param_spec_string,
  registerClass,
} from "../steam-vpk-utils/utils.js";
import HeaderboxDetachable from '../windows/headerbox-detachable.js';

export class HeaderboxBuild extends Gtk.Box {
  static [GtkTemplate] = `resource://${APP_RDNN}/ui/headerbox-build.ui`;

  static {
    registerClass({}, this);
  }
}

export class HeaderboxConsole extends Gtk.Box {
  static [GObject.signals] = {
    'lines-changed': {},
  };

  static [GtkTemplate] = `resource://${APP_RDNN}/ui/headerbox-console.ui`;
  static [GtkChildren] = [
    'output',
  ];
  static {
    registerClass({}, this);
  }

  lines: string[] = [];
  output!: Gtk.Label;

  page_data!: BoxPage;

  constructor(params = {}) {
    super(params);
    this.connect('lines-changed', this.#render_lines.bind(this));
  }

  bind(page_data: BoxPage) {
    this.page_data = page_data;
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
      this.page_data.set_empty(true);
    } else {
      this.page_data.set_empty(false);
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

export type BoxPages = 'status_box' | 'console_box';
export type BoxSchemes =
  'status::default' |
  'status::build' |
  'console::default';
export type PanelSchemes = 'status::clear' | 'default';

class BoxPage extends GObject.Object {
  static make_default(
    type: BoxPages,
    external_deps: {
      button: Gtk.ToggleButton;
    }) {
    switch (type) {
    case 'status_box':
      return new BoxPage({
        button: external_deps.button,
        box: 'status::default',
        panel: 'default',
      });
    case 'console_box':
      return new BoxPage({
        button: external_deps.button,
        box: 'console::default',
        panel: 'default',
      });
    }
  }

  static [GObject.properties] = {
    button: param_spec_object({ name: 'button', objectType: Gtk.ToggleButton.$gtype }),
    empty: param_spec_boolean({ name: 'empty', default_value: true }),
    box: param_spec_string<BoxSchemes>({ name: 'box' }),
    panel: param_spec_string<PanelSchemes>({ name: 'panel' }),
  }

  static {
    registerClass({}, this);
  }

  button!: Gtk.ToggleButton;
  empty!: boolean;
  box!: BoxSchemes;
  panel!: PanelSchemes;

  set_empty(val: boolean) {
    if (val === this.empty) return;
    this.empty = val;
  }

  constructor(params: {
    button: Gtk.ToggleButton;
    box: BoxSchemes;
    panel: PanelSchemes;
  }) {
    super(params);
  }
}



export class StatusPage extends GObject.Object {
  static {
    registerClass({}, this);
  }

  set_build() {

  }
}

export type StatusStyles = 'error' | 'generic' | 'build';

export default interface HeaderBox {
  bind_status(type: 'error' | 'generic', cb: (obj: this, title: Gtk.Label, description: Gtk.Label) => void): void;
  bind_status(type: 'build', cb: (obj: this) => void): void;
}
export default class HeaderBox extends Gtk.Box {
  static [GObject.properties] = {
    revealed: param_spec_boolean({
      name: 'child-revealed',
      default_value: false,
    }),
    reveal_toggle: param_spec_object({
      name: 'reveal-toggle',
      objectType: Gtk.ToggleButton.$gtype,
    }),
    current_page: param_spec_string<BoxPages>({
      name: 'current-page',
      default_value: 'status_box',
    }),
    reveal_child: param_spec_boolean({
      name: 'reveal-child',
      default_value: false,
    }),
  }
  static [GtkTemplate] = `resource://${APP_RDNN}/ui/headerbox.ui`;
  static [GtkCssName] = 'headerbox';
  static [GtkChildren] = [
    'detachable',
    'console_box',
  ];
  static [GtkInternalChildren] = [
    'headerbox_revealer',
    'content_revealer',
    'box_stack',
    'frame_stack',
    'button_status',
    'button_console',
    'status_box',
    'status_title',
    'status_description',
    'content_type_stack',
    'panel_controls',
  ];

  static {
    registerClass({}, this);
  }

  /* children */
  detachable!: HeaderboxDetachable;
  console_box!: HeaderboxConsole;

  /* internal children */
  _headerbox_revealer!: Gtk.Revealer;
  _content_revealer!: Gtk.Revealer;
  _box_stack!: Adw.ViewStack;
  _frame_stack!: Adw.ViewStack;
  _button_status!: Gtk.ToggleButton;
  _button_console!: Gtk.ToggleButton;
  _status_box!: Gtk.Box;
  _status_title!: Gtk.Label;
  _status_description!: Gtk.Label;
  _content_type_stack!: Adw.ViewStack;
  _panel_controls!: Adw.ViewStack;

  current_page!: BoxPages;
  reveal_toggle?: Gtk.ToggleButton;
  reveal_child!: boolean;
  _child_reveal!: boolean;

  get child_revealed() {
    return this._child_reveal;
  }

  _set_child_revealed(val: boolean) {
    this._child_reveal = val;
    this.notify('child-revealed');
  }

  pages: Map<string, BoxPage> = new Map;

  constructor(params = {}) {
    super(params);
    this._setup_reveal_method();
    this._setup_detachable();
    this._setup_box_switcher();
    const arr:
      [BoxPages, Gtk.ToggleButton, { bind(page: BoxPage): void }?][] =
    [
      ['status_box', this._button_status, undefined],
      ['console_box', this._button_console, this.console_box],
    ];
    arr.forEach(([page_name, button, bindable]) => {
      const page = BoxPage.make_default(page_name, { button });
      this.pages.set(page_name, page);
      [
        'notify::box',
        'notify::panel',
        'notify::empty',
      ].forEach(noti_sig => {
        page.connect(noti_sig, this._update_box_stack.bind(this));
      });
      bindable?.bind(page);
    });
  }

  _setup_box_switcher() {
    this.connect('notify::current-page', this._update_box_stack.bind(this));
  }

  _update_box_stack() {
    const page = this.pages.get(this.current_page);
    if (page === undefined) throw new Error;
    const { empty } = page;
    if (empty) {
      this._content_type_stack.set_visible_child_name('empty_content');
      (<(name: PanelSchemes) => void>
        this._panel_controls.set_visible_child_name)('default');
    } else {
      this._content_type_stack.set_visible_child_name('default_content');
      this._box_stack.set_visible_child_name(page.box);
      this._panel_controls.set_visible_child_name(page.panel);
    }

    this.pages.forEach(({ button }, key) => {
      if (key !== this.current_page) {
        button.set_active(false);
        return;
      }
      button.set_active(true);
    });
  }

  _setup_detachable() {
    this.detachable.connect("notify::visible", () => {
      if (this.detachable.get_visible()) {
        this._frame_stack.set_visible_child_name("popped_view");
        return;
      }
      this._frame_stack.set_visible_child_name("default_view");
    });
  }

  _setup_reveal_method() {
    this.connect('notify::reveal-child', () => {
      if (this.reveal_child === true) {
        this._headerbox_revealer.set_reveal_child(true);
      } else {
        this._content_revealer.set_reveal_child(false);
      }
    });
    this.connect('notify::child-revealed', () => {
      if (this.child_revealed !== this.reveal_child) {
        this.notify('reveal-child');
      }
    });
    this._headerbox_revealer.connect("notify::child-revealed", () => {
      if (!this._headerbox_revealer.get_child_revealed()) {
        this._set_child_revealed(false);
        return;
      }
      this._content_revealer.set_reveal_child(true);
    });
    this._content_revealer.connect("notify::child-revealed", () => {
      if (this._content_revealer.get_child_revealed()) {
        this._set_child_revealed(true);
        return;
      }
      this._headerbox_revealer.set_reveal_child(false);
    });
  }

  open_with_box(box_page: BoxPages) {
    this.current_page = box_page;
    this.reveal_child = true;
  }

  set_empty_status(page_name: BoxPages, val: boolean) {
    const page = this.pages.get(page_name);
    if (page === undefined) throw new Error;
    if (val) {
      this._set_status_style('generic');
      page.set_empty(true);
      return;
    }
    page.set_empty(false);
  }

  bind_status(type: StatusStyles, cb: (obj: this, ...args: any[]) => void) {
    const page = this._pages_get('status_box');
    if (type === 'error' || type === 'generic') {
      this._set_status_style(type);
      page.box = 'status::default';
      cb(this, this._status_title, this._status_description);
    } else if (type === 'build') {
      this._set_status_style('generic');
      page.box = 'status::build';
      cb(this);
    }
  }

  _pages_get(name: BoxPages) {
    const page = this.pages.get(name);
    if (page === undefined) throw new Error('Page does not exist');
    return page;
  }

  _set_status_style(status_type: 'error' | 'generic') {
    const style_options = {
      red: 'red',
      white: 'white',
    };
    const iconname_options = {
      error: 'error-symbolic',
      question_round: 'question-round-symbolic',
    };
    function pick(classes: string[], style: string): string[] {
      const css = new Set(classes);
      for (const x in style_options) {
        if ((<{[key: string]: string}>style_options)[x] === style) {
          css.add(style);
          continue;
        }
        css.delete(x);
      }
      function set2arr(set: Set<any>) {
        const arr: any[] = [];
        set.forEach(x => {
          arr.push(x);
        });
        return arr;
      }
      const _classes = set2arr(css);
      return _classes;
    }
    const [style, icon_name]: [string, string] = (() => {
      switch (status_type) {
      case 'error':
        return [
          style_options.red,
          iconname_options.error,
        ];
      case 'generic':
        return [
          style_options.white,
          iconname_options.question_round,
        ];
      }
    })();
    this._button_status.set_css_classes(
      pick(this._button_status.css_classes, style)
    );
    this._button_status.set_icon_name(icon_name);
    this._status_box.set_css_classes(
      pick(this._status_box.css_classes, style)
    );
  }
}
