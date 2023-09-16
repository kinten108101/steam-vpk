import AddonsPanel from '../ui/addons-panel.js';
import AddonBoxClient from '../backend/client.js';
import AddonsPanelDisk from '../ui/addons-panel-disk.js';

export default function UsagePresenter(
{ client,
  addons_panel,
  addons_panel_disk,
}:
{ client: AddonBoxClient;
  addons_panel: AddonsPanel;
  addons_panel_disk: AddonsPanelDisk;
}) {
  function update_usage(usage: number) {
    addons_panel.usage = usage;
    addons_panel_disk.used = usage;
  }
  function update_free(free: number) {
    addons_panel.free = free;
    addons_panel_disk.free = free;
  }
  function update_size(size: number) {
    addons_panel.size = size;
  }
  function set_enabled(val: boolean) {
    addons_panel.stat_enabled = val;
  }
  function init() {
    let usage_prev_enabled: boolean | undefined = undefined;
    client.services.disk.property_get('TotalUsage')
      .then(usage => {
        update_usage(usage);
        if (usage_prev_enabled === true) return;
        usage_prev_enabled = true;
        set_enabled(true);
      })
      .catch(error => {
        logError(error);
        if (usage_prev_enabled === false) return;
        usage_prev_enabled = false;
        set_enabled(false);
      });
    let free_prev_enabled: boolean | undefined = undefined;
    client.services.disk.property_get('FreeSpace')
      .then(free => {
        update_free(free);
        if (free_prev_enabled === true) return;
        free_prev_enabled = true;
        set_enabled(true);
      })
      .catch(error => {
        logError(error);
        if (free_prev_enabled === false) return;
        free_prev_enabled = false;
        set_enabled(false);
      });
    let size_prev_enabled: boolean | undefined = undefined;
    client.services.disk.property_get('TotalSpace')
      .then(free => {
        update_size(free);
        if (size_prev_enabled === true) return;
        size_prev_enabled = true;
        set_enabled(true);
      })
      .catch(error => {
        logError(error);
        if (size_prev_enabled === false) return;
        size_prev_enabled = false;
        set_enabled(false);
      });
  }
  client.connect('notify::connected', () => {
    if (client.connected === true) init();
  });
  init();
  client.services.disk.subscribe('notify::TotalUsage', update_usage);
  client.services.disk.subscribe('notify::FreeSpace', update_free);
  client.services.disk.subscribe('notify::TotalSpace', update_size);
}
