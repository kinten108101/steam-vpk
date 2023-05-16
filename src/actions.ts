import Gio from 'gi://Gio';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type ActionEntry = (StatelessActionEntry | StatefulActionEntry);

export type StatelessActionEntry = Omit<PartialBy<Gio.ActionEntry, 'parameter_type'>, 'state' | 'change_state'> & {
  accels?: string[];
};

export type StatefulActionEntry = Omit<RequiredBy<PartialBy<Gio.ActionEntry, 'parameter_type'>, 'change_state'>, 'state'> & {
  startup: () => string;
  accels?: string[];
};

export const make_compat_action_entries = (actionList: ActionEntry[]): Gio.ActionEntry[] => {
  return actionList.map((actionEntry) => {
    if (!('startup' in actionEntry)) {
      return actionEntry as Gio.ActionEntry;
    }
    else {
      const compat_entry: Gio.ActionEntry = {} as Gio.ActionEntry;
      compat_entry.name = actionEntry.name;
      compat_entry.activate = actionEntry.activate;
      compat_entry.parameter_type = actionEntry.parameter_type || null;
      compat_entry.state = actionEntry.startup();
      compat_entry.change_state = actionEntry.change_state;
      return compat_entry;
    }
  });
};
