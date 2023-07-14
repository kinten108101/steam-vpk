import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import * as Gio1 from './utils/gio1.js';
import { Wrapper } from './utils/glib1.js';
import * as Utils from './utils.js';
import * as File from './file.js';

import { Config } from './config.js';
import { MainWindowContext } from './window.js';
import { gobjectClass } from './utils/decorator.js';
//import { SteamMd2Pango } from './steam-markup.js';

enum LozengeStyles {
  text = 'text',
  icon = 'icon',
};

@gobjectClass({
  GTypeName: 'StvpkAddonDetailsLozenge',
  Properties: {
    style: GObject.ParamSpec.string('style', 'style', 'style', GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT, null),
    'icon-iconname': GObject.ParamSpec.string('icon-iconname', 'icon-iconname', 'icon-iconname', GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT, ''),
    'text-label': GObject.ParamSpec.string('text-label', 'text-label', 'text-label', GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT, ''),
  },
  Template: `resource://${Config.config.app_rdnn}/ui/addon-details-lozenge.ui`,
  Children: [ 'text', 'icon' ],
})
class AddonDetailsLozenge extends Gtk.Box {
  style!: string;
  iconIconname!: string;
  textLabel!: string;
  text!: Gtk.Label;
  icon!: Gtk.Image;

  constructor(param = {}) {
    super(param);
    switch (this.style) {
    case LozengeStyles.text:
      this.icon.set_visible(false);
      this.text.set_visible(true);
      break;
    case LozengeStyles.icon:
      this.icon.set_visible(true);
      this.text.set_visible(false);
      break;
    default:
      console.warn(`Unexpected LozengeStyles. Details: ${this.style}`);
      break;
    }
  }

  set_text_label(val: string) {
    this.textLabel = val;
  }
};

GObject.registerClass({
  GTypeName: `StvpkAddonDetailsContextLabel`,
  Template: `resource://${Config.config.app_rdnn}/ui/addon-details-context-label.ui`,
}, class extends Gtk.Label {})

class BuilderObjectNotFound extends Error {
  constructor(prop: string) {
    super(`${prop} not found, bad XML`);
  }
}

class BuilderWrap extends Wrapper<Gtk.Builder> {
  constructor(builder: Gtk.Builder) {
    super(builder);
  }

  get_object<T extends GObject.Object>(name: string) {
    const obj = this.unwrap().get_object(name);
    if (obj === null) throw new BuilderObjectNotFound(name);
    return obj as T;
  }
}

