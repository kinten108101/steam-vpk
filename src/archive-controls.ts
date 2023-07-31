import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import { Archiver } from './archive.js';
import { g_variant_unpack, promise_wrap } from './utils.js';
import { AddonStorage } from './addon-storage.js';

export default function ArchiveActions({
  action_map,
  archiver,
  addon_storage,
}:
{
  action_map: Gio.ActionMap;
  archiver: Archiver;
  addon_storage: AddonStorage;
}) {
  const install_archive = new Gio.SimpleAction({ name: 'archive.install-archive', parameter_type: GLib.VariantType.new('s') });
  install_archive.connect('activate', (_action, parameter_type) => {
    promise_wrap(async () => {
      console.debug('<<archive.install-archive>>');
      const id = g_variant_unpack<string>(parameter_type, 'string');
      const addon = addon_storage.idmap.get(id);
      if (addon === undefined) {
        console.warn(`Add-on \"${id}\" not found. Quitting...`);
        return;
      }
      await archiver.retrieve_steam_archive(addon);
      console.debug('>>archive.install-archive<<');
    });
  });
  action_map.add_action(install_archive);
}
