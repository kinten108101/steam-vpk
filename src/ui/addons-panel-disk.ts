import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import { APP_RDNN } from '../utils/const.js';

export default class AddonsPanelDisk extends Gtk.Box {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkAddonsPanelDisk',
      Template: `resource://${APP_RDNN}/ui/addons-panel-disk.ui`,
    }, this);
  }
}
