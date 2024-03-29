import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import StatusManager from '../model/status-manager.js';

/**
 * @param {{
 *   action_map: Gio.ActionMap;
 *   status_manager: StatusManager;
 * }} params
 */
export function StatusDebugActions(
{ action_map,
  status_manager,
}) {
  const make_error = new Gio.SimpleAction({
    name: 'status.error',
    parameter_type: GLib.VariantType.new('s'),
  });
  make_error.connect('activate', (_action, parameter) => {
    /**
     * @type {string | undefined}
     */
    const msg = parameter?.recursiveUnpack();
    if (msg === undefined) throw new Error;
    status_manager.add_error({
      short: 'Untitled',
      msg,
    });
  });
  action_map.add_action(make_error);

  const pop_status = new Gio.SimpleAction({
    name: 'status.pop',
  });
  pop_status.connect('activate', () => {
    const last = status_manager.get_n_items() - 1;
    if (last === -1) return;
    status_manager.remove(last);
  });
  action_map.add_action(pop_status);
}
