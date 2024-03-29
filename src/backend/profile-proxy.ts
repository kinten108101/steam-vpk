import AddonBoxClient from '../backend/client.js';
import { AddonEntry, Addonlist, AddonlistItem } from '../model/addonlist.js';

export default function ProfileProxy(
{ model,
  client,
}:
{ model: Addonlist;
  client: AddonBoxClient;
}) {
  const exists: Map<string, AddonlistItem> = new Map;
  const on_addons_update = () => {
    (async () => {
      const loadorder = await client.services.addons.call('GetLoadorder', '(as)', '') as string[];
      const configmap = await client.services.addons.call('GetConfigurations', '(a{sv})', '') as any;
      const view_items: AddonlistItem[] = [];
      loadorder.forEach((x, pos) => {
        const config = configmap[x];
        if (config === undefined) {
          console.log('Reading loadorder.', `Could not find config for entry\"${x}\".`, 'Skipping...');
          return;
        }
        if (typeof config['id'] !== 'string') return;
        const item = new AddonEntry({
          id: config['id'] || 'Unknown id',
          pos,
          name: 'Untitled Add-on',
          enabled: config['active'] || true,
          description: 'No description',
          last_update: new Date(),
        });
        view_items.push(item);
      });
      console.time('list-item-factory');
      const deletables: Map<string, AddonlistItem> = new Map(exists);
      view_items.forEach(x => {
        deletables.delete(x.id);
        if (exists.has(x.id)) {
          // row-scope update
        } else {
          // append
          model.append(x);
          exists.set(x.id, x);
        }
        if (x instanceof AddonEntry) x.fetch_addon_data(client);
      });
      deletables.forEach(x => {
        const [found, idx] = model.find(x);
        if (!found) {
          console.error(`item \"${x.id}\" not found`);
          return;
        }
        model.remove(idx);
        exists.delete(x.id);
      });
      console.timeEnd('list-item-factory');
    })().catch(error => logError(error));
  };
  client.services.addons.subscribe('AddonsChanged', on_addons_update);
}
