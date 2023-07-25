import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Gtk from 'gi://Gtk';

import { Result } from './result.js';

class FileFilterBuilder {

  instance: Gtk.FileFilter;

  constructor() {
    this.instance = new Gtk.FileFilter();
  }

  build() {
    return this.instance;
  }

  /**
   * Adds a rule allowing a shell style glob to a filter.
   *
   * Note that it depends on the platform whether pattern
   * matching ignores case or not. On Windows, it does, on
   * other platforms, it doesn't.
   * @param pattern a shell style glob
   */
  pattern(pattern: string | null) {
    this.instance.add_pattern(pattern);
    return this;
  }

  patterns(patterns: string[]) {
    patterns.forEach(x => {
      this.pattern(x);
    });
    return this;
  }

  /**
   * Adds a rule allowing a given mime type to `filter`.
   * @param mime_type name of a MIME type
   */
  mimeType(mime_type: string | null) {
    this.instance.add_mime_type(mime_type);
    return this;
  }

  /**
   * Adds a rule allowing image files in the formats supported
   * by GdkPixbuf.
   *
   * This is equivalent to calling [method`Gtk`.FileFilter.add_mime_type]
   * for all the supported mime types.
   */
  pixbufFormats() {
    this.instance.add_pixbuf_formats();
    return this;
  }

  /**
   * Adds a suffix match rule to a filter.
   *
   * This is similar to adding a match for the pattern
   * "*.`suffix"`.
   *
   * In contrast to pattern matches, suffix matches
   * are *always* case-insensitive.
   * @param suffix filename suffix to match
   */
  suffix(suffix: string | null) {
    this.instance.add_suffix(suffix);
    return this;
  }
}

/**
 * @deprecated
 */
export const FileFilter = {
    builder() {
    return new FileFilterBuilder();
  }
}

export interface FileDialogBuilderConstructor {
  filters?: Gio.ListStore;
}


class FileDialogWrapBuilder {
  dialogWrap: FileDialogWrap;
  constructor(param: { dialog: Gtk.FileDialog }) {
    this.dialogWrap = new FileDialogWrap({ dialog: param.dialog });
  }

  build() {
    return this.dialogWrap;
  }
}

class FileDialogBuilder {
  instance: Gtk.FileDialog;

  constructor(param: FileDialogBuilderConstructor) {
    const { filters } = param;
    this.instance = new Gtk.FileDialog();
    if (filters)
      this.instance.set_filters(filters);
  }

  build() {
    return this.instance;
  }

  wrap() {
    return new FileDialogWrapBuilder({ dialog: this.instance });
  }

  /**
   * Label for the file chooser's accept button.
   */
  acceptLabel(val: string) {
    this.instance.set_accept_label(val);
    return this;
  }
  /**
   * The default filter, that is, the filter that is initially
   * active in the file chooser dialog.
   *
   * If the default filter is %NULL, the first filter of [property`Gtk`.FileDialog:filters]
   * is used as the default filter. If that property contains no filter, the dialog will
   * be unfiltered.
   *
   * If [property`Gtk`.FileDialog:filters] is not %NULL, the default filter should be part
   * of the list. If it is not, the dialog may choose to not make it available.
   */
  defaultFilter(val: Gtk.FileFilter | null) {
    this.instance.set_default_filter(val);
    return this;
  }

  /**
   * The list of filters.
   *
   * See [property`Gtk`.FileDialog:default-filter] about how those two properties interact.
   */
  filters(val: Gio.ListStore<Gtk.FileFilter>) {
    this.instance.set_filters(val);
    return this;
  }

  filter(val: Gtk.FileFilter) {
    let model = <Gio.ListStore | null> this.instance.get_filters();
    if (model === null) {
      const newModel = new Gio.ListStore({
        item_type: Gtk.FileFilter.$gtype,
      });
      this.instance.set_filters(newModel);
      model = newModel;
    }
    model.append(val);
    return this;
  }

  /**
   * The inital file, that is, the file that is initially selected
   * in the file chooser dialog
   *
   * This is a utility property that sets both [property`Gtk`.FileDialog:initial-folder] and
   * [property`Gtk`.FileDialog:initial-name].
   */
  initialFile(val: Gio.File | null) {
    this.instance.set_initial_folder(val);
    return this;
  }

  /**
   * The inital folder, that is, the directory that is initially
   * opened in the file chooser dialog
   */
  initialFolder(val: Gio.File | null) {
    this.instance.set_initial_folder(val);
    return this;
  }

  /**
   * The inital name, that is, the filename that is initially
   * selected in the file chooser dialog.
   */
  initialName(val: string | null) {
    this.instance.set_initial_name(val);
    return this;
  }

  /**
   * Whether the file chooser dialog is modal.
   */
  modal(val: boolean) {
    this.instance.set_modal(val);
    return this;
  }

  /**
   * A title that may be shown on the file chooser dialog.
   */
  title(val: string) {
    this.instance.set_title(val);
    return this;
  }
}

export const FileDialog = {
  /**
   * @deprecated
   */
  builder(param: FileDialogBuilderConstructor = {}) {
    return new FileDialogBuilder(param);
  }
}

Gio._promisify(Gtk.FileDialog.prototype, 'save', 'save_finish');
Gio._promisify(Gtk.FileDialog.prototype, 'open', 'open_finish');
export class FileDialogWrap {
  dialog: Gtk.FileDialog;

  constructor(param: { dialog: Gtk.FileDialog }) {
    this.dialog = param.dialog;
  }

  /**
   * Promisified version of {@link gtk_file_dialog_save}
   *
   * This function initiates a file save operation by
   * presenting a file chooser dialog to the user, then returns the resulting file.
   *
   * @param parent the parent `GtkWindow`
   * @param cancellable a `GCancellable` to cancel the operation
   * @returns the file that was selected.   Otherwise, `NULL` is returned and error is set
   */
  async save_async(parent: Gtk.Window | null, cancellable: Gio.Cancellable | null): Promise<Result<Gio.File, GLib.Error>> {
    // @ts-ignore
    return await this.dialog.save(parent, cancellable)
    // @ts-ignore
      .then((value: Gio.File) => {
        return Result.compose.OK(value);
      })
    // @ts-ignore
      .catch((error) => {
        if (error instanceof GLib.Error)
          return Result.compose.NotOK(error);
        return error;
      });
  }

  async open_async(parent: Gtk.Window | null, cancellable: Gio.Cancellable | null): Promise<Result<Gio.File, GLib.Error>> {
    // @ts-ignore
    return await this.dialog.open(parent, cancellable)
      // @ts-ignore
      .then((value: Gio.File) => {
        return Result.compose.OK(value);
      })
    // @ts-ignore
      .catch((error) => {
        if (error instanceof GLib.Error)
          return Result.compose.NotOK(error);
        return error;
      });
  }
}
