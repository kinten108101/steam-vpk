import GObject from 'gi://GObject';
import Gio from 'gi://Gio';

import * as JSON1 from './utils/json1.js';
import { Results } from './utils/result.js';
import * as Utils from './utils.js';
import { Errors, FlatError } from './utils/errors.js';
import { gobjectClass } from './utils/decorator.js';

import { Model } from './mvc.js';

export interface Subdir {
  id: string,
}

export class IndexFile {
  readonly subdirs: Subdir[];
  readonly comment?: string;

  constructor(param: { subdirs: Subdir[], comment?: string }) {
    this.subdirs = param.subdirs;
    this.comment = param.comment;
  }
}

export enum WriteOrders {
  Reset,
  DeleteEntry,
  AddEntry,
}

export type WriteOrder = WriteOrderReset | WriteOrderDeleteEntry | WriteOrderAddEntry;

export const WriteOrder = {
  compose: {
    Reset() {
      return new WriteOrderReset();
    },
    DeleteEntry(param: Subdir) {
      return new WriteOrderDeleteEntry(param);
    },
    AddEntry(param: Subdir) {
      return new WriteOrderAddEntry(param);
    },
  },
}

export class WriteOrderReset {
  readonly code = WriteOrders.Reset;
}

export class WriteOrderDeleteEntry {
  readonly code = WriteOrders.DeleteEntry;
  readonly param: Subdir;

  constructor(param: Subdir) {
    this.param = param;
  }
}

export class WriteOrderAddEntry {
  readonly code = WriteOrders.AddEntry;
  readonly param: Subdir;

  constructor(param: Subdir) {
    this.param = param;
  }
}

@gobjectClass({
  Signals: {
    'queue-changed': {},
    'index-written': {},
  },
})
export class DirectoryWriter extends GObject.Object {
  queue: WriteOrder[] = [];
  index: Gio.File;
  readable: IndexDirectory;
  isRunning = false; // currently no multithreaded writing

  constructor(param: { readable: IndexDirectory, index: Gio.File }) {
    super({});
    this.readable = param.readable;
    this.index = param.index;
    this.connect('queue-changed', this.updateQueue);
  }

  order(order: WriteOrder): void;
  order(orders: WriteOrder[]): void;
  order(arg: WriteOrder | WriteOrder[]) {
    if (Array.isArray(arg)) {
      arg.forEach(x => this.queue.push(x));
    } else {
      this.queue.push(arg);
    }
    this.emit('queue-changed');
  }

  updateQueue = () => {
    if (this.isRunning)
      return;
    this.isRunning = true;
    const queue = this.queue;
    this.queue = [];
    let order = queue.pop();
    while (order !== undefined) {
      console.log('Handling a WriteOrder:')
      console.log(order);
      switch (order.code) {
      case WriteOrders.Reset:
        {
          const content: IndexFile = new IndexFile({
            subdirs: [],
            comment:  this.readable.comment,
          });

          const writejson = Utils.replaceJSONResult(content, this.index);
          if (writejson.code !== Results.OK) {
            const error = writejson.data;
            console.warn(`Couldn\'t write index file. Must be resolved manually. Detail: ${error.message}`);
            break;
          }
          break;
        }
      case WriteOrders.DeleteEntry:
        {
          const id = order.param;
          if (id === undefined) {
            console.warn('Did not pass in parameter for WriteOrder, this is a programming mistake');
            break;
          }
          const subdirs = new Map(this.readable.subdirs);
          const deletion = subdirs.delete(id.id);
          if (!deletion) {
            console.warn('Tried to delete a non-existent subdir. Skipping...');
            break;
          }

          const content: IndexFile = new IndexFile({
            subdirs: (() => {
                      const arr: Subdir[] = [];
                      subdirs.forEach(x => { arr.push(x) });
                      return arr;
                    })(),
            comment:  this.readable.comment,
          });
          const writejson = Utils.replaceJSONResult(content, this.index);
          if (writejson.code !== Results.OK) {
            const error = writejson.data;
            console.warn(`Couldn\'t write index file. Must be resolved manually. Detail: ${error.message}`);
            break;
          }
          break;
        }
      case WriteOrders.AddEntry:
        {
          const id = order.param;
          if (id === undefined) {
            console.warn('Did not pass in parameter for WriteOrder, this is a programming mistake');
            break;
          }
          const subdirs = new Map(this.readable.subdirs);
          if (subdirs.has(id.id)) {
            console.warn('Add-on already exists. Skipping...');
            break;
          }
          subdirs.set(id.id, id);

          const content: IndexFile = new IndexFile({
            subdirs: (() => {
                      const arr: Subdir[] = [];
                      subdirs.forEach(x => { arr.push(x) });
                      return arr;
                    })(),
            comment:  this.readable.comment,
          });
          const writejson = Utils.replaceJSONResult(content, this.index);
          if (writejson.code !== Results.OK) {
            const error = writejson.data;
            console.warn(`Couldn\'t write index file. Must be resolved manually. Detail: ${error.message}`);
            break;
          }
          break;
        }
      default:
        throw new FlatError({ code: Errors.BAD_SWITCH_CASE });
        break;
      }
      order = queue.pop();
    }
    this.isRunning = false;
    this.emit('index-written');
  }
}

