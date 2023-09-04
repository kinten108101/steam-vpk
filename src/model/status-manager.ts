import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import {
  param_spec_string,
  registerClass,
} from '../steam-vpk-utils/utils.js';

export interface Status extends GObject.Object {
  connect(signal: 'clear', callback: ($obj: this) => void): number;
  connect(signal: 'notify', callback: ($obj: this, psepc: GObject.ParamSpec) => void): number;
  emit(signal: 'clear'): void;
  emit(signal: 'notify'): void;
}
export class Status extends GObject.Object {
  static last_id = -1;

  static generate_id() {
    const id = String(++Status.last_id);
    return id;
  };

  static {
    registerClass({
      Properties: {
        id: param_spec_string({ name: 'id' }),
        date: GObject.ParamSpec.jsobject('date', '', '',
          GObject.ParamFlags.READWRITE),
      },
      Signals: {
        'clear': {},
      },
    }, this);
  }

  id: string = Status.generate_id();
  date: Date = new Date;

  clear() {
    this.emit('clear');
  }
}

export class ErrorStatus extends Status {
  static [GObject.properties] = {
    msg: param_spec_string({ name: 'msg' }),
    short: param_spec_string({ name: 'short' }),
  };

  static {
    registerClass({}, this);
  }

  short!: string;
  msg!: string;
  constructor(params: {
    short: string;
    msg: string;
  }) {
    super(params);
  }
}

export class BuildStatus extends Status {
  static {
    registerClass({
      Properties: {
        status: param_spec_string({ name: 'status' }),
        elapsed: GObject.ParamSpec.uint64('elapsed', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          0, Number.MAX_SAFE_INTEGER, 0),
      },
    }, this);
  }

  status!: string;
  elapsed!: number;
  _using_set_interval: GLib.Source | undefined;

  time(): boolean {
    if (this._using_set_interval !== undefined) {
      console.warn('BuildStatus::time:', 'Timing has already begun');
      return false;
    }
    this._using_set_interval = setInterval(() => {
      this.elapsed++;
    }, 1);
    return true;
  }

  timeEnd(): boolean {
    if (this._using_set_interval === undefined) {
      console.warn('BuildStatus::timeEnd', 'No timing is taking place!');
      return false;
    }
    this._using_set_interval.destroy();
    this._using_set_interval = undefined;
    return true;
  }

  clear(): boolean {
    if (this._using_set_interval !== undefined) {
      console.warn('BuildStatus::clear', 'Cannot clear status while timing is ongoing');
      return false;
    }
    super.clear();
    return true;
  }
}

export default class StatusManager
extends Gio.ListStore<Status> {
  static {
    registerClass({}, this);
  }

  idmap: Map<string, Status> = new Map;

  constructor() {
    super({ item_type: Status.$gtype });
  }

  append(status: Status) {
    this.idmap.set(status.id, status);
    status.connect('clear', () => {
      this.clear_status(status.id);
    });
    super.append(status);
  }

  remove(idx: number) {
    const status = this.get_item(idx) as Status | null;
    if (status !== null) {
      this.idmap.delete(status.id);
    }
    super.remove(idx);
  }

  add_error(...params: ConstructorParameters<typeof ErrorStatus>) {
    const status = new ErrorStatus(params[0]);
    this.append(status);
    return status.id;
  }

  add_build_tracker() {
    const status = new BuildStatus();
    this.append(status);
    return status;
  }

  clear_status(id: string): boolean {
    const status = this.idmap.get(id);
    if (status === undefined) return false;
    const [found, idx] = this.find(status);
    if (!found) return false;
    this.remove(idx);
    return true;
  }
}
