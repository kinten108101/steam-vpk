import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import { Result } from './result.js';

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
    const { id, label } = response;
    this.instance.add_response(id, label);
    return this;
  }

  /**
   * {@link Adw.MessageDialog.ConstructorProperties.body}
   */
  body(val: string | null) {
    this.instance.set_body(val);
    return this;
  }

  bodyUseMarkup(val: boolean) {
    this.instance.set_body_use_markup(val);
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

  heading(val: string | null) {
    this.instance.set_heading(val);
    return this;
  }

  headingUseMarkup(val: boolean) {
    this.instance.set_heading_use_markup(val);
    return this;
  }

  transientFor(val: Gtk.Window) {
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

  async choose_async(cancellable: Gio.Cancellable | null): Promise<Result<string, GLib.Error>> {
    // @ts-ignore
    return this.dialog.choose(cancellable)
    // @ts-ignore
      .then((value: string) => {
        return Result.compose.OK(value);
      })
    // @ts-ignore
      .catch(error => {
        if (error instanceof GLib.Error) {
          return Result.compose.NotOK(error);
        }
        return error;
      })
  }
}
