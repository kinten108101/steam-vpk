import { DBusMonitor, PrettyProxy } from './api.js';
import InjectButtonSet from './inject-button-set.js';
import InjectConsole from './inject-console.js';
import { ProfileBar } from './profile-bar.js';
import { promise_wrap } from './utils.js';

export default function InjectConsolePresenter(
{ inject_console,
  inject_button_set,
  profile_bar,
  proxy,
  monitor,
}:
{ inject_console?: InjectConsole;
  inject_button_set?: InjectButtonSet;
  profile_bar?: ProfileBar;
  proxy: PrettyProxy;
  monitor: DBusMonitor;
}) {
  const injections = new Map<string, {
    using_logs_changed: number | undefined;
    using_cancellable: number | undefined;
  }>();
  const owner_map: WeakMap<InjectConsole, string> = new WeakMap();
  monitor.connect(DBusMonitor.Signals.connected, (_obj, connected) => {
    promise_wrap(async () => {
      if (!connected) {
        // unavailable
        profile_bar?.send_status_update('Disconnected');
        // TODO(kinten): Disable actions instead?
        inject_button_set?.make_sensitive(false);
      } else {
        // available
        let last_injection: string | undefined = undefined;
        if (inject_console) last_injection = owner_map.get(inject_console);
        let has = true;
        if (last_injection !== undefined) {
          const result: [boolean] | undefined = await proxy.service_call_async('Has', last_injection);
          if (result === undefined) throw new Error('wow');
          ([has] = result);
        }
        if (last_injection === undefined || (last_injection !== undefined && !has)) {
          profile_bar?.send_status_update('State lost');
          inject_console?.reset();
          inject_button_set?.reset();
          return;
        }
        profile_bar?.send_status_update('Reconnected');
        inject_button_set?.make_sensitive(true);
      }
    });
  })
  proxy.service_connect('RunningPrepare', (_obj, id: string) => {
    console.log('prepare!');
    if (inject_console) owner_map.set(inject_console, id);
    const using_logs_changed = proxy.service_connect('LogsChanged', (_obj, _id, msg) => {
      inject_console?.add_line(msg);
    });
    const using_cancellable = proxy.service_connect('Cancelled', () => {
      inject_button_set?.hold_set_spinning(true);
    });
    injections.set(id, {
      using_logs_changed,
      using_cancellable,
    });
    inject_console?.clean_output();
    inject_button_set?.set_id(id);
  });
  proxy.service_connect('SessionStart', (_obj) => {
    inject_console?.set_switch(true);
    inject_button_set?.set_state_button(InjectButtonSet.Buttons.hold);
  });
  proxy.service_connect('SessionEnd', (_obj) => {

    inject_button_set?.set_state_button(InjectButtonSet.Buttons.done);
  });
  proxy.service_connect('SessionFinished', (_obj) => {
    inject_console?.set_switch(false);
    inject_button_set?.reset();
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

  console.log('presenter implemented');
}
