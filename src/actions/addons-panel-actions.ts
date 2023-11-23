import Gio from 'gi://Gio';
import Gdk from 'gi://Gdk';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

export type DiskModal = {
  present(parent_window: Gtk.Window): Promise<number>;
  close(): void;
}

export function
AddonsPanelDiskActions(
{ action_map,
  leaflet,
  addons_dir,
  main_window,
}:
{ action_map: Gio.ActionMap;
  leaflet: Adw.Leaflet;
  addons_dir?: Gio.File;
  main_window?: Gtk.Window;
}) {
  const manage = new Gio.SimpleAction({ name: 'addons-panel-disk.manage' });
  manage.connect('activate', () => {
    leaflet.set_visible_child_name('addons-panel-disk-page');
  });
  action_map.add_action(manage);

  const explore = new Gio.SimpleAction({ name: 'addons-panel-disk.explore' });
  explore.connect('activate', () => {
    if (!addons_dir) return;
    Gtk.show_uri(main_window || null, `file://${addons_dir.get_path()}`, Gdk.CURRENT_TIME);
  });
  action_map.add_action(explore);
}
