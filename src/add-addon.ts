import Gdk from 'gi://Gdk';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import AddAddonUrl from './dialogs/add-addon-url.js';
import AddAddonName from './dialogs/add-addon-name.js';
import AddonBoxClient from './backend/client.js';

Gio._promisify(Gdk.Clipboard.prototype, 'read_text_async', 'read_text_finish');

export default function AddAddonAction(
{ parent_window,
  action_map,
  client,
}:
{ parent_window: Gtk.Window;
  action_map: Gio.ActionMap;
  client: AddonBoxClient;
}) {
  const add_from_url = new Gio.SimpleAction({
    name: 'add-addon.add-url',
  });
  add_from_url.connect('activate', () => {
    const window = new AddAddonUrl({
      transient_for: parent_window,
    });
    const cache: Map<string, any> = new Map;
    window.connect_signal('input-page::setup', async (_window, page) => {
      console.log('input-page::setup');
      const display = Gdk.Display.get_default();
      if (display === null) {
        console.log('no display');
        return false;
      }
      const url = await display.get_clipboard().read_text_async(null);
      if (url === null) {
        console.log('no value inside gvalue')
        return false;
      }
      page.set_url(url);
      return true;
    });
    window.connect_signal('validate', async (_window, request_error, url) => {
      let response: [number, any];
      try {
        response = await client.services.workshop.async_call(
          'GetPublishedFileDetails', url);
      } catch (error) {
        request_error(`${error}`);
        return false;
      }
      const [status, data] = response;
      if (status !== 0) {
        const msg = (() => {
          if (typeof data['code'] !== 'number') {
            return undefined;
          }
          switch (data['code']) {
          case 1:
          case 2:
            return 'Incorrect Workshop item URL format.';
          default:
            console.log('Unknown code. Received', data['code']);
            return undefined;
          }
        })();
        request_error(msg);
        return false;
      }
      cache.set(url, data);
      return true;
    });
    window.connect_signal('preview-page::setup', async (_window, url, page) => {
      const data = cache.get(url);
      if (data === undefined) return false;
      page.name_request = data['title'] || 'Untitled add-on';
      page.creator_request = data['creator'] || 'Unknown creator';
      page.excerpt_request = data['description'] || 'Unknown description';
      page.size_request = data['file_size'] || 0;
      return true;
    });
    window.show();
  });
  action_map.add_action(add_from_url);

  const add_from_name = new Gio.SimpleAction({
    name: 'add-addon.add-name',
  });
  add_from_name.connect('activate', () => {
    const window = new AddAddonName({
      transient_for: parent_window,
    });
    window.present();
  });
  action_map.add_action(add_from_name);
}
