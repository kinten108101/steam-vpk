import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import { g_variant_unpack, promise_wrap } from '../utils.js';
import { PrettyProxy } from '../api.js';

export default function InjectorActions(
{ proxy,
  action_map,
}:
{ proxy: PrettyProxy,
  action_map: Gio.ActionMap;
}
) {
  const run = new Gio.SimpleAction({ name: 'injector.run' });
  run.connect('activate', () => {
    promise_wrap(async () => {
      await proxy.service_call_async('Run');
    });
  });
  action_map.add_action(run);

  const done = new Gio.SimpleAction({ name: 'injector.done', parameter_type: GLib.VariantType.new('s') });
  done.connect('activate', (_action, parameter) => {
    const id = g_variant_unpack<string>(parameter, 'string');
    promise_wrap(async () => {
      await proxy.service_call_async('Done', id);
    });
  });
  action_map.add_action(done);

  const cancel = new Gio.SimpleAction({ name: 'injector.cancel', parameter_type: GLib.VariantType.new('s') });
  cancel.connect('activate', (_action, parameter) => {
    const id = g_variant_unpack<string>(parameter, 'string');
    promise_wrap(async () => {
      await proxy.service_call_async('Cancel', id);
    });
  });
  action_map.add_action(cancel);

  // TODO(kinten): Radio to choose strategy instead of activating
  const run_game = new Gio.SimpleAction({ name: 'injector.inject-with-game' });
  run_game.connect('activate', () => {
    promise_wrap(async () => {
      await proxy.service_call_async('RunWithGame');
    });
  });
  action_map.add_action(run_game);

  return action_map;
}
