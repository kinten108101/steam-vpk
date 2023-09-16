import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import { AddonEntry } from '../model/addonlist.js';
import LaunchpadRow, { LaunchpadPage } from '../ui/launchpad.js';

export default function LaunchpadPagePresenter(
{ boxed_list,
  loadorder_model,
  launchpad_page,
}:
{ boxed_list: Gtk.ListBox;
  launchpad_page: LaunchpadPage;
  loadorder_model: Gio.ListModel;
}) {
  function bind_with_item(item: AddonEntry, widget: LaunchpadRow) {
    //widget.addon_title = item.name;
    item.bind_property('name', widget, 'addon-title',
      GObject.BindingFlags.SYNC_CREATE);
    item.bind_property('description', widget, 'description',
      GObject.BindingFlags.SYNC_CREATE);
    item.bind_property('id', widget, 'id',
      GObject.BindingFlags.SYNC_CREATE);
    item.bind_property('last-update', widget, 'last-update',
      GObject.BindingFlags.SYNC_CREATE);
    launchpad_page.bind_property('enable-text-markup', widget, 'enable-text-markup',
      GObject.BindingFlags.SYNC_CREATE);
  }
  boxed_list.bind_model(loadorder_model, (item: GObject.Object) => {
    if (!(item instanceof AddonEntry)) throw new Error;
    const widget = new LaunchpadRow();
    if (item instanceof AddonEntry && widget instanceof LaunchpadRow) {
      bind_with_item(item, widget);
    } else throw Error('Unrecognized combination');
    return widget;
  });
}
