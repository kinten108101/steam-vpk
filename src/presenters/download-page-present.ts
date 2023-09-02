import AddonBoxClient from '../backend/client.js';
import RepositoryList, { RepositoryItem } from '../model/repositorylist.js';

abstract class ViewmodelError extends Error{}

class MissingFieldError extends ViewmodelError {
  constructor(name: string) {
    super(`Missing required field \"${name}\" for viewmodel item`);
  }
}

export default function DownloadPagePresent(
{ model,
  client,
}:
{ model: RepositoryList;
  client: AddonBoxClient;
}) {
  const on_addons_update = (new_list: any[]) => {
    const view_items = new_list.map(x => {
      const steamid = x['publishedfileid'];
      // FIXME(kinten): Proper is_remote flag in addon
      const is_remote = steamid !== undefined;
      const id = x['stvpkid'];
      if (id === undefined) throw new MissingFieldError('stvpkid');
      const name = x['title'];
      if (name === undefined) throw new MissingFieldError('title');
      const creator = 'Unavailable';
      const item = new RepositoryItem({
        is_remote,
        id,
        name,
        creator,
        description: x['description'] || '',
      });
      return item;
    });
    model.refill(view_items);
  };
  client.services.addons.subscribe('AddonsChanged', on_addons_update);
}
