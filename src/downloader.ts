import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import Soup from 'gi://Soup';

import * as Soup1 from './utils/soup1.js';

import { gobjectClass } from './utils/decorator.js';

Gio._promisify(Soup.Session.prototype,
  'send_async',
  'send_finish');
Gio._promisify(Soup.Session.prototype,
  'send_and_read_async',
  'send_and_read_finish');
@gobjectClass()
export class Downloader extends GObject.Object {
  session: Soup1.SessionWrap;

  constructor(param = {}) {
    super(param);
    const _session = new Soup.Session();
    this.session = new Soup1.SessionWrap({ session: _session });
  }
}
