import Gio from 'gi://Gio';
import Adw from 'gi://Adw';
import { GtkTemplate, registerClass } from '../steam-vpk-utils/utils.js';
import { APP_RDNN } from '../utils/const.js';
import { HeaderboxAttachControls } from '../actions/headerbox.js';

export default class HeaderboxDetachable extends Adw.Window {
  static [GtkTemplate] = `resource://${APP_RDNN}/ui/headerbox-detachable.ui`;

  static {
    registerClass({}, this);
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
