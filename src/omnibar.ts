import GObject from 'gi://GObject';
import Panel from 'gi://Panel';
import Gtk from 'gi://Gtk';

GObject.registerClass({
  GTypeName: 'OmnibarPopover',
  // @ts-ignore
  Template: 'resource:///com/github/kinten108101/SteamVpk/ui/omnibar-popover.ui',
}, class extends Gtk.Popover {});

export const Omnibar = GObject.registerClass({
  GTypeName: 'Omnibar',
  // @ts-ignore
  Template: 'resource:///com/github/kinten108101/SteamVpk/ui/omnibar.ui',
}, class extends Panel.OmniBar {});
