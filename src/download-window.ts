import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import TypedBuilder from './typed-builder.js';
import {
  g_variant_unpack_tuple,
  param_spec_object,
  promise_wrap,
  registerClass,
} from './steam-vpk-utils/utils.js';
import { APP_RDNN } from './const.js';

export class DownloadWindowRowItem extends GObject.Object {
  static {
    registerClass({}, this);
  }
}

export class DownloadWindowRow extends Gtk.ListBoxRow {
  static [GObject.properties] = {
    item: param_spec_object({ name: 'item', objectType: DownloadWindowRowItem.$gtype }),
  };

  static {
    registerClass({
      Template: `resource://${APP_RDNN}/ui/download-window-row.ui`,
    }, this);
  }

  item!: DownloadWindowRowItem;

  constructor(params: { item: DownloadWindowRowItem }) {
    super(params as any);
  }
}



export type DownwinModelDependencies = {
}

export type DownwinUiDependencies = {
  current_wgroup: Gtk.WindowGroup;
}

export default function DownloadWindow(
{
}:
{
},
{ current_wgroup,
}:
DownwinUiDependencies) {
  const builder = new TypedBuilder();
  builder.add_from_resource(`${APP_RDNN}/ui/download-window.ui`);

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
  all;

  const window = builder.get_typed_object<Adw.Window>('window');
  current_wgroup.add_window(window);
  return window;
}

export function
DownloadWindowActions(
{ application,
  action_map,
  window_group,
  DownloadWindow,
}:
{ application: Gtk.Application;
  action_map: Gio.ActionMap;
  window_group: Gtk.WindowGroup;
  DownloadWindow: (deps: DownwinUiDependencies) => Adw.Window;
}) {
  const downwin_actions = new Gio.SimpleActionGroup();;

  const install_archive = new Gio.SimpleAction({
    name: 'download.install-archive',
    parameter_type: GLib.VariantType.new('(ss)'),
  });
  install_archive.connect('activate', (_action, parameter) => {
    promise_wrap(async () => {
      const [] = g_variant_unpack_tuple<[string, string]>(parameter, ['string', 'string']);
    });
  });
  action_map.add_action(install_archive);
  downwin_actions.add_action(install_archive);

  const manage = new Gio.SimpleAction({ name: 'download.manage' });
  manage.connect('activate', () => {
    const window = DownloadWindow({ current_wgroup: window_group });
    window.insert_action_group('download-window', downwin_actions);
    window.present();
  });
  action_map.add_action(manage);
  application.set_accels_for_action('win.download.manage', ['<Control>j']);
}
