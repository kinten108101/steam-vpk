import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import {
  param_spec_string,
  registerClass,
} from './steam-vpk-utils/utils.js';

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
      }
    }, this);
  }

  id: string = Status.generate_id();
  date: Date = new Date;
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
    registerClass({}, this);
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

  add_error(...params: ConstructorParameters<typeof ErrorStatus>) {
    const status = new ErrorStatus(params[0]);
    this.idmap.set(status.id, status);
    this.append(status);
    return status.id;
  }

  add_build_tracker() {
    const status = new BuildStatus();
    this.idmap.set(status.id, status);
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

export function StatusActions(
{ action_map,
  status_manager,
}:
{ action_map: Gio.ActionMap;
  status_manager: StatusManager;
}) {
  const make_error = new Gio.SimpleAction({
    name: 'status.error',
    parameter_type: GLib.VariantType.new('s'),
  });
  make_error.connect('activate', (_action, parameter) => {
    const msg = parameter?.recursiveUnpack() as string;
    if (msg === undefined) throw new Error;
    status_manager.add_error({
      short: 'Untitled',
      msg,
    });
  });
  action_map.add_action(make_error);

  const pop_status = new Gio.SimpleAction({
    name: 'status.pop',
  });
  pop_status.connect('activate', () => {
    const last = status_manager.get_n_items() - 1;
    if (last === -1) return;
    status_manager.remove(last);
  });
  action_map.add_action(pop_status);
}
