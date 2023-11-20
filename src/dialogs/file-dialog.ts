import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import GObject from 'gi://GObject';

export default class FileDialog extends Gtk.FileDialog {
  static {
    GObject.registerClass({
      GTypeName: 'Gtk1FileDialog',
    }, this);
  }

  async save_async(parent: Gtk.Window | null, cancellable: Gio.Cancellable | null): Promise<Gio.File> {
    // @ts-ignore
    return this.save(parent, cancellable) as Promise<Gio.File>;
  }

  async open_async(parent: Gtk.Window | null, cancellable: Gio.Cancellable | null): Promise<Gio.File> {
    // @ts-ignore
    return this.open(parent, cancellable) as Promise<Gio.File>;
  }

  async select_folder_async(parent: Gtk.Window | null, cancellable: Gio.Cancellable | null): Promise<Gio.File> {
    // @ts-ignore
    return this.select_folder(parent, cancellable) as Promise<Gio.File>;
  }
}
