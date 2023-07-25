import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import Soup from 'gi://Soup';

import * as Soup1 from './utils/soup1.js';
import * as Utils from './utils.js';
import * as Files from './file.js';
import * as Const from './const.js';
import { Model } from './mvc.js';

export class FlattenByteModel extends Array<GLib.Bytes> {
  flatten() {
    const merged = new Uint8Array(super.length);
    let offset = 0;
    this.forEach(arr => {
      const jsbytes = arr.get_data() || new Uint8Array;
      merged.set(jsbytes, offset);
      offset += jsbytes.length;
    });
    return merged;
  }

  get_size() {
    return this.map(gbytes => gbytes.get_data()?.byteLength || 0).reduce((acc, x) => acc + x, 0);
  }
}

class DownloadOrder extends GObject.Object {
  static {
    Utils.registerClass({
      Signals: {
        'stopped': {},
        'started': { param_types: [GObject.TYPE_STRING] },
      }
    }, this);
  }

  msg: Soup.Message;
  bytesread: number;
  size: number;
  input_stream: Gio.InputStream | undefined;
  cancellable: Gio.Cancellable;
  session: Soup.Session;
  gbytes: GLib.Bytes[];

  saved_location: Gio.File;
  output_stream: Gio.FileOutputStream | undefined;
  monitor: Gio.FileMonitor | undefined;

  constructor(params: { uri: GLib.Uri, size: number, saved_location: Gio.File, session: Soup.Session }) {
    super({});
    this.msg = new Soup.Message({ method: 'GET', uri: params.uri });
    this.size = params.size;
    this.bytesread = 0;
    this.cancellable = new Gio.Cancellable();
    this.saved_location = params.saved_location;
    this.session = params.session;
    this.gbytes = [];
  }

  stop() {
    this.cancellable.cancel();
  }

  async continue() {
    this.cancellable = new Gio.Cancellable();
    return await this.run();
  }

  async request_download() {
    console.time('send-async');
    this.input_stream = await this.session.send_async(this.msg, GLib.PRIORITY_DEFAULT, this.cancellable);
    console.timeEnd('send-async');
    this.output_stream = await this.saved_location.replace_async(null, false, Gio.FileCreateFlags.NONE, GLib.PRIORITY_DEFAULT, this.cancellable);
    this.monitor = this.saved_location.monitor_file(Gio.FileMonitorFlags.NONE, null);
    this.monitor.connect('changed', () => {
      Utils.promise_wrap(async () => {
        const info = await this.saved_location.query_info_async(Gio.FILE_ATTRIBUTE_STANDARD_SIZE, Gio.FileQueryInfoFlags.NONE, GLib.PRIORITY_DEFAULT, null);
        this.bytesread = info.get_size();
      });
    });
  }

  async run() {
    if (this.input_stream === undefined) {
      console.warn('Have not established downstream connection. Download aborted.');
      return;
    }
    if (this.output_stream === undefined) {
      console.warn('Have not established disk outputstream. Download aborted.');
      return;
    }
    try {
      console.time('download');
      // FIXME(kinten):
      // This commented-out code section will lead to error for >300MB orders, sometimes less.
      // Error has to do with GC or something. A JS callback ran duing GC sweep, but which??
      // As a workaround, we can use splice but we don't control the retrieval of each chunk.
      // We monitor progress externally using a file monitor.
      // It's fucking bad.
      /*
      let size = 1;
      while (size !== 0) {
        console.time
        const gbytes = await this.input_stream.read_bytes_async(4096, GLib.PRIORITY_DEFAULT, this.cancellable);
        size = await this.output_stream.write_bytes_async(gbytes, GLib.PRIORITY_DEFAULT, this.cancellable);
        this.bytesread += size;
      }
      */
      await this.output_stream.splice_async(this.input_stream, Gio.OutputStreamSpliceFlags.NONE, GLib.PRIORITY_DEFAULT, this.cancellable);
      console.timeEnd('download');

      await this.input_stream.close_async(GLib.PRIORITY_DEFAULT, this.cancellable);
      await this.output_stream.flush_async(GLib.PRIORITY_DEFAULT, null);
      await this.output_stream.close_async(GLib.PRIORITY_DEFAULT, this.cancellable);
    } catch (error) {
      Utils.log_error(error);
      return;
    }
    console.debug('Download completed!');
  }

  async start() {
    await this.request_download();
    return this.run();
  }

  get_percentage() {
    return this.bytesread / this.size;
  }

  is_running() {
    return !this.cancellable.is_cancelled();
  }
}

export default class Downloader extends GObject.Object implements Model {
  static {
    Utils.registerClass({}, this);
  }

  session: Soup1.SessionWrap;
  soup_session: Soup.Session;
  download_dir: Gio.File;

  queue: Gio.ListStore<DownloadOrder>;

  constructor(param: { download_dir: Gio.File }) {
    super({});
    const _session = new Soup.Session();
    this.session = new Soup1.SessionWrap({ session: _session });
    this.soup_session = _session;
    this.queue = new Gio.ListStore({ item_type: DownloadOrder.$gtype });
    this.download_dir = param.download_dir;
  }

  async start() {
    try {
      Files.make_dir_nonstrict(this.download_dir);
    } catch(error) {
      Utils.log_error(error, 'Quitting...');
      return;
    }
  }

  get_order(position: number) {
    return this.queue.get_item(position);
  }

  register_order(params: { uri: GLib.Uri, size: number, name: string }) {
    const order = new DownloadOrder({
      uri: params.uri,
      size: params.size,
      saved_location: (() => {
        const subdir = this.download_dir.get_child(params.name);
        // NOTE(kinten): can't make placeholder path so we'll throw on the error
        Files.make_dir_nonstrict(subdir);
        const archive = subdir.get_child(Const.ADDON_ARCHIVE);
        return archive;
      })(),
      session: this.soup_session,
    });
    this.queue.append(order);
    return order;
  }
}
