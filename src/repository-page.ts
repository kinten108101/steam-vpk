import Adw from 'gi://Adw';
import { registerClass } from './utils.js';
import { APP_RDNN } from './const.js';

export default class RepositoryPage extends Adw.PreferencesPage {
  static {
    registerClass({
      Template: `resource://${APP_RDNN}/ui/repository-page.ui`,
    }, this);
  }
}
