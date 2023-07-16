import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

export interface ActionMap {
  addAction(action: Gio.Action): void;
  lookupAction(actionName: string): Gio.Action | null;
  addActionEntries(entries: Gio.ActionEntry[], user_data: any | null): void;
  removeAction(actionName: string | null): void;
}

export interface SimpleActionBuilderConstructorStateful {
  name: string,
  parameterType?: GLib.VariantType,
  state: GLib.Variant,
}

export class SimpleActionStatefulBuilder {
  instance: Gio.SimpleAction;

  constructor(param: SimpleActionBuilderConstructorStateful) {
    this.instance = new Gio.SimpleAction({
      name: param.name,
      parameter_type: param.parameterType || null,
      state: param.state,
    })
  }

  build() {
    return this.instance;
  }

  /**
   * If `action` is currently enabled.
   *
   * If the action is disabled then calls to g_action_activate() and
   * g_action_change_state() have no effect.
   */
  enabled(val: boolean) {
    this.instance.enabled(val);
    return this;
  }

  /**
   * Sets the state hint for the action.
   *
   * See g_action_get_state_hint() for more information about
   * action state hints.
   * @param state_hint a #GVariant representing the state hint
   */
  stateHint(val: GLib.Variant) {
    this.instance.set_state_hint(val);
    return this;
  }

  activate(callback: Gio.SimpleAction.ActivateSignalCallback) {
    this.instance.connect('activate', callback);
    return this;
  }

  changeState(callback: Gio.SimpleAction.ChangeStateSignalCallback) {
    this.instance.connect('change-state', callback);
    return this;
  }
}

export interface SimpleActionBuilderConstructor {
 /**
   * The name of the action. This is mostly meaningful for identifying
   * the action once it has been added to a #GSimpleActionGroup.
   */
  name: string,
  /**
   * The type of the parameter that must be given when activating the
   * action.
   */
  parameterType?: GLib.VariantType,
}

export class SimpleActionBuilder {
  instance: Gio.SimpleAction;

  constructor(param: SimpleActionBuilderConstructor) {
    this.instance = new Gio.SimpleAction({
      name: param.name,
      parameter_type: param.parameterType || null,
    });
  }

  build() {
    return this.instance;
  }

  /**
   * If `action` is currently enabled.
   *
   * If the action is disabled then calls to g_action_activate() and
   * g_action_change_state() have no effect.
   */
  enabled(val: boolean) {
    this.instance.enabled(val);
    return this;
  }

  activate(callback: Gio.SimpleAction.ActivateSignalCallback) {
    this.instance.connect('activate', callback);
    return this;
  }
}

/**
 * @deprecated Current implementation of the builder pattern is not any more advantageous.
 */
export const SimpleAction = {
  builder: SAbuilder,
}

function SAbuilder(param: {
 /**
   * The name of the action. This is mostly meaningful for identifying
   * the action once it has been added to a #GSimpleActionGroup.
   */
  name: string,
  /**
   * The type of the parameter that must be given when activating the
   * action.
   */
  parameterType?: GLib.VariantType,
  state: GLib.Variant,
}): SimpleActionStatefulBuilder;
function SAbuilder(param: {
 /**
   * The name of the action. This is mostly meaningful for identifying
   * the action once it has been added to a #GSimpleActionGroup.
   */
  name: string,
  /**
   * The type of the parameter that must be given when activating the
   * action.
   */
  parameterType?: GLib.VariantType,
}
): SimpleActionBuilder;
function SAbuilder(param: any) {
  if (param.state) {
    return new SimpleActionStatefulBuilder(param);
  }
  return new SimpleActionBuilder(param);
}
