import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import { IStorageItem, SampleStorageItem } from './storage-model';

class InsertUrlPage extends Gtk.Box {
  // @ts-ignore
  private _validate_button !: Gtk.Button = this._validate_button;
  // private _validate_button !: Gtk.Button;

  static {
    GObject.registerClass({
      GTypeName: 'InsertUrlPage',
      // @ts-ignore
      Template: 'resource:///com/github/kinten108101/SteamVpk/ui/add-addon-url.ui',
      InternalChildren: [
        'url_row',
        'validate_button',
      ],
    }, this);
  }

  constructor(props={}){
    super(props);
  }

  switchToLoadingState() {
    const spinner = new Gtk.Spinner;
    spinner.set_parent(this._validate_button);
    this._validate_button.sensitive = false;
    this._validate_button.label = '';
    spinner.start();
  }
}


export class DowloadPreviewPage extends Gtk.Box {
  /*
  private _row_uuid!: Adw.EntryRow;
  private _row_display_id!: Adw.EntryRow;
  private _row_name!: Adw.EntryRow;
  private _row_creators!: Adw.EntryRow;
  private _row_categories!: Adw.EntryRow;
  private _row_description!: Adw.EntryRow;
  private _row_last_update!: Adw.EntryRow;
  */
  // @ts-ignore
  /** @type {Adw.EntryRow} */ _row_uuid = this._row_uuid;
  // @ts-ignore
  /** @type {Adw.EntryRow} */ _row_display_id = this._row_display_id;
  // @ts-ignore
  /** @type {Adw.EntryRow} */ _row_creators = this._row_creators;
  // @ts-ignore
  /** @type {Adw.EntryRow} */ _row_categories = this._row_categories;
  // @ts-ignore
  /** @type {Adw.EntryRow} */ _row_description = this._row_description;
  // @ts-ignore
  /** @type {Adw.EntryRow} */ _row_last_update = this._row_last_update;
  // @ts-ignore
  /** @type {Adw.EntryRow} */ _row_name = this._row_name;

  static {
    GObject.registerClass({
      GTypeName: 'DownloadPreviewPage',
      // @ts-ignore
      Template: 'resource:///com/github/kinten108101/SteamVpk/ui/add-addon-preview.ui',
      InternalChildren: [
        'row_uuid',
        'row_display_id',
        'row_name',
        'row_creators',
        'row_categories',
        'row_description',
        'row_last_update',
      ],
    }, this);
  }
}

export class AddAddonWindow extends Adw.Window {
  // @ts-ignore
  _view_stack!: Adw.ViewStack = this._view_stack;
  // @ts-ignore
  private _insert_url_stack_page!: Adw.ViewStackPage = this._insert_url_stack_page;
  // @ts-ignore
  private _download_preview_stack_page!: Adw.ViewStackPage = this._download_preview_stack_page;

  static {
    GObject.registerClass({
      GTypeName: 'AddAddonWindow',
      // @ts-ignore
      Template: 'resource:///com/github/kinten108101/SteamVpk/ui/add-addon.ui',
      InternalChildren: [
        'view_stack',
        'insert_url_stack_page',
        'download_preview_stack_page',
      ],
    }, this);
  }

  constructor(params={}){
    super(params);
    const actionGroup = new Gio.SimpleActionGroup;
    const actionEntries: Gio.ActionEntry[] = [
      {
        name: 'validate-url',
        activate: (() => {
          const insert_url_page: InsertUrlPage = <InsertUrlPage>this._insert_url_stack_page.get_child();
          insert_url_page.switchToLoadingState();
          setTimeout(this.switchToDownloadPreviewPage.bind(this), 2000, SampleStorageItem);
        }).bind(this),
        parameter_type: null,
        state: null,
        change_state: () => { return; }
      },
      {
        name: 'download',
        activate: (() => {
          this.close();
        }).bind(this),
        parameter_type: null,
        state: null,
        change_state: () => { return; }
      },
    ];
    actionGroup.add_action_entries(actionEntries, null);
    this.insert_action_group('add-addon', actionGroup);
  }

  switchToDownloadPreviewPage(param: IStorageItem) {
    const preview_page: DowloadPreviewPage = <DowloadPreviewPage>this._download_preview_stack_page.get_child();
    preview_page.visible = true;

    [
      ['_row_uuid', 'uuid'],
      ['_row_display_id', 'display_id'],
      ['_row_name', 'name'],
      ['_row_creators', 'creators'],
      ['_row_categories', 'categories'],
      ['_row_description', 'description'],
      ['_row_last_update', 'last_update'],
    ].forEach( ([gprop, paramprop]) => {
      if (paramprop == 'creators' || paramprop == 'categories') {
        // @ts-ignore
        preview_page[gprop].set_text(
          param[paramprop].reduce(
            (acc, cur, idx) => {
              if (idx === 0) return acc;
              return acc + ', ' + cur;
            }, param[paramprop][0])
        );
      }
      // @ts-ignore
      else preview_page[gprop].set_text(param[paramprop]);
    });

    this._view_stack.set_visible_child_name('downloadPreviewPage');
    return;
  }
}

export class SelectAddonDialog extends Gtk.FileChooserNative {

  static {
    GObject.registerClass({
      GTypeName: 'SelectAddonDialog',
    }, this);
  }

  constructor(params={}){
    const filter = new Gtk.FileFilter;
    filter.add_pattern('*.vpk');
    super({
      ...params,
      title: 'Select add-on archive file',
      modal: true,
      action: Gtk.FileChooserAction.OPEN,
      filter,
    });
    // the callback below didn't need to bind this. How did that happen?
    this.connect('response', ((file_chooser: Gtk.FileChooserNative, response: number) => {
      if (response !== Gtk.ResponseType.ACCEPT) return;
      // TODO: process file here
      const file: Gio.File | null = file_chooser.get_file();
      if (!file) return;
      const addAddonWindow = new AddAddonWindow({
        transient_for: this.transient_for,
      });
      addAddonWindow.show();
      addAddonWindow.switchToDownloadPreviewPage(SampleStorageItem);
      // file_chooser.destroy() ??
    }).bind(this));
  }
}
