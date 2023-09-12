import AddonBoxClient from '../backend/client.js';
import RepositoryList, { RepositoryItem } from '../model/repository.js';

export default function RepositoryProxy(
{ model,
  client,
}:
{ model: RepositoryList;
  client: AddonBoxClient;
}) {
  const on_addons_update = (new_list: any[]) => {
    const view_items = new_list.map(x => {
      // FIXME(kinten): Proper is_remote flag in addon
      const item = new RepositoryItem({
        id: x['stvpkid'] || null,
        steamid: x['publishedfileid'] || null,
        remote: x['publishedfileid'] !== undefined,
        subdir: x['subdir'] || null,
        name: x['title'] || null,
        creators: x['creators'] || null,
        description: x['description'] || null,
        use_state: null,
        archives: x['archive_group'] || null,
      });
      return item;
    });
    model.refill(view_items);
  };
  client.services.addons.subscribe('AddonsChanged', on_addons_update);
}
