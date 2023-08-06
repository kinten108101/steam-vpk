import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import * as Utils from './utils.js';
import * as Consts from './const.js';
import Injector, { Injection } from './injector.js';
import InjectButtonSet from './inject-button-set.js';

// TODO(kinten): Scroll window to bottom as new lines are available

export default class InjectConsole extends Gtk.Revealer {
  static [GObject.signals] = {
    'lines-changed': {},
  }

  static [GObject.properties] = {
    switch: GObject.ParamSpec.boolean('switch', 'switch', 'switch', GObject.ParamFlags.LAX_VALIDATION | GObject.ParamFlags.READWRITE, false),
  };

  static {
    Utils.registerClass({
      Template: `resource://${Consts.APP_RDNN}/ui/inject-console.ui`,
      Children: [ 'content-revealer', 'box', 'output' ]
    }, this);
  };

  switch!: boolean;
  content_revealer!: Gtk.Revealer;
  box!: Gtk.Box;
  output?: Gtk.Label;
  lines: string[] = [];

  constructor(params = {}) {
    super(params);
    this.connect('notify::switch', () => {
      if (this.switch === true) {
        this.set_reveal_child(true);
        this.box.set_visible(true);
        this.content_revealer.set_reveal_child(true);
      } else {
        this.set_reveal_child(false);
        this.content_revealer.set_reveal_child(false);
      }
    });
    this.content_revealer.connect('notify::child-revealed', () => {
      if (this.content_revealer.child_revealed === false) {
        this.box.set_visible(false);
        this.set_reveal_child(true);
      }
    });
    this.connect('lines-changed', this.render_lines);
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

export function InjectConsolePresenter(
{ inject_console,
  button_set,
  injector,
}:
{ inject_console?: InjectConsole;
  button_set?: InjectButtonSet;
  injector: Injector;
}) {
  const injections = new WeakMap<Injection, {
    using_logs_changed: number | undefined;
    using_cancellable: number | undefined;
  }>();
  injector.connect(Injector.Signals.running_prepare, (_obj, injection: Injection) => {
    const using_logs_changed = injection.connect(Injection.Signals.logs_changed, (_obj, msg) => {
      inject_console?.add_line(msg);
    });
    const using_cancellable = injection.cancellable.connect(() => {
      button_set?.hold_set_spinning(true);
    });
    injections.set(injection, {
      using_logs_changed,
      using_cancellable,
    });
    inject_console?.clean_output();
    button_set?.set_id(injection.id);
  });
  injector.connect(Injector.Signals.session_start, (_obj) => {
    inject_console?.set_switch(true);
    button_set?.set_state_button(InjectButtonSet.Buttons.hold);
  });
  injector.connect(Injector.Signals.session_end, (_obj) => {

    button_set?.set_state_button(InjectButtonSet.Buttons.done);
  });
  injector.connect(Injector.Signals.session_finished, (_obj) => {
    inject_console?.set_switch(false);
    button_set?.reset();
  });
  injector.connect(Injector.Signals.running_cleanup, (_obj, injection: Injection) => {
    const mem = injections.get(injection)
    if (!mem) return;
    const { using_logs_changed, using_cancellable } = mem;
    if (using_logs_changed) injection.disconnect(using_logs_changed);
    if (using_cancellable) injection.cancellable.disconnect(using_cancellable);
  });
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
