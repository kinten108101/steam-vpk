import AddonBoxClient from './client.js';
import Repository, { RepositoryItem } from '../model/repository.js';

type States = {
  name?: string;
};

export default function AddonsProxy(
{ model,
  client,
}:
{ model: Repository;
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

  client.services.addons.subscribe('AddonsStateChange',
    (id: string, states: States ) => {
      const item = model.get(id);
      if (item === undefined) return;
      const { name } = states;
      if (name) item.name = name;
    });
}