export function addon_details_implement(context: MainWindowContext) {
  const addonActionGroup = new Gio.SimpleActionGroup();
  context.main_window.insert_action_group('addon', addonActionGroup);

  const seeDetails = Gio1.SimpleAction
    .builder({ name: 'see-details', parameterType: new GLib.VariantType('s') })
    .activate((_: unknown, parameter: GLib.Variant | null) => {
      if (!(parameter instanceof GLib.Variant)) throw new Error();
      const id = parameter.deepUnpack();
      if (typeof id !== 'string') throw new Error();
      const addon = context.application.addonStorage.idmap.get(id);
      if (addon === undefined) {
        console.warn('Add-on doesn\'t exist. Quitting...');
        return;
      }
      /*
      const window = new AddonDetailsWindow();

      const builder = new Gtk.Builder();
      const template = Gio.File.new_for_uri(`resource://${Config.config.app_rdnn}/ui/addon-details.ui`);
      const [, bytes] = template.load_contents(null);
      const jsstr = Utils.Decoder.unwrap().decode(bytes);
      builder.extend_with_template(window, AddonDetailsWindow.$gtype, jsstr, -1);

      */
      const builder = new BuilderWrap(new Gtk.Builder());
      builder.unwrap().add_from_resource(`${Config.config.app_rdnn}/ui/addon-details.ui`);

      const window = builder.get_object<Adw.Window>('window');
      context.main_window.get_group().add_window(window);

      const title = builder.get_object<Adw.WindowTitle>('title');
      if (addon.title !== undefined) {
        title.set_title(addon.title);
        title.set_subtitle(addon.vanityId);
      } else {
        title.set_title(addon.vanityId);
        title.set_subtitle('');
      }

      const addonId = GLib.Variant.new_string(addon.vanityId);

      const file_size = builder.get_object<Gtk.Button>('file-size');
      file_size.set_action_target_value(addonId);

      const fileStatusMem = new class {
        archive: number = NaN;
        cache: number = NaN;
        manifest: number = NaN;
        total: number = NaN;

        calculate() {
          this.archive = (() => {
            return 0;
          })();
          this.cache = (() => {
            return 0;
          })();
          this.manifest = (() => {
            const info_file = context.application.addonStorage.subdirFolder.get_child(addon.vanityId).get_child(Config.config.addon_info);
            const qinfo = info_file.query_info(Gio.FILE_ATTRIBUTE_STANDARD_SIZE, Gio.FileQueryInfoFlags.NONE, null);
            return qinfo.get_size();
          })();
          this.total = this.archive + this.cache + this.manifest;
        }
      };
      fileStatusMem.calculate();

      const file_size_lozenge = builder.get_object<AddonDetailsLozenge>('file-size-lozenge');
      file_size_lozenge.set_text_label(File.bytes2humanreadable(fileStatusMem.total));

      const cloudEnabled = builder.get_object<Gtk.Button>('cloud-enabled');
      cloudEnabled.set_action_target_value(addonId);

      const cloudDisabled = builder.get_object<Gtk.Button>('cloud-disabled');
      cloudDisabled.set_action_target_value(addonId);

      if (addon.steamId !== undefined) {
        cloudEnabled.set_visible(true);
        cloudDisabled.set_visible(false);
      } else {
        cloudEnabled.set_visible(false);
        cloudDisabled.set_visible(true);
      }

      const detailsActionGroup = new Gio.SimpleActionGroup;
      window.insert_action_group('details', detailsActionGroup);

      const fileStatus = Gio1.SimpleAction
        .builder({ name: 'file-status', parameterType: GLib.VariantType.new('s')})
        .activate(() => {
          const peek_builder = new BuilderWrap(new Gtk.Builder);
          peek_builder.unwrap().add_from_resource(`${Config.config.app_rdnn}/ui/addon-details-peek-file.ui`);

          fileStatusMem.calculate();

          [
            ['title-lozenge', fileStatusMem.total] as [string, number],
            ['archive-lozenge', fileStatusMem.archive] as [string, number],
            ['cache-lozenge', fileStatusMem.cache] as [string, number],
            ['manifest-lozenge', fileStatusMem.manifest] as [string, number],
          ].forEach(([obj_id, data]) => {
            peek_builder.get_object<AddonDetailsLozenge>(obj_id).set_text_label(File.bytes2humanreadable(data));
          });

          const peek_window = peek_builder.get_object<Adw.Window>('peek-file-window');
          peek_window.set_transient_for(window);
          peek_window.set_modal(true);
          peek_window.present();
        })
        .build();
      detailsActionGroup.add_action(fileStatus);

      const cloudStatus = Gio1.SimpleAction
        .builder({ name: 'cloud-status', parameterType: GLib.VariantType.new('s') })
        .activate(() => {

        })
        .build();
      detailsActionGroup.add_action(cloudStatus);

      /*

      const carousel = builder.get_object<Adw.Carousel>('infoCarousel');
      const description = addon.description;
      if (description !== undefined) {
        const describeLabel = builder.get_object<Gtk.Label>('description-label');
        describeLabel.set_label(SteamMd2Pango(description));
        const describePage = builder.get_object<Adw.PreferencesGroup>('description');
        carousel.append(describePage);
      }

      const tags = builder.get_object<Adw.PreferencesGroup>('tags');
      carousel.append(tags);

      */


      console.time('present');
      window.set_transient_for(context.main_window);
      window.set_modal(true);
      window.present();
      console.timeEnd('present');
      const a = Gtk.Window.list_toplevels();
      console.log(a.length);

  /*
      builder.add_from_resource(`${Config.config.app_rdnn}/ui/addon-details.ui`);

      const carousel = builder.get_object('info-carousel') as Adw.Carousel | null;
      if (carousel === null) throw new Error('Could not find carousel. XML was written incorrectly?');


      */
    })
    .build();
  addonActionGroup.add_action(seeDetails);

  const removeAddon = Gio1.SimpleAction
    .builder({ name: 'remove', parameterType: GLib.VariantType.new('s') })
    .activate((_, parameter) => {
      const id = Utils.g_variant_unpack<string>(parameter, 'string');
      context.application.addonStorage.loadorder_remove(id);
    })
    .build();
  addonActionGroup.add_action(removeAddon);
}
