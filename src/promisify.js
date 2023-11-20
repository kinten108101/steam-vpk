import Gio from 'gi://Gio';
import Gdk from 'gi://Gdk';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

Gio._promisify(Gio.DBus.session, 'call', 'call_finish');
Gio._promisify(Gdk.Clipboard.prototype, 'read_text_async', 'read_text_finish');
Gio._promisify(Gtk.FileDialog.prototype, 'save', 'save_finish');
Gio._promisify(Gtk.FileDialog.prototype, 'open', 'open_finish');
Gio._promisify(Gtk.FileDialog.prototype, 'select_folder', 'select_folder_finish');
Gio._promisify(Adw.MessageDialog.prototype, 'choose', 'choose_finish');
