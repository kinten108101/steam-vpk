import Gtk from 'gi://Gtk';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import Adw from 'gi://Adw';
import { SimpleAction } from '../utils/action-builder.js';
import { MessageDialog } from '../dialogs/message-dialog.js';

export function logged(func: Function) {
  return function (this: any, ...args: any[]) {
    console.log(`<${func.name}>`);
    func(args);
    console.log(`</${func.name}>`);
  }
}

export default function AddonStorageControls(
{ action_map,
  parent_window,
}:
{ action_map: Gio.ActionMap;
  parent_window?: Gtk.Window;
}) {
  const builder = SimpleAction.builder({ prefix: 'addons' });

  const enableAddon = new Gio.SimpleAction({
    name: 'addons.enabled',
    state: GLib.Variant.new_boolean(false),
  });
  enableAddon.set_state_hint(GLib.Variant.new_array(GLib.VariantType.new('b'), [GLib.Variant.new_boolean(true), GLib.Variant.new_boolean(false)]));
  enableAddon.connect('activate', (action) => {
    const current = action.get_state();
    if (current === null) throw new Error;
    const content = current.get_boolean();
    action.change_state(GLib.Variant.new_boolean(!content));
  });
  enableAddon.connect('change-state', (_action, request) => {
    if (request === null) throw new Error;
    const newcontent = request.get_boolean();
    newcontent;
  });
  action_map.add_action(enableAddon);

  const includeInProfile = new Gio.SimpleAction({
    name: 'addons.box',
    parameter_type: GLib.VariantType.new('s'),
  });
  includeInProfile.connect('activate', (_, parameter) => {
    if (parameter === null) throw new Error;
    const [id] = parameter.get_string();
    if (id === null) throw new Error;
  });
  action_map.add_action(includeInProfile);

  const moveUp = new Gio.SimpleAction({
    name: 'addons.move-up',
    parameter_type: GLib.VariantType.new('s'),
  });
  moveUp.connect('activate', (_, parameter) => {
    if (parameter === null) throw new Error;
    const [id] = parameter.get_string();
    if (id === null) throw new Error;
  });
  action_map.add_action(moveUp);

  builder
    .name('move-down')
    .parameter_type('s')
    .activate((_, parameter) => {
      if (parameter === null) throw new Error;
      const [id] = parameter.get_string();
      if (id === null) throw new Error;
    })
    .insert(action_map)
    .build();

  builder
    .name('remove')
    .parameter_type('s')
    .activate_async(async (_action, parameter) => {
      if (parameter === null) throw new Error;
      const [id] = parameter.get_string();
      if (id === null) throw new Error;
      const msg = MessageDialog.builder()
        .heading('Disuse this add-on? Current configurations in this profile will be permanently lost.')
        .body('Add-on can still be reused from the repository.')
        .response({ id: 'remove.cancel',  label: 'Cancel' })
        .response({ id: 'remove.proceed', label: 'Proceed', appearance: Adw.ResponseAppearance.DESTRUCTIVE })
        .transientFor(parent_window || null)
        .wrap().build();
      const response = await msg.choose_async(null);
      if (response === 'remove.cancel' ) {
        console.log('Action addons.remove dismissed. Quitting...');
        return;
      }
      if (response !== 'remove.proceed') {
        console.warn(`Received unknown response in removeAddon. Got ${response}`);
      }
    })
    .insert(action_map)
    .build();

  builder
    .name('active')
    .parameter_type(GLib.VariantType.new_tuple([new GLib.VariantType('s'), new GLib.VariantType('b')]))
    .activate((_, parameter) => {
      if (!(parameter instanceof GLib.Variant)) throw new Error(`Expect a GVariant, got ${parameter}`);
      const [id, active] = parameter.deepUnpack() as Array<any>;
      if (typeof id !== 'string' || typeof active !== 'boolean') {
        throw new Error(`Expected (sb), got ${id} and ${active}`);
      }

    })
    .insert(action_map)
    .build();

  builder
    .name('trash')
    .parameter_type('s')
    .activate_async(async (_action, parameter) => {
      if (parameter === null) throw new Error;
      const [id] = parameter.get_string();
      if (id === null) throw new Error;
      const msg = MessageDialog.builder()
        .heading('Delete this add-on?')
        .body('Deleted content is recoverable from trash can.')
        .response({ id: 'trash.cancel',  label: 'Cancel' })
        .response({ id: 'trash.proceed', label: 'Proceed', appearance: Adw.ResponseAppearance.DESTRUCTIVE })
        .closeResponse('trash.cancel')
        .defaultResponse('trash.proceed')
        .transientFor(parent_window || null)
        .wrap().build();
      const response = await msg.choose_async(null)
      switch (response) {
      case 'trash.cancel':
        console.log('Action addons.trash dismissed. Quitting...');
        return;
      case 'trash.proceed':
        break;
      default:
        throw new Error(`Unknown message dialog response. Got ${response}`);
      }
    })
    .insert(action_map)
    .build();
}
