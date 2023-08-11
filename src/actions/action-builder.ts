import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import { promise_wrap } from '../utils.js';

class BuilderPatternError extends Error {
}

class MissingRequiredParam extends BuilderPatternError {
  constructor(param_name: string) {
    super(`Missing required parameter \"${param_name}\"`);
  }
}

interface ActivateAsyncSignalCallback {
    ($obj: Gio.SimpleAction, parameter: GLib.Variant | null): Promise<void>;
}

class SimpleActionBuilder {
  parammap: Map<string, any> = new Map;
  config: {
    prefix?: string
  } = {};

  constructor(config: SimpleActionBuilder['config'] = {}) {
    this.config = config;
  }

  #get_param<T extends any>(param_name: string): T | undefined {
    return this.parammap.get(param_name);
  }

  #get_param_required<T extends any>(param_name: string): T {
    const param = this.parammap.get(param_name);
    if (param === undefined) throw new MissingRequiredParam(param_name);
    return param;
  }

  name(val: string) {
    this.parammap.set('name', val);
    return this;
  }

  state(val: GLib.Variant): this {
    this.parammap.set('state', val);
    return this;
  }

  #handleTypeSignature(val: GLib.VariantType | string): GLib.VariantType {
    const type = (() => {
      if (typeof val === 'string') return GLib.VariantType.new(val);
      return val;
    })();
    return type;
  }

  state_hint(val: GLib.Variant): this {
    this.parammap.set('state-hint', val);
    return this;
  }

  parameter_type(type: GLib.VariantType): this;
  parameter_type(type_string: string): this;
  parameter_type(val: GLib.VariantType | string): this {
    const type = this.#handleTypeSignature(val);
    this.parammap.set('parameter-type', type);
    return this;
  }

  activate(cb: Gio.SimpleAction.ActivateSignalCallback) {
    this.parammap.set('activate', cb);
    this.parammap.set('is-activate-async', false);
    return this;
  }

  activate_async(cb: ActivateAsyncSignalCallback) {
    this.parammap.set('activate', cb);
    this.parammap.set('is-activate-async', true);
    return this;
  }

  change_state(cb: Gio.SimpleAction.ChangeStateSignalCallback) {
    this.parammap.set('change-state', cb);
    return this;
  }

  insert(action_map: Gio.ActionMap) {
    this.parammap.set('action-map', action_map);
    return this;
  }

  build() {
    const name = (() => {
      const name = this.#get_param_required<string>('name');
      const prefix = this.config.prefix;
      if (prefix !== undefined) return `${prefix}.${name}`;
      return name;
    })();
    const state = this.#get_param<GLib.Variant>('state');
    const parameter_type = this.#get_param<GLib.VariantType>('parameter-type');
    const product = new Gio.SimpleAction({ name, parameter_type, state: state || null });
    const state_hint = this.#get_param<GLib.Variant>('state-hint');
    if (state_hint !== undefined)
      product.set_state_hint(state_hint);
    const activate = this.#get_param<Gio.SimpleAction.ActivateSignalCallback | ActivateAsyncSignalCallback>('activate');
    if (activate !== undefined) {
      const is_activate_async = this.#get_param_required<boolean>('is-activate-async');
      if (is_activate_async) {
        product.connect('activate', (action, parameter) => {
          promise_wrap(activate as ActivateAsyncSignalCallback, action, parameter);
        });
      }
      else {
        product.connect('activate', activate as Gio.SimpleAction.ActivateSignalCallback);
      }
    }
    const change_state = this.#get_param<Gio.SimpleAction.ChangeStateSignalCallback>('change-state');
    if (change_state !== undefined)
      product.connect('change-state', change_state);
    const action_map = this.#get_param<Gio.ActionMap>('action-map');
    if (action_map !== undefined)
      action_map.add_action(product);
    this.reset();
    return product;
  }

  reset() {
    this.parammap.clear();
    return this;
  }
}

export namespace SimpleAction {
  export function builder(...params: ConstructorParameters<typeof SimpleActionBuilder>) {
    return new SimpleActionBuilder(...params);
  }
}
