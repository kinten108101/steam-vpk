import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import {
  APP_RDNN,
} from './const.js';
import {
  GtkChildren,
  GtkTemplate,
  registerClass,
} from './steam-vpk-utils/utils.js';

// TODO(kinten): Scroll window to bottom as new lines are available

export default class InjectConsole extends Gtk.Revealer {
  static [GObject.signals] = {
    'lines-changed': {},
  };

  static [GObject.properties] = {
    switch: GObject.ParamSpec.boolean('switch', 'switch', 'switch', GObject.ParamFlags.LAX_VALIDATION | GObject.ParamFlags.READWRITE, false),
  };

  static [GtkTemplate] = `resource://${APP_RDNN}/ui/inject-console.ui`;
  static [GtkChildren] = [ 'content-revealer', 'box', 'profile-box', 'output' ];

  static {
    registerClass({}, this);
  };

  switch!: boolean;
  content_revealer!: Gtk.Revealer;
  box!: Gtk.Box;
  profile_box!: Gtk.Box;
  output?: Gtk.Label;
  lines: string[] = [];
  selected_box: Gtk.Box | undefined;

  constructor(params = {}) {
    super(params);
    this.selected_box = this.box;
    this.connect('notify::switch', () => {
      if (this.switch === true) {
        this.set_reveal_child(true);
        this.selected_box?.set_visible(true);
        this.content_revealer.set_reveal_child(true);
      } else {
        this.set_reveal_child(false);
        this.content_revealer.set_reveal_child(false);
      }
    });
    this.content_revealer.connect('notify::child-revealed', () => {
      if (this.content_revealer.child_revealed === false) {
        this.selected_box?.set_visible(false);
        this.set_reveal_child(true);
      }
    });
    this.connect('lines-changed', this.render_lines);
  }

  reset() {
    this.clean_output();
    this.set_switch(false);
  }

  render_lines = () => {
    const text = this.lines.reduce((acc, val, i) => {
      if (i === 0) return `${val}`;
      return `${acc}\n${val}`;
    }, '');
    this.output?.set_label(text);
  };

  add_line(val: string) {
    this.lines.push(val);
    this.emit('lines-changed');
  }

  set_switch(val: boolean) {
    this.switch = val;
  }

  clean_output() {
    this.lines = [];
    this.render_lines();
  }
}

export function InjectConsoleActions(
{
  inject_console,
  action_map,
}:
{
  inject_console?: InjectConsole;
  action_map: Gio.ActionMap;
}) {
  const toggle_console = new Gio.SimpleAction({ name: 'inject-console.toggle-console' });
  toggle_console.connect('activate', () => {
    if (!inject_console) return;
    inject_console.switch = !inject_console.switch;
  });
  action_map.add_action(toggle_console);
}
