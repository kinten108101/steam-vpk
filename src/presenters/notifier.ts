import GObject from 'gi://GObject';
import Adw from 'gi://Adw';
import { TOAST_TIMEOUT_SHORT } from '../utils/gtk.js';

export default class Notifier extends GObject.Object {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkNotifier',
      Properties: {
        toast_overlay: GObject.ParamSpec.object(
          'toast-overlay', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          Adw.ToastOverlay.$gtype),
      },
    }, this);
  }

  toast_overlay!: Adw.ToastOverlay;

  constructor(params: {
    toast_overlay: Adw.ToastOverlay;
  }) {
    super(params);
  }

  show_global_error(msg: string) {
    const toast = new Adw.Toast({
      title: msg,
      timeout: TOAST_TIMEOUT_SHORT,
    });
    this.toast_overlay.add_toast(toast);
  }
}
