import Gio from 'gi://Gio';

export interface InventoryMethods {
  update(): Promise<void>;
}

export class InventoryItem {
  file: Gio.File;

  constructor(params: { file: Gio.File }) {
    this.file = params.file;
  }
}

export default interface Inventory extends InventoryMethods {};
export default class Inventory {
  items: Map<string, InventoryItem>;
  dir: Gio.File;
  constructor(params: { dir: Gio.File }) {
    this.items = new Map();
    this.dir = params.dir;
  }
}
