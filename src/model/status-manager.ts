import GObject from 'gi://GObject';
import Gio from 'gi://Gio';

export const StatusKlasses: any[] = [];

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
    GObject.registerClass({
      Properties: {
        id: GObject.ParamSpec.string(
          'id', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
        date: GObject.ParamSpec.jsobject(
          'date', '', '',
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
  static {
    GObject.registerClass({
      Properties: {
        msg: GObject.ParamSpec.string(
          'msg', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
        short: GObject.ParamSpec.string(
          'short', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
      },
    }, this);
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

StatusKlasses.push(ErrorStatus);

export namespace BuildStatus {
  export type TimeUnit = 'second' | 'milisecond';
}

export class BuildStatus extends Status {
  static {
    GObject.registerClass({
      Properties: {
        status: GObject.ParamSpec.string(
          'status', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
        elapsed: GObject.ParamSpec.uint64(
          'elapsed', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          0, Number.MAX_SAFE_INTEGER, 0),
        time_unit: GObject.ParamSpec.string(
          'time-unit', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          <BuildStatus.TimeUnit>'second'),
        finished: GObject.ParamSpec.boolean(
          'finished', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          false),
      },
    }, this);
  }

  status!: string;
  elapsed!: number;
  time_unit!: BuildStatus.TimeUnit;
  finished!: boolean;
}

StatusKlasses.push(BuildStatus);

export default class StatusManager extends Gio.ListStore<Status> {
  static {
    GObject.registerClass({}, this);
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
