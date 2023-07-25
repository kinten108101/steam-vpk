import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import Gio from 'gi://Gio';
import Gdk from 'gi://Gdk';
import { AddonStorage } from './addon-storage.js';
import DiskCapacity from './disk-capacity';
import * as Files from './file.js';
import TypedBuilder from './typed-builder.js';
import * as Consts from './const.js';

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
  diskCapacity.allocate(38 * 1024); // placeholder
  const updateAddonsPanel = () => {
    diskCapacity.eval_addon_dir(addonStorage.subdirFolder);
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
  addonStorage.connect(AddonStorage.Signals.addons_changed, updateAddonsPanel);
  updateAddonsPanel();
}

export function
addons_panel_disk_implement(
{
  main_window,
  leaflet,
  addons_dir,
}:
{
  main_window: Gtk.Window;
  leaflet: Adw.Leaflet;
  addons_dir: Gio.File;
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
}
