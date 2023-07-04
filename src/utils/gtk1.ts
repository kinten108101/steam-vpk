import GLib from 'gi://GLib';

export * from './file-dialog.js';
export * from './window-promiser.js';
export * from './spinning-button.js';

const dialog_error_ext = GLib.quark_from_string('gtk-dialog-error-ext');
export function dialog_error_ext_quark() {
  return dialog_error_ext;
}

export enum DialogErrorExt {
  BACK,
}
