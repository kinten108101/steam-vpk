import GObject from 'gi://GObject';
import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import {
  param_spec_object,
  registerClass,
} from '../steam-vpk-utils/utils.js';
import { APP_RDNN } from '../utils/const.js';
import TypedBuilder from '../utils/typed-builder.js';
import { FieldRow } from './field-row.js';

export default class AddonsPanel extends Adw.PreferencesGroup {
  static [GObject.properties] = {
    'prop-disk-capacity': param_spec_object({ name: 'disk_capacity' }),
    'prop-addon-storage': param_spec_object({ name: 'addon_storage' }),
  };

  static {
    registerClass({
      Template: `resource://${APP_RDNN}/ui/addons-panel.ui`,
      Children: [ 'used', 'allocated', 'usage-meter' ],
    }, this);
  }

  used?: Gtk.Label;
  allocated?: Gtk.Label;
  usage_meter?: Gtk.ProgressBar;
}

export function
AddonsPanelDiskPage(
{
  leaflet,
}:
{
  leaflet: Adw.Leaflet;
}
) {
  const builder = new TypedBuilder();
  builder.add_from_resource(`${APP_RDNN}/ui/addons-panel-disk.ui`);
  const page = builder.get_typed_object<Gtk.Box>('page');
  const page_slot = leaflet.get_child_by_name('addons-panel-disk-page') as Adw.Bin;
  page_slot.child = page;

  const current_allocation = builder.get_typed_object<FieldRow>('current-allocation');
  const updateCurrentAllocation = () => {
    const val = '108.101 B';
    current_allocation.set_value(val);
  };
  updateCurrentAllocation();
}
