import { BackendPortal } from './api.js';
import { AddonEntry, Addonlist, AddonlistPageItem } from './model/addonlist.js';

export default function LaunchpadPresent(
{ model,
}:
{ model: Addonlist;
}) {
  const addons_service = BackendPortal({
    interface_name: 'com.github.kinten108101.SteamVPK.Server.Addons',
  });
  const exists: Map<string, AddonlistPageItem> = new Map;
  const on_addons_update = () => {
    (async () => {
      const loadorder = await addons_service.call_async('GetLoadorder', '(as)', '') as string[];
      const configmap = await addons_service.call_async('GetConfigurations', '(a{sv})', '') as any;
      const view_items: AddonlistPageItem[] = [];
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
      const deletables: Map<string, AddonlistPageItem> = new Map(exists);
      view_items.forEach(x => {
        deletables.delete(x.id);
        if (exists.has(x.id)) {
          // row-scope update
        } else {
          // append
          model.append(x);
          exists.set(x.id, x);
        }
        if (x instanceof AddonEntry) x.fetch_addon_data();
      });
      deletables.forEach(x => {
        let i = 0;
        let item = model.get_item(i);
        while (item !== x && item !== null) {
          item = model.get_item(++i);
        }
        if (item === null) {
          console.log('Item not found?');
          return;
        }
        model.remove(i);
        exists.delete(x.id);
      });
      console.timeEnd('list-item-factory');
    })().catch(error => logError(error));
  };
  addons_service.subscribe('AddonsChanged', on_addons_update);
}
