import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';

import './addonlist.js';

GObject.registerClass({
  GTypeName: 'AddonlistPage',
  // @ts-ignore
  Template: 'resource:///com/github/kinten108101/SteamVpk/ui/addonlist-page.ui',
  InternalChildren: [
    'default-addon-list-box'
  ],
}, class extends Gtk.Box {});
