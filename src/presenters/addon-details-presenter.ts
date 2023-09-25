import Gio from 'gi://Gio';
import GObject from 'gi://GObject';

import AddonDetails from '../ui/addon-details.js';
import AddonBoxClient from '../backend/client.js';
import { ArchiveRow } from '../ui/addon-details/archive-list.js';
import { ArchiveItem } from '../model/archive-store.js';
import AddonDetailsModel from '../model/addon-details-select.js';

export default function AddonDetailsPresenter(
{ archive_model,
  page,
  page_model,
  client,
}:
{ archive_model: Gio.ListModel;
  page: AddonDetails;
  page_model: AddonDetailsModel;
  client: AddonBoxClient;
}) {
  page.archive_list.bind_model(archive_model, (item: GObject.Object) => {
    if (!(item instanceof ArchiveItem)) throw new Error;
    return new ArchiveRow({
      name: item.id,
    });
  });

  let bindings: GObject.Binding[] = [];
  page_model.connect('bind', (_obj, item) => {
    (<string[]>[
      'name',
      'id',
      'steamid',
      'subdir',
      'remote',
    ]).forEach(prop => {
      if (item === null) return;
      const binding = item.bind_property(prop, page, prop,
        GObject.BindingFlags.SYNC_CREATE);
      bindings.push(binding);
    });

    const impl_creator = item.bind_property_full('creators', page, 'creator',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: { id: string }[]): [boolean, string] => {
        const val = from[0]?.id;
        if (!val) return [false, ''];
        if (typeof val !== 'string') return [false, ''];
        return [true, val];
      },
      () => {});
    bindings.push(impl_creator);

    if (typeof item.steamid === 'string')
      client.services.workshop.call(
        'GetWorkshopUrl', '(s)', item.steamid)
          .then((url: string) => {
            page.steamurl = url;
          },
          error => {
            console.error(error);
          });

    client.services.disk.call('GetAddonFolderSize', '(ts)', item.id)
      .then(([size]) => {
          page.used = size;
        })
      .catch(logError);
  });
  page_model.connect('unbind', () => {
    bindings.forEach(x => x.unbind());
    bindings = [];
  });
}
