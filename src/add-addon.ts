import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import { IStorageItem, SampleStorageItem } from './storage-model';

class Js_InsertUrlPage extends Gtk.Box {
  [x: string]: any;
  constructor(props={}){
    super(props);
  }

  switchToLoadingState() {
    const validate_button: Gtk.Button = this._validate_button;
    const spinner = new Gtk.Spinner;
    spinner.set_parent(validate_button);
    validate_button.sensitive = false;
    validate_button.label = '';
    spinner.start();
  }
}

GObject.registerClass({
  GTypeName: 'InsertUrlPage',
  // @ts-ignore
  Template: 'resource:///com/github/kinten108101/SteamVpk/ui/add-addon-url.ui',
  InternalChildren: [
    'url_row',
    'validate_button',
  ],
}, Js_InsertUrlPage);

class Js_DowloadPreviewPage extends Gtk.Box {
  [x: string]: any;
}

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
}, Js_DowloadPreviewPage);

export const AddAddonWindow = GObject.registerClass({
  GTypeName: 'AddAddonWindow',
  // @ts-ignore
  Template: 'resource:///com/github/kinten108101/SteamVpk/ui/add-addon.ui',
  InternalChildren: [
    'view_stack',
    'insert_url_stack_page',
    'download_preview_stack_page',
  ],
}, class Js_AddAddonWindow extends Adw.Window {
  [x: string]: any;
  constructor(params={}){
    super(params);
    const actionGroup = new Gio.SimpleActionGroup;
    const actionEntries: Gio.ActionEntry[] = [
      {
        name: 'validate-url',
        activate: (() => {
          const insert_url_page: Js_InsertUrlPage = this._insert_url_stack_page.get_child();
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
    const preview_page: Js_DowloadPreviewPage = this._download_preview_stack_page.get_child();
    preview_page.visible = true;

    (<Adw.EntryRow>preview_page._row_uuid).text = param.uuid;
    (<Adw.EntryRow>preview_page._row_display_id).text = param.display_id;
    (<Adw.EntryRow>preview_page._row_name).text = param.name;
    (<Adw.EntryRow>preview_page._row_creators).text = param.creators.reduce((acc, cur, idx) => {
      if (idx === 0) return acc;
      return acc + ', ' + cur;
    }, param.creators[0]);
    (<Adw.EntryRow>preview_page._row_categories).text = param.categories.reduce((acc, cur, idx) => {
      if (idx === 0) return acc;
      return acc + ', ' + cur;
    }, param.categories[0]);
    (<Adw.EntryRow>preview_page._row_description).text = param.description;
    (<Adw.EntryRow>preview_page._row_last_update).text = param.last_update;

    const view_stack: Adw.ViewStack = this._view_stack;
    view_stack.visible_child_name = 'downloadPreviewPage';
    return;
  }
});

export const SelectAddonDialog = GObject.registerClass({
  GTypeName: 'SelectAddonDialog',
}, class extends Gtk.FileChooserNative {
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
});
