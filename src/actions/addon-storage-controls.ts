import Gtk from 'gi://Gtk';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import Adw from 'gi://Adw';
import AddonBoxClient from '../backend/client.js';

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
          (activate as ActivateAsyncSignalCallback)(action, parameter)
            .catch(error => logError(error));
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

export default function AddonStorageControls(
{ action_map,
  parent_window,
  client,
}:
{ action_map: Gio.ActionMap;
  parent_window?: Gtk.Window;
  client: AddonBoxClient;
}) {
  const builder = SimpleAction.builder({ prefix: 'addons' });

  const enableAddon = new Gio.SimpleAction({
    name: 'addons.enabled',
    state: GLib.Variant.new_boolean(false),
  });
  enableAddon.set_state_hint(GLib.Variant.new_array(GLib.VariantType.new('b'), [GLib.Variant.new_boolean(true), GLib.Variant.new_boolean(false)]));
  enableAddon.connect('activate', (action) => {
    const current = action.get_state();
    if (current === null) throw new Error;
    const content = current.get_boolean();
    action.change_state(GLib.Variant.new_boolean(!content));
  });
  enableAddon.connect('change-state', (_action, request) => {
    if (request === null) throw new Error;
    const newcontent = request.get_boolean();
    newcontent;
  });
  action_map.add_action(enableAddon);

  const includeInProfile = new Gio.SimpleAction({
    name: 'addons.box',
    parameter_type: GLib.VariantType.new('s'),
  });
  includeInProfile.connect('activate', (_, parameter) => {
    if (parameter === null) throw new Error;
    const [id] = parameter.get_string();
    if (id === null) throw new Error;
  });
  action_map.add_action(includeInProfile);

  const moveUp = new Gio.SimpleAction({
    name: 'addons.move-up',
    parameter_type: GLib.VariantType.new('s'),
  });
  moveUp.connect('activate', (_, parameter) => {
    if (parameter === null) throw new Error;
    const [id] = parameter.get_string();
    if (id === null) throw new Error;
  });
  action_map.add_action(moveUp);

  builder
    .name('move-down')
    .parameter_type('s')
    .activate((_, parameter) => {
      if (parameter === null) throw new Error;
      const [id] = parameter.get_string();
      if (id === null) throw new Error;
    })
    .insert(action_map)
    .build();

  builder
    .name('remove')
    .parameter_type('s')
    .activate_async(async (_action, parameter) => {
      if (parameter === null) throw new Error;
      const [id] = parameter.get_string();
      if (id === null) throw new Error;
      const msg = new Adw.MessageDialog() as ({
        choose_async: (cancellable: Gio.Cancellable | null) => Promise<string>;
      } & Adw.MessageDialog);
      msg.set_heading('Disuse this add-on? Current configurations in this profile will be permanently lost.');
      msg.set_body('Add-on can still be reused from the repository.');
      msg.add_response('remove.cancel', 'Cancel');
      msg.add_response('remove.proceed', 'Proceed');
      msg.set_response_appearance('remove.proceed', Adw.ResponseAppearance.DESTRUCTIVE);
      msg.set_transient_for(parent_window || null);
      const response = await msg.choose_async(null);
      if (response === 'remove.cancel' ) {
        console.log('Action addons.remove dismissed. Quitting...');
        return;
      }
      if (response !== 'remove.proceed') {
        console.warn(`Received unknown response in removeAddon. Got ${response}`);
      }
    })
    .insert(action_map)
    .build();

  builder
    .name('active')
    .parameter_type(GLib.VariantType.new_tuple([new GLib.VariantType('s'), new GLib.VariantType('b')]))
    .activate((_, parameter) => {
      if (!(parameter instanceof GLib.Variant)) throw new Error(`Expect a GVariant, got ${parameter}`);
      const [id, active] = parameter.deepUnpack() as Array<any>;
      if (typeof id !== 'string' || typeof active !== 'boolean') {
        throw new Error(`Expected (sb), got ${id} and ${active}`);
      }

    })
    .insert(action_map)
    .build();

  builder
    .name('trash')
    .parameter_type('s')
    .activate_async(async (_action, parameter) => {
      if (parameter === null) throw new Error;
      const [id] = parameter.get_string();
      if (id === null) throw new Error;
      const msg = new Adw.MessageDialog() as ({
        choose_async: (cancellable: Gio.Cancellable | null) => Promise<string>;
      } & Adw.MessageDialog);
      msg.set_heading('Delete this add-on?');
      msg.set_body('Deleted content is recoverable from trash can.');
      msg.add_response('trash.cancel', 'Cancel');
      msg.add_response('trash.proceed', 'Proceed');
      msg.set_response_appearance('trash.proceed', Adw.ResponseAppearance.DESTRUCTIVE);
      msg.set_close_response('trash.cancel');
      msg.set_default_response('trash.proceed');
      msg.set_transient_for(parent_window || null);
      const response = await msg.choose_async(null)
      switch (response) {
      case 'trash.cancel':
        return;
      case 'trash.proceed':
        break;
      default:
        throw new Error;
      }
      try {
        await client.services.addons.async_call('Delete', id)
      } catch (error) {
        logError(error);
      }
    })
    .insert(action_map)
    .build();
}
