import GObject from 'gi://GObject';
import Adw from 'gi://Adw';

export const PreferencesWindow = GObject.registerClass({
  GTypeName: 'PreferencesWindow',
  Template: 'resource:///com/github/kinten108101/SteamVpk/ui/preferences-window.ui',
}, class extends Adw.PreferencesWindow {});
