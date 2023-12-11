import Gtk from 'gi://Gtk';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import Adw from 'gi://Adw';
import AddonBoxClient from '../backend/client.js';

/**
 * @param {{
 *   action_map: Gio.ActionMap;
 *   parent_window?: Gtk.Window;
 *   client: AddonBoxClient;
 * }} params
 */
export default function AddonStorageControls(
{ action_map,
  parent_window,
  client,
}) {
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

  const moveDown = new Gio.SimpleAction({
    name: 'addons.move-down',
    parameter_type: GLib.VariantType.new('s'),
  });
  moveDown.connect('activate', (_action, parameter) => {
    if (parameter === null) throw new Error;
    const [id] = parameter.get_string();
    if (id === null) throw new Error;
  });
  action_map.add_action(moveDown);

  const remove = new Gio.SimpleAction({
    name: 'addons.remove',
    parameter_type: GLib.VariantType.new('s'),
  });
  remove.connect('activate', (_action, parameter) => {
    (async () => {
      if (parameter === null) throw new Error;
      const [id] = parameter.get_string();
      if (id === null) throw new Error;
      const msg = (
      /**
       * @type {{
       *   choose_async: (cancellable: Gio.Cancellable | null) => Promise<string>;
       * } & Adw.MessageDialog}
       */
        (new Adw.MessageDialog())
      );
      msg.set_heading('Disuse this add-on? Current configurations in this profile will be permanently lost.');
      msg.set_body('Add-on can still be reused from the repository.');
      msg.add_response('remove.cancel', 'Cancel');
      msg.add_response('remove.proceed', 'Proceed');
      msg.set_response_appearance('remove.proceed', Adw.ResponseAppearance.DESTRUCTIVE);
      msg.set_transient_for(parent_window || null);
      const response = await msg.choose_async(null);
      if (response === 'remove.cancel' ) {
        console.log('Action addons.remove dismissed. Quitting...');
        return;
      }
      if (response !== 'remove.proceed') {
        console.warn(`Received unknown response in removeAddon. Got ${response}`);
      }
    })().catch(logError);
  });
  action_map.add_action(remove);

  const activate = new Gio.SimpleAction({
    name: 'addons.activate',
  });
  activate.connect('activate', (_action, parameter) => {
    if (!(parameter instanceof GLib.Variant)) throw new Error(`Expect a GVariant, got ${parameter}`);
    const [id, active] = ( /** @type {any[]} */ (parameter.deepUnpack()));
    if (typeof id !== 'string' || typeof active !== 'boolean') {
      throw new Error(`Expected (sb), got ${id} and ${active}`);
    }
  });
  action_map.add_action(activate);

  const trash = new Gio.SimpleAction({
    name: 'addons.trash',
    parameter_type: GLib.VariantType.new('s'),
  });
  trash.connect('activate', (_action, parameter) => {
    (async () => {
        if (parameter === null) throw new Error;
        const [id] = parameter.get_string();
        if (id === null) throw new Error;
        const msg = (
        /**
         * @type {{
         *   choose_async: (cancellable: Gio.Cancellable | null) => Promise<string>;
         * } & Adw.MessageDialog}
         */
          (new Adw.MessageDialog())
        );
        msg.set_heading('Delete this add-on?');
        msg.set_body('Deleted content is recoverable from trash can.');
        msg.add_response('trash.cancel', 'Cancel');
        msg.add_response('trash.proceed', 'Proceed');
        msg.set_response_appearance('trash.proceed', Adw.ResponseAppearance.DESTRUCTIVE);
        msg.set_close_response('trash.cancel');
        msg.set_default_response('trash.proceed');
        msg.set_transient_for(parent_window || null);
        const response = await msg.choose_async(null)
        switch (response) {
        case 'trash.cancel':
          return;
        case 'trash.proceed':
          break;
        default:
          throw new Error;
        }
        try {
          await client.services.addons.async_call('Delete', id)
        } catch (error) {
          logError(error);
        }
    })().catch(logError);
  });
  action_map.add_action(trash);
}
