import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
const Signals = imports.signals;
import type { SignalMethods } from '@girs/gjs';

import * as Utils from './utils.js';
import * as Files from './file.js';
import Inventory, { InventoryItem, InventoryMethods } from './inventory.js';

export default interface SimpleInventory extends SignalMethods {}

export default class SimpleInventory extends Inventory implements InventoryMethods {
  static {
    Signals.addSignalMethods(this);
  }

  constructor(params: { dir: Gio.File }) {
    super({ dir: params.dir });
  }

  async load(): Promise<void> {
    const subdirs = await Files.list_file_async(this.dir);
    const draft: Map<string, InventoryItem> = new Map;
    for (const subdir of subdirs) {
      let is_dir;
      try {
        is_dir = await Files.is_dir_async(subdir);
      } catch (error) {
        Utils.log_error(error, 'Skipping this item...');
        continue;
      }
      if (!is_dir) {
        console.warn(`An item in ${this.dir.get_path()} is not a folder. Skipping this item...`);
        continue;
      }
      const id = subdir.get_basename();
      if (id === null) {
        console.warn('Subdirectory name is invalid. Skipping this item...');
        continue;
      }
      if (draft.has(id)) {
        console.warn(`Duplicate folder name \"${id}\". How is this possible? Skipping this item...`);
        continue;
      }
      draft.set(id, new InventoryItem({ file: subdir }));
    }
    this.items = draft;
  }

  async trash_entry(id: string) {
    const item = this.items.get(id);
    if (item === undefined) {
      console.warn(`Tried to delete a non-existent subdir with id ${id}. Quitting...`);
      return;
    }
    const deletion = this.items.delete(id);
    if (!deletion) {
      console.warn(`Tried to delete a non-existent subdir with id ${id}. Quitting...`);
      return;
    }
    await item.file.trash_async(GLib.PRIORITY_DEFAULT, null);
    this.mark_state_modified();
  }

  async add_entry(id: string) {
    if (this.items.has(id)) {
      console.warn(`Add-on ${id} already exists. Quitting...`);
      return;
    }
    const file = this.dir.get_child(id);
    this.items.set(id, new InventoryItem({ file }));
    try {
      Files.make_dir_nonstrict(file);
    } catch (error) {
      Utils.log_error(error, 'Quitting...');
    }
    this.mark_state_modified();
  }

  mark_state_modified() {
    this.emit('subdirs-changed');
  }
}
