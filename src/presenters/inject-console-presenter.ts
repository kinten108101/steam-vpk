import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import HeaderBox, { HeaderboxConsole } from '../ui/headerbox.js';
import InjectButtonSet from '../ui/inject-button-set.js';
import StatusManager, { BuildStatus } from '../model/status-manager.js';
import AddonBoxClient from '../backend/client.js';

export default function InjectConsolePresenter(
{ inject_console,
  inject_button_set,
  inject_actions,
  client,
  status_manager,
  gsettings,
}:
{ inject_console: HeaderboxConsole;
  headerbox: HeaderBox;
  inject_button_set: InjectButtonSet;
  inject_actions: Gio.SimpleAction[];
  client: AddonBoxClient;
  status_manager: StatusManager;
  gsettings: Gio.Settings;
}) {

  function enable_inject_actions() {
    for (const action of inject_actions) {
      if (action === null) continue;
      action.set_enabled(true);
    }
  }

  function disable_inject_actions() {
    for (const action of inject_actions) {
      if (action === null) continue;
      action.set_enabled(false);
    }
  }

  const injections = new Map<string, {
    using_logs_changed?: number;
    using_cancellable?: number;
    using_elapsed?: number;
    tracker?: BuildStatus;
  }>();
  const owner_map: WeakMap<HeaderboxConsole, string> = new WeakMap();

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

  let prev_connected: boolean;
  async function on_connection_changed() {
    const connected = client.connected;
    if (connected === prev_connected) return;
    prev_connected = connected;
    if (!connected) {
      disable_inject_actions();
    } else {
      enable_inject_actions();
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
        inject_button_set.reset();
        if (last_injection !== undefined) handler_cleanup(last_injection);
      }
    }
  };

  on_connection_changed().catch(error => logError(error));
  client.connect('notify::connected', () => {
    on_connection_changed().catch(error => logError(error));
  });

  client.services.injector.subscribe('RunningPrepare', (id: string) => {
    (async() => {
      const tracker = status_manager.add_build_tracker();
      if (inject_console) owner_map.set(inject_console, id);

      let using_logs_changed;
      const update_logs_changed = (msg: string) => {
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

      let enable_start_game: boolean = false;
      try {
        enable_start_game = gsettings.get_boolean('injector-enable-start-game');
      } catch (error) {
        logError(error);
      }

      if (enable_start_game) {
        try {
          await client.services.injector.call('EnableRunWithGame', null, id, true);
        } catch (error) {
          logError(error);
        }
      }

      try {
        await client.services.injector.property_set('RunningPrepared', GLib.Variant.new_boolean(true));
      } catch (error) {
        logError(error);
      }
    })().catch(error => logError(error));
  });
  client.services.injector.subscribe('SessionStart', () => {
    inject_button_set.set_state_button('hold');
  });
  client.services.injector.subscribe('SessionEnd', (id: string) => {
    const mem = injections.get(id);
    if (!mem) return;
    const { tracker } = mem;
    if (tracker) tracker.finished = true;
    inject_button_set.set_state_button('done');
  });
  client.services.injector.subscribe('SessionFinished', (id: string) => {
    handler_cleanup(id);

    inject_button_set.reset();
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
