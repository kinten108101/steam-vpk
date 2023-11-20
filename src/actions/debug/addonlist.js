import Gio from 'gi://Gio';
import Adw from 'gi://Adw';
import { AddonEntry } from '../../model/addonlist.js';

/**
 * @param { { store: Gio.ListStore } } params
 * @return { { [key: string]: Gio.SimpleAction } }
 */
export default function AddonlistActions(
{ store,
}) {
  const insert = new Gio.SimpleAction({
    name: 'addonlist.insert',
  });

  insert.connect('activate', () => {
    const dialog = new Adw.MessageDialog({
      heading: 'Add an add-on list entry',
      body: 'Enter the ID of the add-on to be included in the add-on list',
      close_response: 'cancel',
      default_response: 'add',
    });
    dialog.add_response('cancel', 'Cancel');
    dialog.add_response('add', 'Add');
    const field = new Adw.EntryRow({
      title: 'Target ID',
    });
    dialog.set_extra_child(field);

    (async () => {

      /** @type { 'cancel' | 'add' } */
      // @ts-ignore
      const response = await dialog.choose(null);
      console.debug('response:', '\"' + String(response) + '\"');
      switch (response) {
      case 'cancel':
        return;
      case 'add':
        break;
      default:
        return;
      }

      const id = field.get_text();
      if (!id) throw new Error;
      const item = new AddonEntry({
        id,
        pos: Math.round(Math.random()),
      });
      store.append(item);

    })().catch(logError);
  });

  return {
    insert,
  };
}
