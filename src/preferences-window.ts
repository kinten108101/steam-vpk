import GObject from 'gi://GObject';
import Adw from 'gi://Adw';

import { Config } from './config.js';

export const PreferencesWindow = GObject.registerClass({
  GTypeName: 'StvpkPreferencesWindow',
  Template: `resource://${Config.config.app_rdnn}/ui/preferences-window.ui`,
}, class extends Adw.PreferencesWindow {});
