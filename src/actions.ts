import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import { Errors, StvpkError } from './errors.js';

export type ActionEntry = (StatelessActionEntry | StatefulActionEntry) & {
  accels?: string[];
};

export type StatelessActionEntry = {
  name: string,
  activate: (action: Gio.Action, param: GLib.Variant) => void,
};

export type StatefulActionEntry = {
  name: string,
  activate: (action: Gio.Action, param: GLib.Variant) => void,
  parameterType: string,
  state: unknown;
  changeState: (action: Gio.Action, param: GLib.Variant) => void,
};

export function makeAction(entry: ActionEntry): Gio.SimpleAction {
  if ('parameterType' in entry && 'state' in entry && 'changeState' in entry) {
    const { name, activate, parameterType, state, changeState } = entry;
    const parameterType_ = GLib.VariantType.new(parameterType);
    const state_: GLib.Variant = new GLib.Variant(parameterType, state);
    if (state_.get_type_string() !== parameterType) {
      log('Action GVariant parameter type did not match!');
      throw new StvpkError({
        code: Errors.UNEXPECTED_TYPE,
        message: 'Action GVariant parameter type did not match!',
      });
    }
    const action = new Gio.SimpleAction({
      enabled: true,
      name,
      state: state_,
      parameterType: parameterType_,
    });
    action.connect('activate', activate);
    action.connect('change-state', changeState);
    // TODO: How does state work? Why is state type readonly? State vs parameter?
    return action;
  }

  const { name, activate } = entry;
  const action = new Gio.SimpleAction({
    name,
  });
  action.connect('activate', activate);
  return action;
}
