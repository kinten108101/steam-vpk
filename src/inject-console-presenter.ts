import { DBusMonitor, PrettyProxy } from './api.js';
import HeaderBox, { HeaderboxConsole } from './headerbox.js';
import InjectButtonSet from './inject-button-set.js';
import { ProfileBar } from './profile-bar.js';
import StatusManager from './status.js';
import { promise_wrap } from './steam-vpk-utils/utils.js';

export default function InjectConsolePresenter(
{ inject_console,
  headerbox,
  inject_button_set,
  profile_bar,
  proxy,
  monitor,
  status_manager,
}:
{ inject_console?: HeaderboxConsole;
  headerbox: HeaderBox;
  inject_button_set?: InjectButtonSet;
  profile_bar?: ProfileBar;
  proxy: PrettyProxy;
  monitor: DBusMonitor;
  status_manager: StatusManager;
}) {
  const injections = new Map<string, {
    using_logs_changed: number | undefined;
    using_cancellable: number | undefined;
  }>();
  const owner_map: WeakMap<HeaderboxConsole, string> = new WeakMap();
  let connect_error: string;
  monitor.connect(DBusMonitor.Signals.connected, (_obj, connected) => {
    promise_wrap(async () => {
      if (!connected) {
        // unavailable
        profile_bar?.send_status_update('Disconnected');
        connect_error = status_manager.add_error('Disconnected', 'Could not connect to daemon. Make sure that you\'ve installed Add-on Box.');
        // TODO(kinten): Disable actions instead?
        inject_button_set?.make_sensitive(false);
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
          profile_bar?.send_status_update('State lost');
          status_manager.clear_status(connect_error);
          inject_console?.reset();
          inject_button_set?.reset();
          return;
        }
        profile_bar?.send_status_update('Reconnected');
        status_manager.clear_status(connect_error);
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
    headerbox.open_with_box('inject_console_box');
    inject_button_set?.set_state_button(InjectButtonSet.Buttons.hold);
  });
  proxy.service_connect('SessionEnd', (_obj) => {
    inject_button_set?.set_state_button(InjectButtonSet.Buttons.done);
  });
  proxy.service_connect('SessionFinished', (_obj) => {
    if (headerbox.current_box === 'inject_console_box')
      headerbox.reveal_headerbox(false);
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

  function init() {
    inject_console?.reset();
    return services;
  }

  const services = {
    init,
  };

  return services;
}
