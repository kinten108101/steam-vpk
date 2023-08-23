import GObject from 'gi://GObject';
import Gio from "gi://Gio";
import GLib from "gi://GLib";
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import { APP_RDNN } from './const.js';
import {
  GtkChildren,
  GtkCssName,
  GtkInternalChildren,
  GtkTemplate,
  param_spec_boolean,
  param_spec_object,
  param_spec_string,
  registerClass,
} from "./steam-vpk-utils/utils.js";

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

class BoxPage extends GObject.Object {
  static [GObject.properties] = {
    button: param_spec_object({ name: 'button', objectType: Gtk.ToggleButton.$gtype }),
    empty: param_spec_boolean({ name: 'empty', default_value: false }),
  }

  static {
    registerClass({}, this);
  }

  button!: Gtk.ToggleButton;
  empty!: boolean;

  set_empty(val: boolean) {
    if (val === this.empty) return;
    this.empty = val;
  }
}

type BoxPages = 'status_box' | 'inject_console_box';

export default class HeaderBox extends Gtk.Box {
  static [GObject.properties] = {
    revealed: param_spec_boolean({ name: 'revealed' }),
    reveal_toggle: param_spec_object({ name: 'reveal-toggle', objectType: Gtk.ToggleButton.$gtype }),
    current_box: param_spec_string({ name: 'current-box', default_value: 'status_box' }),
  }
  static [GtkTemplate] = `resource://${APP_RDNN}/ui/headerbox.ui`;
  static [GtkCssName] = 'headerbox';
  static [GtkChildren] = [
    'detachable',
    'console_box',
  ];
  static [GtkInternalChildren] = [
    'headerbox_revealer', 'content_revealer', 'box_stack',
    'view_stack', 'button_status', 'button_console',
    'status_box', 'status_title', 'status_description',
    'content_type_stack',
  ];

  static {
    registerClass({}, this);
  }

  /* children */
  detachable!: Adw.Window;
  console_box!: HeaderboxConsole;

  /* internal children */
  _headerbox_revealer!: Gtk.Revealer;
  _content_revealer!: Gtk.Revealer;
  _box_stack!: Adw.ViewStack;
  _view_stack!: Adw.ViewStack;
  _button_status!: Gtk.ToggleButton;
  _button_console!: Gtk.ToggleButton;
  _status_box!: Gtk.Box;
  _status_title!: Gtk.Label;
  _status_description!: Gtk.Label;
  _content_type_stack!: Adw.ViewStack;

  current_box!: string;
  reveal_toggle?: Gtk.ToggleButton;
  revealed: boolean = false;

  pages: Map<string, BoxPage> = new Map;

  constructor(params = {}) {
    super(params);
    this._setup_reveal_method();
    this._setup_detachable();
    this._setup_box_switcher();
    (<[string, Gtk.ToggleButton][]>
    [
      ['status_box', this._button_status],
      ['inject_console_box', this._button_console],
    ])
    .forEach(([box_name, button]) => {
      const page = new BoxPage({ button });
      this.pages.set(box_name, page);
      page.connect('notify::empty', this._update_box_stack.bind(this));
    });
  }

  _setup_box_switcher() {
    this.connect('notify::current-box', this._update_box_stack.bind(this));
  }

  _update_box_stack() {
    this.pages.forEach(({ empty }, key) => {
      if (key !== this.current_box) return;
      if (empty) {
        this._content_type_stack.set_visible_child_name('empty_content');
        return;
      }
      this._content_type_stack.set_visible_child_name('default_content');
      this._box_stack.set_visible_child_name(key);
    });

    this.pages.forEach(({ button }, key) => {
      if (key !== this.current_box) {
        button.set_active(false);
        return;
      }
      button.set_active(true);
    });
  }

  _setup_detachable() {
    this.detachable.connect("notify::visible", () => {
      if (this.detachable.get_visible()) {
        this._view_stack.set_visible_child_name("popped_view");
        return;
      }
      this._view_stack.set_visible_child_name("default_view");
    });
  }

  _setup_reveal_method() {
    this._headerbox_revealer.connect("notify::child-revealed", () => {
      if (!this._headerbox_revealer.get_child_revealed()) {
        this.revealed = false;
        this.reveal_toggle?.set_active(false);
        this.reveal_toggle?.set_sensitive(true);
        return;
      }
      this._content_revealer.set_reveal_child(true);
    });

    this._content_revealer.connect("notify::child-revealed", () => {
      if (this._content_revealer.get_child_revealed()) {
        this.revealed = true;
        this.reveal_toggle?.set_active(true);
        this.reveal_toggle?.set_sensitive(true);
        return;
      }
      this._headerbox_revealer.set_reveal_child(false);
    });
  }

  reveal_headerbox(val: boolean) {
    if (this.revealed === val) return;
    if (val === true) {
      this.reveal_toggle?.set_sensitive(false);
      this._headerbox_revealer.set_reveal_child(true);
    } else if (val === false) {
      this.reveal_toggle?.set_sensitive(false);
      this._content_revealer.set_reveal_child(false);
    }
  }

  open_with_box(box_page: BoxPages) {
    this.current_box = box_page;
    this.reveal_headerbox(true);
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

  bind_status(type: 'error' | 'generic', cb: (obj: this, title: Gtk.Label, description: Gtk.Label) => void) {
    this._set_status_style(type);
    cb(this, this._status_title, this._status_description);
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

export function HeaderBoxActions(
{ action_map,
  headerbox,
  parent_window,
}:
{ action_map: Gio.ActionMap;
  headerbox: HeaderBox;
  parent_window?: Gtk.Window;
}) {
  const modal_actions = new Gio.SimpleActionGroup();
  const reveal = new Gio.SimpleAction({
    name: "headerbox.reveal",
  });
  reveal.connect("activate", () => {
    headerbox.reveal_headerbox(!headerbox.revealed);
  });
  action_map.add_action(reveal);

  const box_switch = new Gio.SimpleAction({
    name: "headerbox.box-switch",
    parameter_type: GLib.VariantType.new("s"),
  });
  box_switch.connect("activate", (_action, parameter: GLib.Variant) => {
    const box_name = parameter.deepUnpack() as string;
    headerbox.current_box = box_name;
  });
  action_map.add_action(box_switch);

  const detach = new Gio.SimpleAction({
    name: "headerbox.detach",
  });
  detach.connect("activate", () => {
    headerbox.detachable.set_transient_for(parent_window || null);
    headerbox.detachable.set_visible(true);
  });
  action_map.add_action(detach);

  const attach = new Gio.SimpleAction({
    name: "headerbox.attach",
  });
  attach.connect("activate", () => {
    headerbox.detachable.set_visible(false);
  });
  action_map.add_action(attach);
  modal_actions.add_action(attach);

  headerbox.detachable.insert_action_group('modal', modal_actions);

  function init_headerbox() {
    box_switch.activate(GLib.Variant.new_string('status_box'));
    return methods;
  }

  const methods = {
    init_headerbox,
  };

  return methods;
}
