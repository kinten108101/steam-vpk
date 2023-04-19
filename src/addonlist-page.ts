import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Gio from 'gi://Gio';

import { AddonlistSection, Js_AddonlistSection } from './addonlist-widget';

import { sample_addons } from './sample_addons';

import { AddonlistItem } from './addonlist-model';

GObject.registerClass({
  GTypeName: 'AddonlistPage',
  // @ts-ignore
  Template: 'resource:///com/github/kinten108101/SteamVpk/ui/addonlist-page.ui',
  InternalChildren: [
    'addonlist_page_content',
  ],
}, class extends Gtk.Box {

  default_store: Gio.ListStore;
  default_section: Js_AddonlistSection;
  mixin_store: Gio.ListStore;
  mixin_section: Js_AddonlistSection;

  [x: string]: any;
  constructor(params={}) {
    super(params);
    this.default_store = new Gio.ListStore(AddonlistItem.$gtype);
    this.mixin_store = new Gio.ListStore(AddonlistItem.$gtype);

    sample_addons.forEach( item => {
      if ( item.in_randomizer == false ) this.default_store.append(new AddonlistItem({
        'in_randomizer': true,
        ...item,
      }));
      else this.mixin_store.append(new AddonlistItem({
        'in_randomizer': true,
        ...item,
      }));
    });

    const addonlist_page_content: Gtk.Box = this._addonlist_page_content;

    this.default_section = new AddonlistSection({
      'title': 'Default add-ons',
      'model': this.default_store,
    });
    this.default_section.set_parent(addonlist_page_content);
    this.default_section.show();

    this.mixin_section = new AddonlistSection({
      'title': 'Mixins',
      'model': this.mixin_store,
    });
    this.mixin_section.set_parent(addonlist_page_content);
    this.mixin_section.show();
  }

  vfunc_realize() {
    super.vfunc_realize();
    return;
  }

});