@gobjectClass({
  Signals: {
    'subdirs-changed': {},
    'force-read': {},
  },
})
export class IndexDirectory extends GObject.Object
implements Model {
  index: Gio.File;

  writeable: DirectoryWriter;
  subdirs: Readonly<Map<string, Subdir>>;
  comment?: string;
  isRunning: boolean;

  constructor(param: { file: Gio.File }) {
    super({});
    this.connect('force-read', this.readIndexFile);
    this.index = param.file;
    console.info(`index: ${this.index.get_path()}`);
    this.subdirs = new Map;
    this.writeable = new DirectoryWriter({ index: this.index, readable: this });
    this.writeable.connect('index-written', this.readIndexFile);
    this.isRunning = false;
  }

  async start() {
    this.emit('force-read');
  }

  readIndexFile = () => {
    if (this.isRunning) {
      return;
      console.warn('readIndexFile is busy...');
    }
    this.isRunning = true;
    console.debug('Index is being read...');
    /*
    switch (event) {
    case Gio.FileMonitorEvent.CHANGED:
    case Gio.FileMonitorEvent.CREATED:
      break;
    default:
      console.warn('Index file changed in unexpected ways. Skipping...');
      return;
    }
    */

    const readbytes = Utils.loadContentsResult(this.index, null);
    if (readbytes.code !== Results.OK) {
      const error = readbytes.data;
      if (error.matches(error.domain, Gio.IOErrorEnum.NOT_FOUND)) {
        console.warn('Index file not found! Requested a reset.');
        this.writeable.order({ code: WriteOrders.Reset });
        return;
      }
      else throw error;
    }
    const [, bytes, ] = readbytes.data;

    const decoding = Utils.Decoder.decode(bytes);
    if (decoding.code !== Results.OK) {
      this.writeable.order({ code: WriteOrders.Reset });
      return;
      console.warn('Index file could not be decoded! Must be resolved manually.');
    }
    const strbuf = decoding.data;

    const parsing = JSON1.parse(strbuf);
    if (parsing.code !== Results.OK) {
      this.writeable.order({ code: WriteOrders.Reset });
      return;
      console.warn('Index file has JSON syntax error! Must be resolved manually.');
    }

    const obj = parsing.data;
    // validation
    const subdirs = obj['subdirs'];
    if (subdirs === undefined) {
      this.writeable.order({ code: WriteOrders.Reset });
      return;
      console.warn('Index file lacks required fields! Must be resolved manually.')
    }
    if (!Array.isArray(subdirs)) {
      this.writeable.order({ code: WriteOrders.Reset });
      return;
      console.warn('Should be an array!')
    }

    const map = new Map<string, Subdir>();
    subdirs.forEach(x => {
      if ('id' in x && x.id !== undefined) {
        map.set(x.id, x);
      }
    })

    this.subdirs = map;

    const comment = obj['comment'];
    this.comment = comment;
    console.debug(`Index has finished reading! Result:\nids = ${(() => {
          const arr: string[] = [];
          this.subdirs.forEach(x => arr.push(x.id));
          return arr;
        })()}`)
    this.emit('subdirs-changed');
    this.isRunning = false;
  }
}
