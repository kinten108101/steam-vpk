import Gio from 'gi://Gio';
import { RepositoryItem } from '../../model/repository.js';
import { btoa } from '../../utils/base64.js';

/**
 * @param {{
 *   store: Gio.ListStore;
 * }} params
 */
export default function RepositoryActions(
{ store,
}) {
  const insert = new Gio.SimpleAction({
    name: 'repository.insert',
  });

  insert.connect('activate', () => {
    const id = btoa(String(Math.round(Math.random()*1000000)).padEnd(6, '0')) + '@' + btoa(String(Math.round(Math.random()*1000000)).padEnd(6, '0'));
    const author = btoa(String(Math.round(Math.random()*1000000)).padEnd(6, '0'));
    const steamid = String(Math.round(Math.random()*1000000000)).padEnd(10,'0');
    const item = new RepositoryItem({
      id,
      steamid,
      remote: Math.round(Math.random()) == 1,
      subdir: null,
      name: null,
      creators: (author !== null) ? [
        {
          id: author,
        }
      ] : [],
      description: null,
      use_state: null,
      archives: null,
    });
    store.append(item);
  });

  return {
    insert,
  };
}
