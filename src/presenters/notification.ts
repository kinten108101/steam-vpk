import Adw from 'gi://Adw';
import NotificationModel from '../model/notification.js';
import { TOAST_TIMEOUT_SHORT } from '../utils/gtk.js';

export default function NotificationPresenter(
{ toast_overlay,
  model,
}:
{ toast_overlay: Adw.ToastOverlay;
  model: NotificationModel;
}) {
  model.connect('new-msg', (_obj, msg) => {
    const toast = new Adw.Toast({
      title: msg,
      timeout: TOAST_TIMEOUT_SHORT,
    });
    toast_overlay.add_toast(toast);
  });
}
