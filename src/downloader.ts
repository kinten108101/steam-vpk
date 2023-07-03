import GObject from 'gi://GObject';
import Soup from 'gi://Soup';

import * as Soup1 from './utils/soup1.js';

import { gobjectClass } from './utils/decorator.js';

@gobjectClass()
export class Downloader extends GObject.Object {
  session: Soup1.SessionWrap;

  constructor(param = {}) {
    super(param);
    const _session = new Soup.Session();
    this.session = new Soup1.SessionWrap({ session: _session });
  }
}
