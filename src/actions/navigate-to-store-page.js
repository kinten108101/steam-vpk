import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Repository, { RepositoryItem } from '../model/repository.js';

/**
 * @param {{
 *   present: (item: RepositoryItem) => void;
 *   model: Repository;
 *   navigate: (id: string) => void;
 * }} params
 */
export default function NavigateToStorePage(
{ present,
  model,
  navigate,
}) {
  const store_show = new Gio.SimpleAction({
    name: 'store.show',
    parameter_type: GLib.VariantType.new('s')
  });
  store_show.connect('activate', (_action, param) => {
    if (param === null) throw new Error;
    const [val] = param.get_string();
    if (val === null) throw new Error;
    const item = model.get(val);
    if (!item) {
      // do something
      throw new Error;
    }
    present(item);
    navigate(val);
  });

  return {
    store_show,
  }
}
