import GObject from 'gi://GObject';

export default interface NotificationModel {
  connect(signal: 'new-msg', callback: (obj: this, msg: string) => void): number;
  emit(signal: 'new-msg', msg: string): void;
  // inherit
  connect(signal: 'notify', callback: (obj: this, pspec: GObject.ParamSpec) => void): number;
  emit(signal: 'notify'): void;
}

export default class NotificationModel extends GObject.Object {
  static {
    GObject.registerClass({
      Signals: {
        'new-msg': {
          param_types: [GObject.TYPE_STRING],
        },
      },
    }, this);
  }
  show_global_error(msg: string) {
    this.emit('new-msg', msg);
  }
}
