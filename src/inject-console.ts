import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import * as Utils from './utils.js';
import * as Consts from './const.js';

export default class InjectConsole extends Gtk.Revealer {
  static [GObject.properties] = {
    switch: GObject.ParamSpec.boolean('switch', 'switch', 'switch', GObject.ParamFlags.LAX_VALIDATION | GObject.ParamFlags.READWRITE, false),
  };

  static {
    Utils.registerClass({
      Template: `resource://${Consts.APP_RDNN}/ui/inject-console.ui`,
      Children: [ 'content-revealer', 'box' ]
    }, this);
  };

  switch!: boolean;
  content_revealer!: Gtk.Revealer;
  box!: Gtk.Box;

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
    })
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
