import GObject from 'gi://GObject';
import { RepositoryItem } from '../model/repository.js';
import StorePage from '../ui/store-page.js';

/**
 * @param {{
 *  store_page: StorePage;
 * }} params
 *
 * @returns {[
 *  (item: RepositoryItem) => void,
 * ]}
 */
export default function UseStoreDetails(
{ store_page,
}) {

  /**
   * @type {GObject.Binding[]}
   */
  const bindings = [];

  /**
   * @param { RepositoryItem } item
   */
  function present(item) {
    bindings.forEach(x => x.unbind());
    bindings.splice(0, bindings.length);
    bindings.push(item.bind_property('name', store_page, 'title',
      GObject.BindingFlags.SYNC_CREATE));
    bindings.push(item.bind_property_full('creators', store_page, 'subtitle',
      GObject.BindingFlags.SYNC_CREATE,
      /**
       * @param {RepositoryItem["creators"]} from
       * @returns {[
       *   boolean,
       *   string | null,
       * ]}
       */
      (_binding, from) => {
        if (from && from.length > 0) {
          const name = from[0]?.id;
          if (!name) throw new Error;
          if (from.length == 1) {
            return [true, name];
          } else {
            return [true, name + ' et al'];
          }
        } else {
          return [true, null];
        }
      },
      () => {}));
    bindings.push(item.bind_property('description', store_page, 'description',
      GObject.BindingFlags.SYNC_CREATE));
  };

  return [present];
}
