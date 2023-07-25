import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import Gio from 'gi://Gio';
import Gdk from 'gi://Gdk';
import GLib from 'gi://GLib';
import { AddonStorage } from './addon-storage.js';
import DiskCapacity from './disk-capacity';
import * as Files from './file.js';
import TypedBuilder from './typed-builder.js';
import * as Consts from './const.js';
import { promise_wrap } from './utils.js';
import WindowPromiser from './window-promiser.js';
import { FieldRow } from './gtk.js';

export default function addons_panel_implement(
{
  builder_entry,
  diskCapacity,
  addonStorage,
}:
{
  builder_entry: Adw.Bin;
  diskCapacity: DiskCapacity,
  addonStorage: AddonStorage,
}) {
  const builder = new TypedBuilder;
  builder.add_from_resource(`${Consts.APP_RDNN}/ui/addons-panel.ui`);
  const panel = builder.get_typed_object<Adw.PreferencesGroup>('panel');
  builder_entry.child = panel;
  const used = builder.get_typed_object<Gtk.Label>('used');
  const allocated = builder.get_typed_object<Gtk.Label>('allocated');
  const usage_meter = builder.get_typed_object<Gtk.ProgressBar>('usage-meter');

  const updateAddonsPanel = () => {
    const usedsize = diskCapacity.used;
    used.set_label((() => {
      if (usedsize !== undefined)
        return `${Files.bytes2humanreadable(usedsize)} Used`;
      return 'Unknown space used';
    })());
    const allocatedsize = diskCapacity.allocated;
    allocated.set_label((() => {
      if (allocatedsize !== undefined)
        return `${Files.bytes2humanreadable(allocatedsize)} Allocated`;
      return 'Unlimited' // ???
    })());
    let fraction = (usedsize || 0 ) / (allocatedsize || 0.0001);
    fraction = fraction < 0 ? 0 : fraction;
    usage_meter.set_fraction(fraction);
    const colors = ['yellow', 'red'];
    const remove_all_except = (except: string) => {
      colors.forEach(color => {
        if (color === except) return;
        usage_meter.remove_css_class(color);
      });
    };
    if (fraction < 0.6) {
      remove_all_except('');
    } else if (fraction < 0.8) {
      usage_meter.add_css_class('yellow');
      remove_all_except('yellow');
    } else {
      usage_meter.add_css_class('red');
      remove_all_except('red');
    }
  };
  addonStorage.connect_after(AddonStorage.Signals.addons_changed, updateAddonsPanel);
  diskCapacity.connect_after_new_allocation(updateAddonsPanel);
  updateAddonsPanel();
}

export function
addons_panel_disk_implement(
{
  main_window,
  leaflet,
  addons_dir,
  disk_capacity,
}:
{
  main_window: Gtk.Window;
  leaflet: Adw.Leaflet;
  addons_dir: Gio.File;
  disk_capacity: DiskCapacity;
}
) {
  const addonsDisk = new Gio.SimpleActionGroup();
  main_window.insert_action_group('addons-panel-disk', addonsDisk);

  const builder = new TypedBuilder();
  builder.add_from_resource(`${Consts.APP_RDNN}/ui/addons-panel-disk.ui`);
  const page = builder.get_typed_object<Gtk.Box>('page');
  const page_slot = leaflet.get_child_by_name('addons-panel-disk-page') as Adw.Bin;
  page_slot.child = page;

  const manage = new Gio.SimpleAction({ name: 'manage' });
  manage.connect('activate', () => {
    leaflet.set_visible_child_name('addons-panel-disk-page');
  });
  addonsDisk.add_action(manage);

  const explore = new Gio.SimpleAction({ name: 'explore' });
  explore.connect('activate', () => {
    Gtk.show_uri(main_window, `file://${addons_dir.get_path()}`, Gdk.CURRENT_TIME);
  });
  addonsDisk.add_action(explore);

  const current_allocation = builder.get_typed_object<FieldRow>('current-allocation');
  const updateCurrentAllocation = () => {
    const val = Files.bytes2humanreadable(disk_capacity.allocated || 0);
    current_allocation.set_value(val);
  };
  disk_capacity.connect_after_new_allocation(updateCurrentAllocation);
  updateCurrentAllocation();

  const allocate = new Gio.SimpleAction({ name: 'allocate' });
  allocate.connect('activate', () => {
    promise_wrap(async () => {
      const [modal, present] = addons_panel_disk_allocate_modal({
        parent_window: main_window,
      });
      let newval: number = NaN;
      try {
        newval = await present();
      } catch (error) {
        if (error instanceof GLib.Error) {
          if (error.matches(Gtk.dialog_error_quark(), Gtk.DialogError.DISMISSED)) { return; }
        } else throw error;
      }
      disk_capacity.allocate(newval);
      modal.close();
    });
  });
  addonsDisk.add_action(allocate);
}

function
addons_panel_disk_allocate_modal(
{
  parent_window,
}:
{
  parent_window: Gtk.Window;
}) {
  const builder = new TypedBuilder();
  builder.add_from_resource(`${Consts.APP_RDNN}/ui/addons-panel-disk-allocate.ui`);
  const window = builder.get_typed_object<Adw.Window>('window');
  const promiser = new WindowPromiser<number>();

  const actions = new Gio.SimpleActionGroup();
  window.insert_action_group('allocate', actions);

  const apply = new Gio.SimpleAction({ name: 'apply' });
  apply.connect('activate', (_action) => {
    // FIXME(kinten): Last time binding to GVariant in UI def was unsuccessful
    const size = builder.get_typed_object<Adw.EntryRow>('size');
    const val = Number(size.get_text());
    promiser.resolve(val);
  });
  actions.add_action(apply);

  const present = async() => {
    window.set_transient_for(parent_window);
    parent_window.get_group().add_window(window);
    return promiser.promise(window);
  };
  return [window, present] as [Adw.Window, () => Promise<number>];
}
