import Adw from 'gi://Adw';
import { Wrapper } from './glib1.js';

export interface Toaster {
  displayToast(toast: Adw.Toast): void;
}

class ToastWrapBuilder {
  toastWrap: ToastWrap;
  constructor(param: { toast: Adw.Toast }) {
    this.toastWrap = new ToastWrap({ toast: param.toast });
  }

  build() {
    return this.toastWrap;
  }
}

class ToastBuilder {
  toast: Adw.Toast;
  constructor() {
    this.toast = new Adw.Toast();
  }

  build() {
    return this.toast;
  }

  title(val: string | null) {
    this.toast.set_title(val);
    return this;
  }

  timeout(seconds: number) {
    this.toast.set_timeout(seconds);
    return this;
  }

  wrap() {
    return new ToastWrapBuilder({ toast: this.toast });
  }
}

export const Toast = {
  builder() {
    return new ToastBuilder();
  },
}

class ToastWrap extends Wrapper<Adw.Toast> {
  constructor(param: {
    toast: Adw.Toast,
  }) {
    super(param.toast);
  }

  present(recv: Toaster) {
    recv.displayToast(this.unwrap());
  }
}
