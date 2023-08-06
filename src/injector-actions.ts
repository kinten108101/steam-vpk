import GLib from 'gi://GLib';
import Gdk from 'gi://Gdk';
import Gtk from 'gi://Gtk';
import Gio from 'gi://Gio';
import Injector, { Injection } from './injector.js';
import { g_variant_unpack, promise_wrap } from './utils.js';

export default function InjectorActions(
{
  injector,
  action_map,
  parent_window,
}:
{
  injector: Injector;
  action_map: Gio.ActionMap;
  parent_window?: Gtk.Window;
}
) {
  const attempts = new Map<number, Injection>();

  const run = new Gio.SimpleAction({ name: 'injector.run' });
  run.connect('activate', () => {
    promise_wrap(async () => {
      const inj = injector.make_injection();
      attempts.set(inj.id, inj);
      injector.run(inj);
    });
  });
  action_map.add_action(run);

  const done = new Gio.SimpleAction({ name: 'injector.done', parameter_type: GLib.VariantType.new('i') });
  done.connect('activate', (_action, parameter) => {
    const id = g_variant_unpack<number>(parameter, 'number');
    const inj = attempts.get(id);
    if (inj === undefined) {
      console.warn('Could not find injection attempt. Quitting...');
      return;
    }
    injector.finish(inj);
    attempts.delete(id);
  });
  action_map.add_action(done);

  const cancel = new Gio.SimpleAction({ name: 'injector.cancel', parameter_type: GLib.VariantType.new('i') });
  cancel.connect('activate', (_action, parameter) => {
    const id = g_variant_unpack<number>(parameter, 'number');
    const inj = attempts.get(id);
    if (inj === undefined) {
      console.warn('Could not find injection attempt. Quitting...');
      return;
    }
    inj.cancellable.cancel();
  });
  action_map.add_action(cancel);

  // TODO(kinten): Radio to choose strategy instead of activating
  const run_game = new Gio.SimpleAction({ name: 'injector.inject-with-game' });
  run_game.connect('activate', () => {
    promise_wrap(async () => {
      const inj = injector.make_injection();
      const game_hook = inj.connect(Injection.Signals.end, () => {
        inj.disconnect(game_hook);
        inj.log('Starting Left 4 Dead 2...');
        // TODO(kinten): Injection cleanup method
        Gtk.show_uri(parent_window || null, 'steam://rungameid/550', Gdk.CURRENT_TIME);
      });
      attempts.set(inj.id, inj);
      injector.run(inj);
    });
  });
  action_map.add_action(run_game);
}
