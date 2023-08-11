import Gio from 'gi://Gio';
import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';

import { APP_RDNN } from '../const.js';
import TypedBuilder from '../typed-builder.js';
import WindowPromiser from './window-promiser.js';

export default function
AddonsPanelDiskAllocateModal() {
  const builder = new TypedBuilder();
  builder.add_from_resource(`${APP_RDNN}/ui/addons-panel-disk-allocate.ui`);
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

  const present = async(parent_window: Gtk.Window) => {
    window.set_transient_for(parent_window);
    parent_window.get_group().add_window(window);
    return promiser.promise(window);
  };
  return {
    instance: window,
    present,
    close: () => window.close(),
  }
}
