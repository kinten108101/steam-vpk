import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import { DBusMonitor, PrettyProxy } from './api.js';
import HeaderBox, { HeaderboxConsole } from './ui/headerbox.js';
import InjectButtonSet from './ui/inject-button-set.js';
import StatusManager, { BuildStatus } from './model/status-manager.js';

export default function InjectConsolePresenter(
{ inject_console,
  inject_button_set,
  proxy,
  monitor,
  status_manager,
}:
{ inject_console: HeaderboxConsole;
  headerbox: HeaderBox;
  inject_button_set: InjectButtonSet;
  proxy: PrettyProxy;
  monitor: DBusMonitor;
  status_manager: StatusManager;
}) {
  const injections = new Map<string, {
    using_logs_changed: number | undefined;
    using_cancellable: number | undefined;
    tracker: BuildStatus | undefined;
  }>();
  const owner_map: WeakMap<HeaderboxConsole, string> = new WeakMap();
  const on_connection_changed = async (connected: boolean) => {
    if (!connected) {
      // unavailable
      inject_button_set.make_sensitive(false);
    } else {
      // available
      let last_injection: string | undefined = undefined;
      if (inject_console) last_injection = owner_map.get(inject_console);
      let has = true;
      if (last_injection !== undefined) {
        const result: [boolean] | undefined = await proxy.service_call_async('Has', last_injection);
        if (result === undefined) throw new Error;
        ([has] = result);
      }
      if (last_injection === undefined || (last_injection !== undefined && !has)) {
        inject_console.reset();
        inject_button_set.reset();
        return;
      }
      inject_button_set.make_sensitive(true);
    }
  };
  (on_connection_changed)(monitor.connected).catch(error => logError(error));
  monitor.connect('notify::connected', (_obj, connected) => {
    (on_connection_changed)(connected).catch(error => logError(error));
  })
  proxy.service_connect('RunningPrepare', (_obj, id: string) => {
    console.log('prepare!');
    const tracker = status_manager.add_build_tracker();
    if (inject_console) owner_map.set(inject_console, id);
    const using_logs_changed = proxy.service_connect('LogsChanged', (_obj, _id, msg) => {
      inject_console.add_line(msg);
    });
    const using_cancellable = proxy.service_connect('Cancelled', () => {
      inject_button_set.hold_set_spinning(true);
    });
    injections.set(id, {
      using_logs_changed,
      using_cancellable,
      tracker,
    });
    inject_console.clean_output();
    inject_button_set.set_id(id);
  });
  proxy.service_connect('SessionStart', (_obj) => {
    inject_button_set.set_state_button(InjectButtonSet.Buttons.hold);
  });
  proxy.service_connect('SessionEnd', (_obj) => {
    inject_button_set.set_state_button(InjectButtonSet.Buttons.done);
  });
  proxy.service_connect('SessionFinished', (_obj) => {
    inject_button_set.reset();
  });
  proxy.service_connect('RunningCleanup', (_obj, id: string) => {
    const mem = injections.get(id);
    if (!mem) return;
    const { using_logs_changed, using_cancellable } = mem;
    if (using_logs_changed) proxy.service_disconnect(using_logs_changed);
    if (using_cancellable) proxy.service_disconnect(using_cancellable);
    injections.delete(id);
    if (inject_console) owner_map.delete(inject_console);
  });

  function init() {
    inject_console.reset();
    return services;
  }

  const services = {
    init,
  };

  return services;
}

export function InjectorActions(
{ action_map,
  proxy,
}:
{ action_map: Gio.ActionMap;
  proxy: PrettyProxy;
}) {
  const run = new Gio.SimpleAction({
    name: 'injector.run',
  });
  run.connect('activate', () => {
    (async () => {
      await proxy.service_call_async('Run');
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
      await proxy.service_call_async('Done', id);
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
      await proxy.service_call_async('Cancel', id);
    })().catch(error => logError(error));
  });
  action_map.add_action(cancel);

  // TODO(kinten): Radio to choose strategy instead of activating
  const run_game = new Gio.SimpleAction({
    name: 'injector.inject-with-game',
  });
  run_game.connect('activate', () => {
    (async () => {
      await proxy.service_call_async('RunWithGame');
    })().catch(error => logError(error));
  });
  action_map.add_action(run_game);
}
