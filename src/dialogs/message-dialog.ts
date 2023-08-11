import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

class MessageDialogWrappedBuilder {
  dialogWrapped: MessageDialogWrap;
  constructor(param: { dialog: Adw.MessageDialog }) {
    this.dialogWrapped = new MessageDialogWrap({ dialog: param.dialog });
  }

  build() {
    return this.dialogWrapped;
  }
}

export namespace MessageDialog {
  export interface Response {
    id: string,
    label: string,
    appearance?: Adw.ResponseAppearance,
  }
}

class MessageDialogBuilder {
  instance: Adw.MessageDialog;

  constructor() {
    this.instance = new Adw.MessageDialog()
  }

  build() {
    return this.instance;
  }

  wrap() {
    return new MessageDialogWrappedBuilder({ dialog: this.instance });
  }

  response(response: MessageDialog.Response) {
    const { id, label, appearance } = response;
    this.instance.add_response(id, label);
    if (appearance) {
      this.instance.set_response_appearance(id, appearance);
    }
    return this;
  }

  /**
   * {@link Adw.MessageDialog.ConstructorProperties.body}
   */
  body(val: string | null, config: { use_markup?: boolean } = {}) {
    this.instance.set_body(val);
    if (config.use_markup) {
      this.instance.set_body_use_markup(config.use_markup);
    }
    return this;
  }

  closeResponse(val: string | null) {
    this.instance.set_close_response(val);
    return this;
  }

  defaultResponse(val: string | null) {
    this.instance.set_default_response(val);
    return this;
  }

  extraChild(val: Gtk.Widget | null) {
    this.instance.set_extra_child(val);
    return this;
  }

  heading(val: string | null, config: { use_markup?: boolean } = {}) {
    this.instance.set_heading(val);
    if (config.use_markup) {
      this.instance.set_heading_use_markup(config.use_markup);
    }
    return this;
  }

  transientFor(val: Gtk.Window | null) {
    this.instance.set_transient_for(val);
    return this;
  }
}

export const MessageDialog = {
  builder() {
    return new MessageDialogBuilder();
  }
}

Gio._promisify(Adw.MessageDialog.prototype, 'choose', 'choose_finish');
export class MessageDialogWrap {
  dialog: Adw.MessageDialog
  constructor(param: { dialog: Adw.MessageDialog }) {
    this.dialog = param.dialog;
  }

  unwrap() {
    return this.dialog;
  }

  async choose_async(cancellable: Gio.Cancellable | null): Promise<string> {
    // @ts-ignore
    return this.dialog.choose(cancellable);
  }
}
