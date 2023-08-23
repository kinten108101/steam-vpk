import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import { g_variant_unpack, promise_wrap } from '../steam-vpk-utils/utils.js';
import { PrettyProxy } from '../api.js';

export default function InjectorActions(
{ proxy,
}:
{ proxy: PrettyProxy,
}) {
  const actions: Gio.Action[] = [];

  const run = new Gio.SimpleAction({ name: 'injector.run' });
  run.connect('activate', () => {
    promise_wrap(async () => {
      await proxy.service_call_async('Run');
    });
  });
  actions.push(run);

  const done = new Gio.SimpleAction({ name: 'injector.done', parameter_type: GLib.VariantType.new('s') });
  done.connect('activate', (_action, parameter) => {
    const id = g_variant_unpack<string>(parameter, 'string');
    promise_wrap(async () => {
      await proxy.service_call_async('Done', id);
    });
  });
  actions.push(done);

  const cancel = new Gio.SimpleAction({ name: 'injector.cancel', parameter_type: GLib.VariantType.new('s') });
  cancel.connect('activate', (_action, parameter) => {
    const id = g_variant_unpack<string>(parameter, 'string');
    promise_wrap(async () => {
      await proxy.service_call_async('Cancel', id);
    });
  });
  actions.push(cancel);

  // TODO(kinten): Radio to choose strategy instead of activating
  const run_game = new Gio.SimpleAction({ name: 'injector.inject-with-game' });
  run_game.connect('activate', () => {
    promise_wrap(async () => {
      await proxy.service_call_async('RunWithGame');
    });
  });
  actions.push(run_game);

  function export2actionMap(action_map: Gio.ActionMap) {
    actions.forEach(x => {
      action_map.add_action(x);
    });
    return services;
  }

  const services = {
    export2actionMap,
  }

  return services;
}
