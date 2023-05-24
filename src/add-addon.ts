import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import { ActionEntry, StatelessActionEntry, makeAction } from './actions.js';

class InsertUrlPage extends Gtk.Box {
  private _validate_button !: Gtk.Button;

  static {
    GObject.registerClass({
      GTypeName: 'InsertUrlPage',
      Template: 'resource:///com/github/kinten108101/SteamVpk/ui/add-addon-url.ui',
      InternalChildren: [
        'url_row',
        'validate_button',
      ],
    }, this);
  }

  switchToLoadingState() {
    const spinner = new Gtk.Spinner();
    spinner.set_parent(this._validate_button);
    this._validate_button.sensitive = false;
    this._validate_button.label = '';
    spinner.start();
  }
}


export class DowloadPreviewPage extends Gtk.Box {
  public row_uuid!: Adw.EntryRow;

  public row_display_id!: Adw.EntryRow;

  public row_name!: Adw.EntryRow;

  public row_creators!: Adw.EntryRow;

  public row_categories!: Adw.EntryRow;

  public row_description!: Adw.EntryRow;

  public row_last_update!: Adw.EntryRow;

  static {
    GObject.registerClass({
      GTypeName: 'DownloadPreviewPage',
      Template: 'resource:///com/github/kinten108101/SteamVpk/ui/add-addon-preview.ui',
      Children: [
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
  private _view_stack!: Adw.ViewStack;

  private _insert_url_stack_page!: Adw.ViewStackPage;

  private _download_preview_stack_page!: Adw.ViewStackPage;

  static {
    GObject.registerClass({
      GTypeName: 'AddAddonWindow',
      Template: 'resource:///com/github/kinten108101/SteamVpk/ui/add-addon.ui',
      InternalChildren: [
        'view_stack',
        'insert_url_stack_page',
        'download_preview_stack_page',
      ],
    }, this);
  }

  constructor(params = {}) {
    super(params);
    const actionGroup = new Gio.SimpleActionGroup();

    const actionList: ActionEntry[] = [
      {
        name: 'validate-url',
        activate: () => {
          const insertUrlPage: InsertUrlPage = <InsertUrlPage><unknown> this._insert_url_stack_page.get_child();
          insertUrlPage.switchToLoadingState();
          setTimeout(this.switchToDownloadPreviewPage.bind(this), 2000, SampleStorageItem);
        },
      } as StatelessActionEntry,
      {
        name: 'download',
        activate: () => {
          this.close();
        },
      } as StatelessActionEntry,
    ];
    actionList.forEach(item => {
      const action = makeAction(item);
      actionGroup.insert(action);
    });

    this.insert_action_group('add-addon', actionGroup);
  }

  switchToDownloadPreviewPage(target: IStorageItem): void {
    const previewPage: DowloadPreviewPage = <DowloadPreviewPage><unknown> this._download_preview_stack_page.get_child();
    previewPage.set_visible(true);

    previewPage.row_uuid.set_text(target.uuid);
    previewPage.row_display_id.set_text(target.display_id);
    previewPage.row_name.set_text(target.name);
    if (target.creators !== undefined) {
      previewPage.row_creators.set_text(
        target.creators.reduce((acc: string, cur: string, idx: number) => {
          if (idx === 0)
            return acc;
          return `${acc}, ${cur}`;
        }, <string>target.creators[0]),
      );
    }
    if (target.categories !== undefined) {
      previewPage.row_categories.set_text(
        target.categories.reduce((acc: string, cur: string, idx: number) => {
          if (idx === 0)
            return acc;
          return `${acc}, ${cur}`;
        }, <string>target.categories[0]),
      );
    }
    previewPage.row_description.set_text(target.description);
    previewPage.row_last_update.set_text(target.last_update);

    this._view_stack.set_visible_child_name('downloadPreviewPage');
  }
}

export class SelectAddonDialog extends Gtk.FileChooserNative {

  static {
    GObject.registerClass({
      GTypeName: 'SelectAddonDialog',
    }, this);
  }

  constructor(params = {}) {
    const filter = new Gtk.FileFilter();
    filter.add_pattern('*.vpk');
    super({
      ...params,
      title: 'Select add-on archive file',
      modal: true,
      action: Gtk.FileChooserAction.OPEN,
      filter,
    });
    // the callback below didn't need to bind this. How did that happen?
    this.connect('response', (fileChooser: Gtk.FileChooserNative, response: number) => {
      if (response !== Gtk.ResponseType.ACCEPT)
        return;
      // TODO: process file here
      const file: Gio.File | null = fileChooser.get_file();
      if (!file)
        return;
      const addAddonWindow = new AddAddonWindow({
        transient_for: this.transient_for,
      });
      addAddonWindow.show();
      addAddonWindow.switchToDownloadPreviewPage(SampleStorageItem);
      // file_chooser.destroy() ??
    });
  }
}

export interface IStorageItem {
  uuid: string,
  display_id: string,
  icon?: string,
  name: string,
  creators: string[],
  categories: string[],
  description: string,
  last_update: string,
  file: string,
}

export class Js_StorageItem extends GObject.Object {}

export const StorageItem = GObject.registerClass({
  GTypeName: 'StorageItem',
  Properties: {

  },
}, Js_StorageItem);

export const SampleStorageItem: IStorageItem = {
  uuid: '2964411676',
  display_id: '',
  name: 'Counter-Strike 2: P90',
  creators: ['ihcorochris'],
  categories: [
    'Sounds',
    'UI',
    'Models',
    'SMG',
  ],
  description:
`The most futuristic gun on the planet!

The FN P90 TR (Triple Rail) appears in the game with rail-mounted iron sights. It is the only submachine gun not to award extra money for kills. The weapon is frequently linked with lower-skilled players due to its high armor penetration value, high capacity, respectable damage, mild recoil, and quick rate of fire; its only major drawbacks are the aforementioned low kill award, an outrageous price, and a long reload.

Magazine isn't animated for the same reason as the Steyr AUG and FAMAS. The charging handle on the other hand, moves in thirdperson.

Replaces the Uzi on Twilight Sparkle's ported Global Offensive animations.

FEATURES:
Global Offensive Sounds and Animations
Custom HUD Icon
Skin Support
Another gun that doesn't have the mag animated.

CREDITS
Valve - Model, Textures, Sounds, and Animations
Twilight Sparkle - Animations`,
  last_update: '19 Apr @ 7:20pm',
  file: '~/.cache/a912bdf2e0',
};
