import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import { APP_RDNN } from '../utils/const.js';
import {
  GtkChildren,
  GtkInternalChildren,
  GtkTemplate,
  param_spec_boolean,
  param_spec_object,
  param_spec_string,
  registerClass,
} from "../steam-vpk-utils/utils.js";
import HeaderboxDetachable from '../windows/headerbox-detachable.js';

export namespace HeaderboxBuild {
  export type TitleType = 'in-progress' | 'done';
  export type ElapsedDisplayMode = 'free' | 'fixed';
  export type TimeUnitWord = 's' | 'ms';
}

export class HeaderboxBuild extends Gtk.Box {
  static [GObject.properties] = {
    title_type: GObject.ParamSpec.string('title-type', '', '',
      GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
      <HeaderboxBuild.TitleType>'in-progress'),
    elapsed: GObject.ParamSpec.uint64('elapsed', '', '',
      GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
      0, Number.MAX_SAFE_INTEGER, 0),
    elapsed_display_mode: GObject.ParamSpec.string('elapsed-display-mode', '', '',
      GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
      <HeaderboxBuild.ElapsedDisplayMode>'free'),
    status: GObject.ParamSpec.string('status', '', '',
      GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
      null),
    time_unit_word: GObject.ParamSpec.string('time-unit-word', '', '',
      GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
      <HeaderboxBuild.TimeUnitWord>'s'),
  };
  static [GtkTemplate] = `resource://${APP_RDNN}/ui/headerbox-build.ui`;
  static [GtkInternalChildren] = [
    'title_label',
    'time_elapsed_field',
    'status_field',
  ];

  static {
    registerClass({}, this);
  }

  title_type!: HeaderboxBuild.TitleType;
  elapsed!: number;
  elapsed_display_mode!: HeaderboxBuild.ElapsedDisplayMode;
  status!: string;
  /** @todo(kinten) Make this private */
  time_unit_word!: HeaderboxBuild.TimeUnitWord;

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
        switch (from as HeaderboxBuild.TitleType) {
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

export type StatusStyles = 'error' | 'generic' | 'build';

export default interface HeaderBox {
  bind_status(type: 'error' | 'generic', cb: (obj: this, title: Gtk.Label, description: Gtk.Label) => void): void;
  bind_status(type: 'build', cb: (obj: this, build_box: HeaderboxBuild) => void): void;
}
export default class HeaderBox extends Gtk.Box {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkHeaderBox',
      Properties: {
        child_revealed: GObject.ParamSpec.boolean(
          'child-revealed', 'Child revealed',
          'Whether or not child is revealed after reaching animation target',
          GObject.ParamFlags.READABLE,
          false),
        reveal_child: GObject.ParamSpec.boolean(
          'reveal-child', 'Reveal child',
          'Set reveal state',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          false),
        reveal_toggle: GObject.ParamSpec.object(
          'reveal-toggle', 'Reveal toggle',
          'The toggle button widget that controls this widget\'s reveal state',
          GObject.ParamFlags.WRITABLE | GObject.ParamFlags.CONSTRUCT,
          Gtk.ToggleButton.$gtype),
        current_page: GObject.ParamSpec.string(
          'current-page', 'Current page',
          'The current box page being displayed',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          // workaround so that typechecking is enforced
          ((): BoxPages => 'status_box')()),
      },
      Template: 'resource:///com/github/kinten108101/SteamVPK/ui/headerbox.ui',
      CssName: 'headerbox',
      Children: [
        'detachable',
        'console_box',
        'build_box',
      ],
      InternalChildren: [
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
      ],
    }, this);
  }

  /* children */
  detachable!: HeaderboxDetachable;
  console_box!: HeaderboxConsole;
  build_box!: HeaderboxBuild;

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
  _reveal_toggle!: Gtk.ToggleButton | null;
  set reveal_toggle(val: Gtk.ToggleButton) {
    if (this._reveal_toggle === val) return;
    this._reveal_toggle = val;
  }
  reveal_child!: boolean;
  _child_revealed!: boolean;
  get child_revealed() {
    return this._child_revealed;
  }

  _set_child_revealed(val: boolean) {
    this._child_revealed = val;
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
      if (this.reveal_child) {
        this._headerbox_revealer.set_reveal_child(true);
        if (this.child_revealed) {
          this._content_revealer.set_reveal_child(true);
          this._headerbox_revealer.set_reveal_child(true);
        }
      } else {
        this._content_revealer.set_reveal_child(false);
        if (!this.child_revealed) {
          this._content_revealer.set_reveal_child(false);
          this._headerbox_revealer.set_reveal_child(false);
        }
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
      cb(this, this.build_box);
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
