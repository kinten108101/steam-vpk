import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

import * as Gio1 from './utils/gio1.js';
import * as Utils from './utils.js';

import { MainWindowContext } from "./window.js";

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
        console.debug('State changed to', val);
      } else {
        context.application.addonStorage.set_addons_enabled(false);
        console.debug('State changed to', val);
      }
    })
    .build();
  addonsGroup.add_action(enableAddon);

  const includeInProfile = Gio1.SimpleAction
    .builder({ name: 'box', parameterType: GLib.VariantType.new('s') })
    .activate((_, parameter) => {
      const id = Utils.g_variant_unpack<string>(parameter, 'string');
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
}
