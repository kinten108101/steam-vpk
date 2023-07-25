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

export class DownloadWindowRow extends Gtk.ListBoxRow {
  static {
    Utils.registerClass({
      Template: `resource://${Consts.APP_RDNN}/ui/download-window-row.ui`,
    }, this);
  }
}

export default function
download_window_implement(context:
  { application: Gtk.Application,
    downloader: Downloader,
    main_window: Window }) {
  const actions = new Gio.SimpleActionGroup();
  context.main_window.insert_action_group('download', actions);

  const downloadTest = Gio1.SimpleAction
    .builder({ name: 'download-test' })
    .activate(() => {
      Utils.promise_wrap(async () => {
        console.log('<<download-test>>');
        const name = String(Math.random());
        console.log('Start order', name);
        const uri = GLib.Uri.parse('https://steamusercontent-a.akamaihd.net/ugc/1849291128394309645/78545F2CED217E017F360B43E75D3C392916EF1F/', GLib.UriFlags.NONE);
        const order = context.downloader.register_order({ name, uri, size: 864674328 });


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
  actions.add_action(downloadTest);

  const install_archive = Gio1.SimpleAction
    .builder({ name: 'install-archive', parameterType: GLib.VariantType.new('(ss)') })
    .activate((_action, parameter) => {
      Utils.promise_wrap(async () => {
        const [] = Utils.g_variant_unpack_tuple<[string, string]>(parameter, ['string', 'string']);
      });
    })
    .build();
  actions.add_action(install_archive);

  const manage = new Gio.SimpleAction({ name: 'manage' });
  manage.connect('activate', () => {
    const builder = new TypedBuilder();
    builder.add_from_resource(`${Consts.APP_RDNN}/ui/download-window.ui`);

    const window = builder.get_typed_object<Adw.Window>('window');
    context.main_window.get_group().add_window(window);
    window.present();
  });
  actions.add_action(manage);
  context.application.set_accels_for_action('download.manage', ['<Control>j']);
}
