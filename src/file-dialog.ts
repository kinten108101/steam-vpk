import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import GObject from 'gi://GObject';

Gio._promisify(Gtk.FileDialog.prototype, 'save', 'save_finish');
Gio._promisify(Gtk.FileDialog.prototype, 'open', 'open_finish');
export default class FileDialog extends Gtk.FileDialog {
  static {
    GObject.registerClass({
      GTypeName: 'Gtk1FileDialog',
    }, this);
  }

  async save_async(parent: Gtk.Window | null, cancellable: Gio.Cancellable | null): Promise<Gio.File> {
    // @ts-ignore
    return this.dialog.save(parent, cancellable) as Promise<Gio.File>;
  }

  async open_async(parent: Gtk.Window | null, cancellable: Gio.Cancellable | null): Promise<Gio.File> {
    // @ts-ignore
    return this.dialog.open(parent, cancellable) as Promise<Gio.File>;
  }
}
