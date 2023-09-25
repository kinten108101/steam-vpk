import Gio from 'gi://Gio';
import ArchiveSelectModel from '../model/archive-select.js';
import { ArchiveItem } from '../model/archive-store.js';

export default function StaticArchiveStorePresenter(
{ select_model,
  archive_store,
}:
{ select_model: ArchiveSelectModel;
  archive_store: Gio.ListStore;
}) {
  select_model.connect('bind', (_obj, item) => {
    if (item === null) {
      console.error('bind_item:', 'item is null');
      return;
    }

    item.archives.forEach(x => {
      if (item === null) {
        console.error('bind_item:', 'item is null');
        return;
      }
      const { path } = x;
      const archive = new ArchiveItem({
        id: path,
        owner: item.id,
      })
      archive_store.append(archive);
    });
  });
  select_model.connect('unbind', (_obj, _item) => {
    archive_store.remove_all();
  });
}
