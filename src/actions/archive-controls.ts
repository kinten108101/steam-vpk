import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

import { g_variant_unpack, promise_wrap } from '../utils.js';

export default function ArchiveActions({
  action_map,
}:
{
  action_map: Gio.ActionMap;
}) {
  const install_archive = new Gio.SimpleAction({ name: 'archive.install-archive', parameter_type: GLib.VariantType.new('s') });
  install_archive.connect('activate', (_action, parameter_type) => {
    promise_wrap(async () => {
      const id = g_variant_unpack<string>(parameter_type, 'string');
      id;
    });
  });
  action_map.add_action(install_archive);
}
