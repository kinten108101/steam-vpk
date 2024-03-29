import Gdk from 'gi://Gdk';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import AddAddonUrl from '../dialogs/add-addon-url.js';
import AddAddonName from '../dialogs/add-addon-name.js';
import AddonBoxClient from '../backend/client.js';

/**
 * @param {{
 *   parent_window: Gtk.Window;
 *   action_map: Gio.ActionMap;
 *   client: AddonBoxClient;
 * }} params
 */
export default function AddAddonAction(
{ parent_window,
  action_map,
  client,
}) {
  const add_from_url = new Gio.SimpleAction({
    name: 'add-addon.add-url',
  });
  add_from_url.connect('activate', () => {
    /**
     * @type {Map<string, any>}
     */
    const cache = new Map;
    const window = new AddAddonUrl({
      transient_for: parent_window,
    });
    window.connect_signal('input-page::setup', async (_window, page) => {
      console.debug('input-page::setup');
      const display = Gdk.Display.get_default();
      if (display === null) {
        console.debug('no display');
        return false;
      }
      const url = await display.get_clipboard().read_text_async(null);
      if (url === null) {
        console.debug('no value inside gvalue')
        return false;
      }
      page.set_url(url);
      return true;
    });
    window.connect_signal('validate', async (_window, request_error, url) => {
      let response /** @type {[number, any]} */;
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
            console.debug('Unknown code. Received', data['code']);
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
      const gpfd = data['gpfd'];
      const gps = data['gps'];
      page.name_request = gpfd['title'] || 'Untitled add-on';
      page.creator_request = gps['personaname'] || 'Unknown creator';
      page.excerpt_request = gpfd['description'] || 'Unknown description';
      page.size_request = gpfd['file_size'] || 0;
      return true;
    });
    window.connect_signal('download', async (_window, request_error, url, _config) => {
      const data = cache.get(url);
      const gpfd_handle = data['gpfd']['_handle'];
      const gps_handle = data['gps']['_handle'];
      let status /** @type {number} */;
      let response;
      try {
        ([status, response] = await client.services.addons.async_call('CreateFromWorkshop', gpfd_handle, gps_handle, {}));
      } catch (error) {
        request_error(String(error));
        return false;
      }
      if (status !== 0) {
        const msg = (() => {
          if (typeof response['code'] !== 'number') {
            return undefined;
          }
          switch (response['code']) {
          case 1:
          case 2:
            return 'Incorrect Workshop item URL format.';
          default:
            console.log('Unknown code. Received', response['code']);
            return undefined;
          }
        })();
        request_error(msg);
        return false;
      }
      response
      console.debug('success');
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
