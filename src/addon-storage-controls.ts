import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import * as Gio1 from './utils/gio1.js';
import Adw from 'gi://Adw';
import * as Adw1 from './message-dialog.js';
import * as Utils from './utils.js';
import { MainWindowContext } from "./window.js";
import { AddonStorage } from './addon-storage.js';

export function logged(func: Function) {
  return function (this: any, ...args: any[]) {
    console.log(`<${func.name}>`);
    func(args);
    console.log(`</${func.name}>`);
  }
}

export default function addon_storage_controls(context: MainWindowContext) {
  const addonsGroup = new Gio.SimpleActionGroup();
  context.main_window.insert_action_group('addons', addonsGroup);

  const enableAddon = Gio1.SimpleAction
    .builder({ name: 'enabled', parameterType: GLib.VariantType.new('b') })
    .activate((_, parameter) => {
      // TODO(kinten): js primitive equality check. Can we use gvariant instead?
      console.debug('<<enableAddon>>');
      const val = Utils.g_variant_unpack<boolean>(parameter, 'boolean');
      if (val) {
        context.application.addonStorage.set_addons_enabled(true);
      } else {
        context.application.addonStorage.set_addons_enabled(false);
      }
    })
    .build();
  addonsGroup.add_action(enableAddon);

  const includeInProfile = Gio1.SimpleAction
    .builder({ name: 'box', parameterType: GLib.VariantType.new('s') })
    .activate((_, parameter) => {
      console.log('<<includeInProfile>>');
      const id = Utils.g_variant_unpack<string>(parameter, 'string');
      console.log('id =', id);
      context.application.addonStorage.loadorder_push(id);
    })
    .build();
  addonsGroup.add_action(includeInProfile);

  const moveUp = Gio1.SimpleAction
    .builder({ name: 'move-up', parameterType: GLib.VariantType.new('s') })
    .activate((_, parameter) => {
      console.debug('<<moveUp>>');
      const id = Utils.g_variant_unpack<string>(parameter, 'string');
      const idx_src = context.application.addonStorage.loadorder.indexOf(id);
      if (idx_src === -1) {
        console.warn('Tried to move up a non-existent add-on. Quitting...');
        return;
      }
      if (idx_src === 0) {
        console.warn('Add-on index hit lower bound, can\'t move up. Quitting...');
        return;
      }
      context.application.addonStorage.loadorder_swap(idx_src, idx_src - 1);
    })
    .build();
  addonsGroup.add_action(moveUp);

  const moveDown = Gio1.SimpleAction
    .builder({ name: 'move-down', parameterType: GLib.VariantType.new('s') })
    .activate((_, parameter) => {
      const id = Utils.g_variant_unpack<string>(parameter, 'string');
      const idx_src = context.application.addonStorage.loadorder.indexOf(id);
      if (idx_src === -1) {
        console.warn('Tried to move down a non-existent add-on. Quitting...');
        return;
      }
      const length = context.application.addonStorage.loadorder.length;
      if (idx_src >= length - 1) {
        console.warn('Add-on index hit upper bound, can\'t move down. Quitting...');
        return;
      }
      context.application.addonStorage.loadorder_swap(idx_src, idx_src + 1);
    })
    .build();
  addonsGroup.add_action(moveDown);

  const removeAddon = Gio1.SimpleAction
    .builder({ name: 'remove', parameterType: GLib.VariantType.new('s') })
    .activate((_: any, parameter: GLib.Variant | null) => {
      console.log('<  addons.remove >');
      (async () => {
        const msg = Adw1.MessageDialog.builder()
          .heading('Disuse this add-on? Current configurations in this profile will be permanently lost.')
          .body('Add-on can still be reused from the repository.')
          .response({ id: 'remove.cancel',  label: 'Cancel' })
          .response({ id: 'remove.proceed', label: 'Proceed', appearance: Adw.ResponseAppearance.DESTRUCTIVE })
          .transientFor(context.main_window)
          .wrap().build();
        const response = await msg.choose_async(null);
        if (response === 'remove.cancel' ) {
          console.log('Action addons.remove dismissed. Quitting...');
          return;
        }
        if (response !== 'remove.proceed') {
          console.warn(`Received unknown response in removeAddon. Got ${response}`);
        }
        const id = Utils.g_variant_unpack<string>(parameter, 'string');
        context.application.addonStorage.loadorder_remove(id);
      })().catch(error => {
        logError(error);
        console.error('Quitting...');
      }).finally(() => {
        console.log('</ addons.remove >');
      })
    })
    .build();
  addonsGroup.add_action(removeAddon);

  const set_active = new Gio.SimpleAction({
    name: 'active',
    parameter_type: GLib.VariantType.new_tuple([new GLib.VariantType('s'), new GLib.VariantType('b')]),
  });
  // parameter is supplied by viewmodel
  set_active.connect('activate', (_, parameter) => {
    if (!(parameter instanceof GLib.Variant)) throw new Error(`Expect a GVariant, got ${parameter}`);
    const [id, active] = parameter.deepUnpack() as Array<any>;
    if (typeof id !== 'string' || typeof active !== 'boolean') {
      throw new Error(`Expected (sb), got ${id} and ${active}`);
    }
    const config = context.application.addonStorage.configmap.get(id);
    if (config === undefined) {
      console.warn(`Configuring a non-existent load-order entry, got ${id}. Is this possible? Quitting...`);
      return;
    }
    // pass by pointer value or by primitive value?
    const prev_active = config.active;
    config.active = active;
    if (prev_active !== config.active) {
      context.application.addonStorage.emit(AddonStorage.Signals.loadorder_config_changed);
    }
  });
  addonsGroup.add_action(set_active);

  const trash = new Gio.SimpleAction({
    name: 'trash', parameter_type: GLib.VariantType.new('s'),
  });
  trash.connect('activate', (_, parameter) => {
    (async () => {
      const msg = Adw1.MessageDialog.builder()
        .heading('Delete this add-on?')
        .body('Deleted content is recoverable from trash can.')
        .response({ id: 'trash.cancel',  label: 'Cancel' })
        .response({ id: 'trash.proceed', label: 'Proceed', appearance: Adw.ResponseAppearance.DESTRUCTIVE })
        .closeResponse('trash.cancel')
        .defaultResponse('trash.proceed')
        .transientFor(context.main_window)
        .wrap().build();
      const response = await msg.choose_async(null)
      switch (response) {
      case 'trash.cancel':
        console.log('Action addons.trash dismissed. Quitting...');
        return;
      case 'trash.proceed':
        break;
      default:
        throw new Error(`Unknown message dialog response. Got ${response}`);
      }
      const id = Utils.g_variant_unpack<string>(parameter, 'string');
      await context.application.addonStorage.addon_trash(id);
    })().catch((error) => {
      logError(error);
      console.error('Quitting...');
    });
  });
  addonsGroup.add_action(trash);

  const missingArchive = new Gio.SimpleAction({ name: 'upgrade-missing-archive' });
  missingArchive.connect('activate', (_action, parameter) => {
    const id = Utils.g_variant_unpack<string>(parameter, 'string');
    id;

  });
  addonsGroup.add_action(missingArchive);
}

