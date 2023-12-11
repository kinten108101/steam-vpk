import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import AddonBoxClient from '../backend/client.js';

/**
 * @param {{
 *   action_map: Gio.ActionMap;
 *   client: AddonBoxClient;
 *   gsettings: Gio.Settings;
 * }} params
 */
export default function InjectorActions(
{ action_map,
  client,
  gsettings,
}) {
  const run = new Gio.SimpleAction({
    name: 'injector.run',
  });
  run.connect('activate', () => {
    (async () => {
      await client.services.injector.call('Run');
    })().catch(error => logError(error));
  });
  action_map.add_action(run);

  const done = new Gio.SimpleAction({
    name: 'injector.done',
    parameter_type: GLib.VariantType.new('s'),
  });
  done.connect('activate', (_action, parameter) => {
    if (parameter === null) throw new Error;
    const [id] = parameter.get_string();
    if (id === null) throw new Error;
    (async () => {
      await client.services.injector.call('Done', null, id);
    })().catch(error => logError(error));
  });
  action_map.add_action(done);

  const cancel = new Gio.SimpleAction({
    name: 'injector.cancel',
    parameter_type: GLib.VariantType.new('s'),
  });
  cancel.connect('activate', (_action, parameter) => {
    if (parameter === null) throw new Error;
    const [id] = parameter.get_string();
    if (id === null) throw new Error;
    (async () => {
      await client.services.injector.call('Cancel', null, id);
    })().catch(error => logError(error));
  });
  action_map.add_action(cancel);

  const run_game = new Gio.SimpleAction({
    name: 'injector.inject-with-game',
  });
  run_game.connect('activate', () => {
    (async () => {
      await client.services.injector.call('RunWithGame');
    })().catch(error => logError(error));
  });
  action_map.add_action(run_game);

  const toggle_start_game = new Gio.SimpleAction({
    name: 'injector.toggle-start-game',
    state: GLib.Variant.new_boolean(false),
  });
  toggle_start_game.connect('activate', (action) => {
    const val = action.get_state();
    if (val === null) throw new Error;
    const newval = (() => {
      const _newval = val.get_boolean();
      if (_newval === null) throw new Error;
      return GLib.Variant.new_boolean(!_newval);
    })();
    gsettings.set_value('injector-enable-start-game', newval);
  });
  toggle_start_game.connect('change-state', (action, value) => {
    if (value === null) throw new Error;
    action.set_state(value);
  });
  function update_enable_start_game() {
    let val;
    try {
      val = gsettings.get_value('injector-enable-start-game');
    } catch (error) {
      logError(error);
      return;
    }
    toggle_start_game.change_state(val);
  }
  gsettings.connect('changed::injector-enable-start-game', update_enable_start_game);
  update_enable_start_game();
  action_map.add_action(toggle_start_game);

  return {
    get_actions() {
      return {
        run,
        done,
        cancel,
        run_game,
        toggle_start_game,
      }
    }
  }
}
