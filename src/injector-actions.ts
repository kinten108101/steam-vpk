import Gio from 'gi://Gio';
import Injector, { Injection } from './injector.js';
import { promise_wrap } from './utils.js';

export default function InjectorActions(
{
  injector,
  action_map,
}:
{
  injector: Injector;
  action_map: Gio.ActionMap;
}
) {
  const run = new Gio.SimpleAction({ name: 'injector.run' });
  run.connect('activate', () => {
    promise_wrap(async () => {
      const inj = new Injection();
      await injector.cleanup();
      await injector.load(inj);
      await injector.link(inj);
    });
  });
  action_map.add_action(run);

  const cancel = new Gio.SimpleAction({ name: 'injector.cancel' });
  cancel.connect('activate', () => {

  });
  action_map.add_action(cancel);
}
