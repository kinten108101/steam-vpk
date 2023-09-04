import HeaderBox, { HeaderboxConsole } from '../ui/headerbox.js';
import InjectButtonSet from '../ui/inject-button-set.js';
import StatusManager, { BuildStatus } from '../model/status-manager.js';
import AddonBoxClient from '../backend/client.js';

export default function InjectConsolePresenter(
{ inject_console,
  inject_button_set,
  client,
  status_manager,
}:
{ inject_console: HeaderboxConsole;
  headerbox: HeaderBox;
  inject_button_set: InjectButtonSet;
  client: AddonBoxClient;
  status_manager: StatusManager;
}) {
  const injections = new Map<string, {
    using_logs_changed: number;
    using_cancellable: number;
    tracker: BuildStatus;
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
        const result: [boolean] | undefined = await client.services.injector.call('Has', last_injection);
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
  on_connection_changed(client.connected).catch(error => logError(error));
  client.connect('notify::connected', () => {
    (on_connection_changed)(client.connected).catch(error => logError(error));
  })
  client.services.injector.subscribe('RunningPrepare', (id: string) => {
    console.log('prepare!');
    const tracker = status_manager.add_build_tracker();
    if (inject_console) owner_map.set(inject_console, id);
    const using_logs_changed = client.services.injector.subscribe('LogsChanged', (_id, msg: string) => {
      inject_console.add_line(msg);
      tracker.status = msg.replaceAll('.', '');
    });
    const using_cancellable = client.services.injector.subscribe('Cancelled', () => {
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
  client.services.injector.subscribe('SessionStart', (id: string) => {
    const mem = injections.get(id);
    if (!mem) return;
    const { tracker } = mem;
    tracker.time();
    inject_button_set.set_state_button(InjectButtonSet.Buttons.hold);
  });
  client.services.injector.subscribe('SessionEnd', (id: string) => {
    const mem = injections.get(id);
    if (!mem) return;
    const { tracker } = mem;
    tracker.timeEnd();
    inject_button_set.set_state_button(InjectButtonSet.Buttons.done);
  });
  client.services.injector.subscribe('SessionFinished', (id: string) => {
    const mem = injections.get(id);
    if (!mem) return;
    const { using_logs_changed, using_cancellable, tracker } = mem;
    tracker.clear();
    inject_button_set.reset();
    if (using_logs_changed) client.services.injector.unsubscribe(using_logs_changed);
    if (using_cancellable) client.services.injector.unsubscribe(using_cancellable);
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
