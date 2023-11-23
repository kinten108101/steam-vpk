import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import * as Consts from '../utils/const.js';

/**
 * @deprecated
 */
class TypedBuilder extends Gtk.Builder {
  static {
    GObject.registerClass({}, this);
  }

  constructor(param: Gtk.Builder.ConstructorProperties = {}) {
    super(param);
  }

  /**
   * Get the object named `name`.
   *
   * A wrapper over {@link Gtk.Builder.get_object} that supports generics.
   * @param name name of object to get
   * @returns the object named `name`
   * @throws a JS Error if object named `name` is not found
   */
  get_typed_object<T extends GObject.Object>(name: string): T {
    const obj = this.get_object(name);
    if (obj === null) throw new Error(`Bad XML, \"${name}\" not found.`);
    return obj as T;
  }
}

class DebugWindowActionRowItem extends GObject.Object {
  static {
    GObject.registerClass({
      Properties: {
        group_name: GObject.ParamSpec.string(
          'group-name', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
        action: GObject.ParamSpec.object(
          'action', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          Gio.Action.$gtype),
      },
    }, this);
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

export default function DebugWindow(
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

    const action_objs = list_action_objs(application);

    const model = new Gio.ListStore<DebugWindowActionRowItem>({ item_type: DebugWindowActionRowItem.$gtype });
    const action_list = builder.get_typed_object<Gtk.ListBox>('action-list');
    action_list.bind_model(model, <Gtk.ListBoxCreateWidgetFunc>((_item: GObject.Object) => {
      const item = _item as DebugWindowActionRowItem;
      const builder = new TypedBuilder();
      builder.add_from_resource(`${Consts.APP_RDNN}/ui/debug-window-action-row.ui`);
      const row = builder.get_typed_object<Adw.ExpanderRow>('row');

      const { group_name, action } = item;

      row.set_title(`${group_name}.${action.get_name()}`);

      const action_type = action.get_parameter_type();
      if (action_type === null) {
        const row = builder.get_typed_object<Adw.ActionRow>('action-stateless');
        row.set_visible(true);

        const button = builder.get_typed_object<Gtk.Button>('action-stateless-activate');
        button.connect('clicked', () => {
          action.activate(null);
        });
      }
      else if (action_type.equal(GLib.VariantType.new('b'))) {
        const row = builder.get_typed_object<Adw.ActionRow>('action-boolean');
        row.set_visible(true);

        const enable = builder.get_typed_object<Gtk.Button>('action-boolean-enable');
        enable.connect('clicked', () => {
          action.activate(GLib.Variant.new_boolean(true));
        });

        const disable = builder.get_typed_object<Gtk.Button>('action-boolean-disable');
        disable.connect('clicked', () => {
          action.activate(GLib.Variant.new_boolean(false));
        });
      }
      else if (action_type.equal(GLib.VariantType.new('s'))) {
        const row = builder.get_typed_object<Adw.ActionRow>('action-string');
        row.set_visible(true);

        const entry = builder.get_typed_object<Gtk.Entry>('action-string-entry');
        const activate = builder.get_typed_object<Gtk.Button>('action-string-activate');
        activate.connect('clicked', () => {
          const val = entry.get_text();
          if (val === null) return;
          const gvariant = GLib.Variant.new_string(val);
          action.activate(gvariant);
        });
      }
      else if (action_type.equal(GLib.VariantType.new('i'))) {
        const row = builder.get_typed_object<Adw.ActionRow>('action-string');
        row.set_visible(true);

        const entry = builder.get_typed_object<Gtk.Entry>('action-string-entry');
        const activate = builder.get_typed_object<Gtk.Button>('action-string-activate');
        activate.connect('clicked', () => {
          const val = entry.get_text();
          if (val === null) return;
          const gvariant = GLib.Variant.new_int32(Number(val));
          action.activate(gvariant);
        });
      }

      return row;
    }));

    action_objs.forEach(({ group: group_name, action }) => {
      const item = new DebugWindowActionRowItem({
        action,
        group_name,
      })
      model.append(item);
    });

    const ten_windows = builder.get_typed_object<Gtk.Button>('ten-windows');
    ten_windows.connect('clicked', () => {
      const actioninfo = action_objs.find(x => x.action.name === 'new-window');
      if (actioninfo === undefined) {
        console.warn('Couldn\'t find new-window action for ten-windows');
        return;
      }
      for (let i = 0; i < 10; i++) {
        actioninfo.action.activate(null);
      }
    });

    const window = builder.get_typed_object<Adw.PreferencesWindow>('window');

    window.present();
  });
  application.add_action(manage);
  application.set_accels_for_action('app.debug.manage', ['<Control>h']);
}
