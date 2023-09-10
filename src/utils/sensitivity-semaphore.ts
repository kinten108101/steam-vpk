import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';

export default function UseSensitivitySemaphore(klass: typeof Gtk.Widget) {
  return class extends klass {
    static {
      GObject.registerClass({
        GTypeName: `${klass.name}WithSensitivitySemaphore`,
      }, this);
    }

    __insensitize_requests: number = 0;

    set _insensitize_requests(val: number) {
      if (this.__insensitize_requests === val) return;
      this.__insensitize_requests = val;
      this._update_semaphore();
    }

    get _insensitize_requests() {
      return this.__insensitize_requests;
    }

    _update_semaphore() {
      this.visible = this.__insensitize_requests <= 0;
    }

    sensitize() {
      if (this._insensitize_requests <= 0) return;
      this._insensitize_requests--;
    }

    insensitize() {
      this._insensitize_requests++;
    }
  }
}
