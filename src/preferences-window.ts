import GObject from 'gi://GObject';
import Adw from 'gi://Adw';

export const PreferencesWindow = GObject.registerClass({
  GTypeName: 'PreferencesWindow',
  // @ts-ignore
  Template: 'resource:///com/github/kinten108101/SteamVpk/ui/preferences-window.ui',
}, class extends Adw.PreferencesWindow {
  /**
   *  TODO: What does params={} mean?
   *  TODO: What is _init()?
   */
  /**
   *  To be added
   */
});
