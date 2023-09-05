import GLib from 'gi://GLib';
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
    using_logs_changed?: number;
    using_cancellable?: number;
    using_elapsed?: number;
    tracker?: BuildStatus;
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
      let has: boolean = true;
      if (last_injection !== undefined) {
        try {
          has = await client.services.injector.call('Has', '(b)', last_injection);
        } catch (error) {
          logError(error);
          has = false;
        }
      }
      if (last_injection === undefined || (last_injection !== undefined && !has)) {
        inject_console.reset();
        widget_cleanup();
        if (last_injection !== undefined) handler_cleanup(last_injection);
        return;
      }
      inject_button_set.make_sensitive(true);
    }
  };
  on_connection_changed(client.connected).catch(error => logError(error));
  client.connect('notify::connected', () => {
    on_connection_changed(client.connected).catch(error => logError(error));
  })
  client.services.injector.subscribe('RunningPrepare', (id: string) => {
    (async() => {
      const tracker = status_manager.add_build_tracker();
      if (inject_console) owner_map.set(inject_console, id);

      let using_logs_changed;
      const update_logs_changed = (msg: string) => {
        console.log('logs-changed', msg);
        inject_console.add_line(msg);
        tracker.status = msg.replaceAll('.', '');
      };
      let line;
      try {
        line = await client.services.injections(id).call('GetLatestLine', '(s)');
      } catch (error) {
        logError(error);
      }
      update_logs_changed(line);
      using_logs_changed = client.services.injections(id).subscribe('LogsChanged', update_logs_changed);

      const using_elapsed = client.services.injections(id).subscribe('notify::Elapsed', (val: unknown) => {
        if (typeof val !== 'number') return;
        tracker.elapsed = val;
      });
      const using_cancellable = client.services.injections(id).subscribe('Cancelled', () => {
        inject_button_set.hold_set_spinning(true);
      });
      injections.set(id, {
        using_logs_changed,
        using_cancellable,
        using_elapsed,
        tracker,
      });
      inject_console.clean_output();
      inject_button_set.set_id(id);
      try {
        await client.services.injector.property_set('RunningPrepared', GLib.Variant.new_boolean(true));
      } catch (error) {
        logError(error);
      }
    })().catch(error => logError(error));
  });
  client.services.injector.subscribe('SessionStart', () => {
    inject_button_set.set_state_button(InjectButtonSet.Buttons.hold);
  });
  client.services.injector.subscribe('SessionEnd', () => {
    inject_button_set.set_state_button(InjectButtonSet.Buttons.done);
  });
  function handler_cleanup(id: string) {
    const mem = injections.get(id);
    if (!mem) return;
    const { using_logs_changed, using_cancellable, using_elapsed, tracker } = mem;
    if (tracker) tracker.clear();
    if (using_logs_changed) client.services.injections(id).unsubscribe(using_logs_changed);
    if (using_elapsed) client.services.injections(id).unsubscribe(using_elapsed);
    if (using_cancellable) client.services.injections(id).unsubscribe(using_cancellable);
    injections.delete(id);
    if (inject_console) owner_map.delete(inject_console);
  }
  function widget_cleanup() {
    inject_button_set.reset();
  }
  client.services.injector.subscribe('SessionFinished', (id: string) => {
    handler_cleanup(id);
    widget_cleanup();
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
