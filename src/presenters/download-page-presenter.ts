import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import { DownloadPage, DownloadPageRow } from '../ui/download-page.js';
import { RepositoryItem } from '../model/repository.js';

export default function DownloadPagePresenter(
{ download_page,
  local_addons,
  remote_addons,
}:
{ download_page: DownloadPage;
  local_addons: Gio.ListModel;
  remote_addons: Gio.ListModel;
}) {
  (<[Gtk.ListBox, Gio.ListModel, Adw.PreferencesGroup][]>
  [
    [download_page.local_addons, local_addons, download_page.local_group],
    [download_page.remote_addons, remote_addons, download_page.remote_group],
  ]).forEach(([list, model, group]) => {

    list.bind_model(model, (item: GObject.Object) => {
      if (!(item instanceof RepositoryItem)) throw new Error;
      const widget = new DownloadPageRow();

      // FIXME(kinten) Will do binding once we use listview with factory aka bind/unbind signals
      widget.title = item.name;
      widget.subtitle = (() => {
        const from = item.creators;
        if (from === null) return null;
        const name = from[0]?.id; // placeholder
        if (name === undefined) return null;
        return name;
      })();
      widget.description = item.description;
      widget.use_state = item.use_state;
      widget.id = item.id;
      widget.enable_text_markup = download_page.enable_text_markup;

      return widget;
    });

    model.connect('items-changed', download_page.update_group_with_list.bind(null, model, group));
    download_page.update_group_with_list(model, group);
  });
}
