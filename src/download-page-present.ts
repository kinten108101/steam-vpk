import { BackendPortal } from './api.js';
import { RepositoryListStore } from './download-page.js';

export default function DownloadPagePresent(
{ model,

}:
{ model: RepositoryListStore;

}) {
  const addons_service = BackendPortal({
    interface_name: 'com.github.kinten108101.SteamVPK.Server.Addons',
  });
  const on_addons_update = (new_list: any[]) => {
    model.refill(new_list);
  };
  addons_service.subscribe('AddonsChanged', on_addons_update);
}
