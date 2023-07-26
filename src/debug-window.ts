import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import TypedBuilder from './typed-builder.js';
import * as Consts from './const.js';
import { g_param_default, g_variant_unpack, registerClass } from './utils.js';

class DebugWindowActionRowItem extends GObject.Object {
  static [GObject.properties] = {
    'group-name': GObject.ParamSpec.string('group-name', 'group-name', 'group-name', g_param_default, null),
    action: GObject.ParamSpec.object('action', 'action', 'action', g_param_default, Gio.Action.$gtype),
  };

  static {
    registerClass({}, this);
  }

  action!: Gio.Action;
  group_name!: string;
}

interface ActionInfo {
  group: string;
  action: Gio.Action;
}

const list_action_objs = (application: Gtk.Application): ActionInfo[] => {
  const actions: ActionInfo[] = [];
  application.list_actions().forEach(x => {
    const group = 'app';
    const action = application.lookup_action(x);
    if (action === null) return;
    actions.push({ group, action });
  });
  const application_window = (() => {
    let val: Adw.ApplicationWindow | undefined;
    application.get_windows().forEach(x => {
      if (!(x instanceof Adw.ApplicationWindow)) return;
      val = x;
    });
    return val;
  })();
  application_window?.list_actions().forEach(x => {
    const group = 'win';
    const action = application_window.lookup_action(x);
    if (action !== null) actions.push({ group, action });
  });
  return actions;
}

export default function debug_window_implement(
{
  application,
}:
{
  application: Gtk.Application;
}) {
  const manage = new Gio.SimpleAction({ name: 'debug.manage' });
  manage.connect('activate', () => {
    const builder = new TypedBuilder();
    builder.add_from_resource(`${Consts.APP_RDNN}/ui/debug-window.ui`);

    const model = new Gio.ListStore<DebugWindowActionRowItem>({ item_type: DebugWindowActionRowItem.$gtype });
    const action_list = builder.get_typed_object<Gtk.ListBox>('action-list');
    action_list.bind_model(model, <Gtk.ListBoxCreateWidgetFunc>((_item: GObject.Object) => {
      const item = _item as DebugWindowActionRowItem;
      const builder = new TypedBuilder();
      builder.add_from_resource(`${Consts.APP_RDNN}/ui/debug-window-action-row.ui`);
      const row = builder.get_typed_object<Adw.ExpanderRow>('row');
      row.set_title(`${item.group_name}.${item.action.get_name()}`);
      return row;
    }));

    list_action_objs(application).forEach(({ group: group_name, action }) => {
      const item = new DebugWindowActionRowItem({
        action,
        group_name,
      })
      model.append(item);
    });

    const window = builder.get_typed_object<Adw.Window>('window');

    const debugActions = new Gio.SimpleActionGroup();
    window.insert_action_group('debug', debugActions);

    window.present();
  });
  application.add_action(manage);
  application.set_accels_for_action('app.debug.manage', ['<Control>h']);

  const devel = new Gio.SimpleAction({ name: 'debug.devel', parameter_type: GLib.VariantType.new('b') });
  devel.connect('activate', (_action, parameter) => {
    const active = g_variant_unpack<boolean>(parameter, 'boolean');
    if (active === true) {
      application.get_windows().forEach(x => {
        if (x instanceof Gtk.ApplicationWindow) x.add_css_class('devel');
      });
    } else {
      application.get_windows().forEach(x => {
        if (x instanceof Gtk.ApplicationWindow) x.remove_css_class('devel');
      });
    }
  });
  application.add_action(devel);
}
