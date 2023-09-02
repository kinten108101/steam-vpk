import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import AddonBoxClient from '../backend/client.js';

export default function InjectorActions(
{ action_map,
  client,
}:
{ action_map: Gio.ActionMap;
  client: AddonBoxClient;
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

  // TODO(kinten): Radio to choose strategy instead of activating
  const run_game = new Gio.SimpleAction({
    name: 'injector.inject-with-game',
  });
  run_game.connect('activate', () => {
    (async () => {
      await client.services.injector.call('RunWithGame');
    })().catch(error => logError(error));
  });
  action_map.add_action(run_game);
}
