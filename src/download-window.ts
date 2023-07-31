import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import * as Gio1 from './utils/gio1.js';
import * as Utils from './utils.js';
import * as Consts from './const.js';

import Window from "./window";
import Downloader from './downloader';
import TypedBuilder from './typed-builder.js';
import { AddonStorage } from './addon-storage.js';

export class DownloadWindowRowItem extends GObject.Object {
  static {
    Utils.registerClass({}, this);
  }
}

export class DownloadWindowRow extends Gtk.ListBoxRow {
  static [GObject.properties] = {
    'item': GObject.ParamSpec.object('item', 'item', 'item', Utils.g_param_default, DownloadWindowRowItem.$gtype),
  };

  static {
    Utils.registerClass({
      Template: `resource://${Consts.APP_RDNN}/ui/download-window-row.ui`,
    }, this);
  }

  item!: DownloadWindowRowItem;

  constructor(params: { item: DownloadWindowRowItem }) {
    super(params as any);
  }
}



export type DownwinModelDependencies = {
  addonStorage: AddonStorage;
}

export type DownwinUiDependencies = {
  current_wgroup: Gtk.WindowGroup;
}

export default function DownloadWindow(
{ addonStorage,
  downloader,
}:
{
  addonStorage: AddonStorage,
  downloader: Downloader,
},
{ current_wgroup,
}:
DownwinUiDependencies) {
  const builder = new TypedBuilder();
  builder.add_from_resource(`${Consts.APP_RDNN}/ui/download-window.ui`);

  const func: Gtk.ListBoxCreateWidgetFunc = ($obj: GObject.Object): DownloadWindowRow => {
    const item = $obj as DownloadWindowRowItem;
    const row = new DownloadWindowRow({ item });
    return row;
  };

  const downloading = new Gio.ListStore<DownloadWindowRowItem>({ item_type: DownloadWindowRowItem.$gtype });
  const downloading_list = builder.get_typed_object<Gtk.ListBox>('downloading-list');
  downloading_list.bind_model(downloading, func);
  const queued = new Gio.ListStore<DownloadWindowRowItem>({ item_type: DownloadWindowRowItem.$gtype });
  const queued_list = builder.get_typed_object<Gtk.ListBox>('queued-list');
  queued_list.bind_model(queued, func);
  const completed = new Gio.ListStore<DownloadWindowRowItem>({ item_type: DownloadWindowRowItem.$gtype });
  const completed_list = builder.get_typed_object<Gtk.ListBox>('completed-list');
  completed_list.bind_model(completed, func);
  const all = new Gtk.FlattenListModel({
    model: (() => {
      const model = new Gio.ListStore({ });
      model.append(downloading);
      model.append(queued);
      model.append(completed);
      return model;
    })(),
  });
  addonStorage;
  downloader;
  all;

  const window = builder.get_typed_object<Adw.Window>('window');
  current_wgroup.add_window(window);
  return window;
}

export function
DownloadWindowActions(
{ application,
  downloader,
  main_window,
  DownloadWindow,
}:
{ application: Gtk.Application,
  downloader: Downloader,
  main_window: Window,
  DownloadWindow: (deps: DownwinUiDependencies) => Adw.Window;
}) {
  const downwin_actions = new Gio.SimpleActionGroup();
  const downloadTest = Gio1.SimpleAction
    .builder({ name: 'download.download-test' })
    .activate(() => {
      Utils.promise_wrap(async () => {
        console.log('<<download-test>>');
        const name = String(Math.random());
        console.log('Start order', name);
        const uri = GLib.Uri.parse('https://steamusercontent-a.akamaihd.net/ugc/1849291128394309645/78545F2CED217E017F360B43E75D3C392916EF1F/', GLib.UriFlags.NONE);
        const order = downloader.register_order({ name, uri, size: 864674328 });

        setInterval(() => {
          console.log(order.get_percentage());
        }, 500);

        setTimeout(() => {
          order.stop();
        }, 7000);

        setTimeout(() => {
          order.continue().finally(() => {
            const size = order.bytesread;
            console.log('Read', size, 'bytes');
            console.log('>>download-test<<');
          });
        }, 12000);

        /*
        order.start().finally(() => {
          const size = order.bytesread.get_size();
          console.log('Read', size, 'bytes');
          console.log('>>download-test<<');
        });
        */
        setTimeout(() => {
          console.log('shit');
        }, 1000 * 20);

        await order.start();
      });
    })
    .build();
  main_window.add_action(downloadTest);
  downwin_actions.add_action(downloadTest);

  const install_archive = Gio1.SimpleAction
    .builder({ name: 'download.install-archive', parameterType: GLib.VariantType.new('(ss)') })
    .activate((_action, parameter) => {
      Utils.promise_wrap(async () => {
        const [] = Utils.g_variant_unpack_tuple<[string, string]>(parameter, ['string', 'string']);
      });
    })
    .build();
  main_window.add_action(install_archive);
  downwin_actions.add_action(install_archive);

  const manage = new Gio.SimpleAction({ name: 'download.manage' });
  manage.connect('activate', () => {
    const window = DownloadWindow({ current_wgroup: main_window.get_group() });
    window.insert_action_group('download-window', downwin_actions);
    window.present();
  });
  main_window.add_action(manage);
  application.set_accels_for_action('win.download.manage', ['<Control>j']);
}
