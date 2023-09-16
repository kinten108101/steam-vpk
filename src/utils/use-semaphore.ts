import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';

export function UseSensitivitySemaphore(klass: typeof Gtk.Widget) {
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
      this.sensitive = this._insensitize_requests <= 0;
    }

    sensitize() {
      this._insensitize_requests--;
    }

    insensitize() {
      this._insensitize_requests++;
    }
  }
}

export function UseVisiblitySemaphore(klass: typeof Gtk.Widget) {
  return class extends klass {
    static {
      GObject.registerClass({
        GTypeName: `${klass.name}WithVisibilitySemaphore`,
      }, this);
    }

    __invisible_requests: number = 0;

    set _invisible_requests(val: number) {
      if (this.__invisible_requests === val) return;
      this.__invisible_requests = val;
      this._update_semaphore();
    }

    get _invisible_requests() {
      return this.__invisible_requests;
    }

    _update_semaphore() {
      this.visible = this._invisible_requests <= 0;
    }

    make_visible() {
      this._invisible_requests--;
    }

    make_invisible() {
      this._invisible_requests++;
    }
  }
}

