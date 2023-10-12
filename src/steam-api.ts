import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import Soup from 'gi://Soup';
import { Encoder } from './utils.js';
import { read_json_bytes } from './file.js';

export type GetPublishedFileDetailsResponse = Partial<{
  response: {
    result: number;
    resultcount: number;
    publishedfiledetails: PublishedFileDetails[],
  }
}>;

export type PublishedFileDetails = Partial<{
  publishedfileid: string;
  file_size: number;
  file_url: string;
}>;

export function make_workshop_item_url(file_id: string) {
  return `https://steamcommunity.com/sharedfiles/filedetails/?id=${file_id}`;
}

export default class SteamworkServices {
  url_gpfd: GLib.Uri;
  session: Soup.Session;
  cancellable: Gio.Cancellable;

  constructor(config: { session?: Soup.Session } = {}) {
    this.url_gpfd = GLib.Uri.parse('https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/', GLib.UriFlags.NONE);
    this.session = config.session || new Soup.Session();
    this.cancellable = new Gio.Cancellable();
  }

  async getPublishedFileDetails(steam_id: string): Promise<GetPublishedFileDetailsResponse> {
    const msg = new Soup.Message({
      method: 'POST',
      uri: this.url_gpfd,
    });
    const requestBody = new GLib.Bytes(Encoder.encode(`itemcount=1&publishedfileids%5B0%5D=${steam_id}`));
    msg.set_request_body_from_bytes(
      'application/x-www-form-urlencoded',
      requestBody,
    );
    const gbytes = await this.session.send_and_read_async(msg, GLib.PRIORITY_DEFAULT, this.cancellable);
    const bytes = gbytes.get_data();
    if (bytes === null) throw new Error('Response is empty');
    const response = read_json_bytes(bytes);
    return response;
  }
}
