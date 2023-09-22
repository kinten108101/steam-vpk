import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import HeaderboxDetachable from '../windows/headerbox-detachable.js';
import HeaderboxBuild from './headerbox/build.js';
import HeaderboxConsole from './headerbox/console.js';

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

  static {
    GObject.registerClass({
      GTypeName: 'StvpkBoxPage',
      Properties: {
        button: GObject.ParamSpec.object(
          'button', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          Gtk.ToggleButton.$gtype),
        empty: GObject.ParamSpec.boolean(
          'empty', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          true),
        box: GObject.ParamSpec.string(
          'box', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
        panel: GObject.ParamSpec.string(
          'panel', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
      },
    }, this);
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

  pages: {
    get(name: BoxPages): BoxPage;
  } & Map<string, BoxPage> = new Map;

  constructor(params = {}) {
    super(params);
    this._setup_reveal_method();
    this._setup_detachable();
    this._setup_box_switcher();
    const arr:
      [BoxPages, Gtk.ToggleButton, { bind(page: BoxPage): void }?][] =
    [
      ['status_box', this._button_status],
      ['console_box', this._button_console],
    ];
    arr.forEach(([page_name, button]) => {
      const page = BoxPage.make_default(page_name, { button });
      this.pages.set(page_name, page);
      [
        'notify::box',
        'notify::panel',
        'notify::empty',
      ].forEach(noti_sig => {
        page.connect(noti_sig, this._update_box_stack.bind(this));
      });
    });

    const update_console_box_empty = () => {
      const page = this.pages.get('console_box');
      page.set_empty(this.console_box.text_empty)
    };
    this.console_box.connect('notify::text-empty', update_console_box_empty);
    update_console_box_empty();
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
