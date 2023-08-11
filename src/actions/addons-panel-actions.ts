import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import Gdk from 'gi://Gdk';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import { g_variant_unpack, promise_wrap } from '../utils.js';
import { Toast } from '../toast-builder.js';
import { TOAST_TIMEOUT_SHORT } from '../gtk.js';

export type DiskModal = {
  present(parent_window: Gtk.Window): Promise<number>;
  close(): void;
}

export function
AddonsPanelDiskActions(
{
  action_map,
  leaflet,
  toaster,
  addons_dir,
  main_window,
  Modal,
}:
{
  action_map: Gio.ActionMap;
  leaflet?: Adw.Leaflet;
  toaster?: Adw.ToastOverlay;
  addons_dir?: Gio.File;
  main_window?: Gtk.Window;
  Modal?: {
    new(): DiskModal;
  };
}) {
  const manage = new Gio.SimpleAction({ name: 'addons-panel-disk.manage' });
  manage.connect('activate', () => {
    leaflet?.set_visible_child_name('addons-panel-disk-page');
  });
  action_map.add_action(manage);

  const explore = new Gio.SimpleAction({ name: 'addons-panel-disk.explore' });
  explore.connect('activate', () => {
    if (!addons_dir) {
      toaster?.add_toast(
      Toast.builder()
        .timeout(TOAST_TIMEOUT_SHORT)
        .build()
      );
      return;
    }
    Gtk.show_uri(main_window || null, `file://${addons_dir.get_path()}`, Gdk.CURRENT_TIME);
  });
  action_map.add_action(explore);

  const allocate = new Gio.SimpleAction({ name: 'addons-panel-disk.allocate', parameter_type: GLib.VariantType.new('i') });
  allocate.connect('activate', (_action, parameter) => {
    promise_wrap(async () => {
      let val: number | undefined;
      try {
        val = g_variant_unpack<number>(parameter, 'number');
        if (val < 0) val = undefined;
      } catch (error) {
        logError(error as Error, 'Handling...');
        val = undefined;
      }

      let modal: DiskModal | undefined;
      if (val === undefined && Modal !== undefined && main_window !== undefined) {
        try {
          modal = new Modal();
          val = await modal.present(main_window);
        } catch (error) {
          if (error instanceof GLib.Error) {
            if (error.matches(Gtk.dialog_error_quark(), Gtk.DialogError.DISMISSED)) { return; }
          } else throw error;
        }
      }

      if (val === undefined) {
        throw new Error('No input method has successfully retrieved value');
      }
      // allocate here
      if (modal !== undefined) modal.close();
    });
  });
  action_map.add_action(allocate);
}
