import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Adw from 'gi://Adw';
import { HeaderboxAttachControls } from '../actions/headerbox.js';

export default class HeaderboxDetachable extends Adw.Window {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkHeaderboxDetachable',
      Template: 'resource:///com/github/kinten108101/SteamVPK/ui/headerbox-detachable.ui',
    }, this);
  }

  constructor(params = {}) {
    super(params);
    this._setup_actions();
  }

  _setup_actions() {
    const action_map = new Gio.SimpleActionGroup();
    this.insert_action_group('modal', action_map);

    HeaderboxAttachControls({
      action_map,
      detachable: this,
    });
  }
}
