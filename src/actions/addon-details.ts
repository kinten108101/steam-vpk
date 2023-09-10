import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import Gdk from 'gi://Gdk';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import { Toast } from '../utils/toast-builder.js';
import { TOAST_TIMEOUT_SHORT } from '../utils/gtk.js';
import AddonDetailsPresenter from '../presenters/addon-details-presenter.js';
import Repository from '../model/repository.js';

export default function
AddonDetailsActions(
{ toaster,
  action_map,
  parent_window,
  repository,
  presenter,
}:
{ toaster?: Adw.ToastOverlay;
  action_map: Gio.ActionMap;
  parent_window?: Gtk.Window;
  repository: Repository;
  presenter: AddonDetailsPresenter;
}) {
  const seeDetails = new Gio.SimpleAction({
    name: 'addon-details.see-details',
    parameter_type: GLib.VariantType.new('s'),
  });
  seeDetails.connect('activate', (_action, parameter) => {
    (async () => {
      if (parameter === null) throw new Error;
      const [id] = parameter.get_string();
      if (id === null) throw new Error;
      const item = repository.get(id);
      if (item === undefined) return;
      presenter.item = item;
      presenter.present();
    })().catch(error => logError(error));
  });
  action_map.add_action(seeDetails);
  const visit_website = new Gio.SimpleAction({
    name: 'addon-details.visit-website',
    parameter_type: GLib.VariantType.new('s'),
  });
  visit_website.connect('activate', (_action, parameter) => {
    if (parameter === null) throw new Error;
    const [url] = parameter.get_string();
    Gtk.show_uri(parent_window || null, url, Gdk.CURRENT_TIME);
  });
  action_map.add_action(visit_website);

  const copy_string = new Gio.SimpleAction({
    name: 'addon-details.copy-string',
    parameter_type: GLib.VariantType.new('s'),
  });
  copy_string.connect('activate', (_action, parameter) => {
    (async () => {
      if (parameter === null) throw new Error;
      const [str] = parameter.get_string();
      if (str === null) throw new Error;
      const display = Gdk.Display.get_default();
      if (display === null) return;
      const val = new GObject.Value();
      val.init(GObject.TYPE_STRING);
      val.set_string(str);
      display.get_clipboard().set_content(Gdk.ContentProvider.new_for_value(val));
      toaster?.add_toast(
        Toast.builder()
        .title('Copied to clipboard')
        .timeout(TOAST_TIMEOUT_SHORT)
        .build());
    })().catch(error => logError(error));
  });
  action_map.add_action(copy_string);

  const explore_fs = new Gio.SimpleAction({
    name: 'addon-details.explore-fs',
    parameter_type: GLib.VariantType.new('s'),
  });
  explore_fs.connect('activate', (_action, parameter) => {
    (async () => {
      if (parameter === null) throw new Error;
      const [path] = parameter.get_string();
      Gtk.show_uri(parent_window || null, `file://${path}`, Gdk.CURRENT_TIME);
    })().catch(error => logError(error));
  });
  action_map.add_action(explore_fs);
}
