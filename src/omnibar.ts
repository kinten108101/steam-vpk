import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import Panel from 'gi://Panel';
import Gtk from 'gi://Gtk';

import { Profile } from './profile-schema.js';
import { create_new_profile, delete_profile_data, force_profile_self_reload, get_current_profile, get_current_profile_name, register_for_profile_change, remove_profile_from_index, retrieve_profile_list, update_current_profile } from './profile-manager.js';
import { ActionEntry, StatefulActionEntry, StatelessActionEntry, makeAction } from './actions.js';
import { set_accels_for_local_action } from './application.js';
import { MainWindow } from './main-window.js';
import { load_file_content_into_string, write_and_replace_file_async } from './utils.js';
import { register_for_data_reload } from './addon-manager.js';
import { LoaderItemManifest, LoadingManifest, RestoreItemManifest, RestoreManifest } from './addon-schema.js';
import { NewProfileDialog, NewProfileDialogResponse } from './input-dialog.js';
import { get_loader_item_list } from './addon-manager.js';
import { id_table_get_steam_id, id_table_get_stvpk_id } from './id-table.js';
import { get_loading_manifest_path } from './const.js';
import { Errors, StvpkError } from './errors.js';

GObject.registerClass({
  GTypeName: 'OmnibarPopover',
  Template: 'resource:///com/github/kinten108101/SteamVpk/ui/omnibar-popover.ui',
}, class extends Gtk.Popover {});

export class Omnibar extends Panel.OmniBar {
  private _active_profile_menu!: Gio.Menu;

  private parent_window!: MainWindow;

  private _bar_label!: Gtk.Label;

  private _model: Gio.ListStore | undefined;

  static {
    GObject.registerClass({
      GTypeName: 'Omnibar',
      Template: 'resource:///com/github/kinten108101/SteamVpk/ui/omnibar.ui',
      Properties: {
        // TODO: when to use $gtype?
        // TODO: MainWindow is not hoisted while bundling
        'parent-window': GObject.ParamSpec.object('parent-window', 'parent-window', 'parent-window', GObject.ParamFlags.READWRITE, GObject.Object.$gtype),
      },
      InternalChildren: [
        'active_profile_menu',
        'bar_label',
      ],
      Signals: {
        'profile-selection-changed': {},
      },
    }, this);
  }

  constructor(params = {}) {
    super(params);
    this.#setupActions();
    this.bind_profile_list_model_to_menu();
    register_for_profile_change(() => {
      const items = retrieve_profile_list();
      this.reload_menu_model(items);
    });
    register_for_data_reload(() => {
      this.#update_profile_label_cb.bind(this._bar_label)();
    });
  }

  #setupActions() {
    const actionList: ActionEntry[] = [
      this.#getNewProfileAction(),
      {
        name: 'delete-profile',
        activate: async () => {
          // TODO: Use AdwMessageDialog
          const warning = new Gtk.AlertDialog({
            buttons: ['Cancel', 'Proceed'],
            cancel_button: 0,
            default_button: 0,
            message: 'Delete this profile?',
            detail: 'Profile-related data will be permanently deleted.',
            modal: true,
          });

          const button: number = await new Promise((resolve, reject) => {
            // @ts-ignore
            warning.choose(this.parent_window, null, (_warning, result) => {
              try {
                resolve(warning.choose_finish(result));
              } catch (e) {
                reject(e);
              }
            });
          });
          if (button !== 1)
            return;

          const target = get_current_profile();
          remove_profile_from_index(target);

          // cache cleaning: delete files
          delete_profile_data(target);

          // trigger reload for profile menu
          update_current_profile(target);
        },
      } as StatelessActionEntry,
      this.#getImportProfileAction(),
      this.#getExportProfileAction(),
    ];

    const prefix = 'profile';
    const actionGroup = new Gio.SimpleActionGroup();
    actionList.forEach(item => {
      const action = makeAction(item);
      actionGroup.add_action(action);
    });

    actionGroup.add_action(this.#getProfileMuxAction());

    const baseWidget: Gtk.Widget = <Gtk.Widget><unknown> this;
    baseWidget.insert_action_group(prefix, actionGroup);
    set_accels_for_local_action(actionList, prefix);
  }

  #update_profile_label_cb(this: Gtk.Label) {
    const label = get_current_profile_name();
    this.set_label(label);
  }

  #getExportProfileAction() {
    return {
      name: 'export',
      activate: () => {
        const fileDiag = new Gtk.FileChooserNative({
          transient_for: this.parent_window,
          title: 'Export add-on list file',
          modal: true,
          action: Gtk.FileChooserAction.SAVE,
        });
        fileDiag.connect('response', (file_diag_: Gtk.FileChooserNative, response: number) => {
          if (response !== Gtk.ResponseType.ACCEPT)
            return;
          const file = file_diag_.get_file();
          if (!file)
            return;

          const out_path = file.get_path();
          if (out_path === null) {
            throw new StvpkError({
              code: Errors.PATH_NOT_EXIST,
            });
          }

          const out_buffer: RestoreManifest = {
            list: [],
          };

          const loader_item_list = get_loader_item_list();

          loader_item_list.forEach(x => {
            let steam_id: string;
            try {
              steam_id = id_table_get_steam_id(x.id);
            } catch (error) {
              if (error instanceof StvpkError && error.code === Errors.ADDON_NOT_DOWNLOADED) {
                StvpkError.log(error);
                return;
              } else {
                throw error;
              }
            }
            const { enabled } = x;
            out_buffer.list.push({
              steam_id,
              enabled,
            } as RestoreItemManifest);
          });
          write_and_replace_file_async(out_path, JSON.stringify(out_buffer));
        });
        fileDiag.show();
      },
    } as StatelessActionEntry;
  }

  #getImportProfileAction() {
    return {
      name: 'import',
      activate: () => {
        const fileDiag = new Gtk.FileChooserNative({
          transient_for: this.parent_window,
          title: 'Select add-on list file',
          modal: true,
          action: Gtk.FileChooserAction.OPEN,
          filter: ((): Gtk.FileFilter => {
            const filter = new Gtk.FileFilter();
            filter.add_pattern('*.txt');
            filter.add_pattern('*.json');
            return filter;
          })(),
        });
        fileDiag.connect('response', async (file_diag: Gtk.FileChooserNative, response: number) => {
          if (response !== Gtk.ResponseType.ACCEPT)
            return;
          const file = file_diag.get_file();
          if (!file) {
            throw new StvpkError({
              code: Errors.UNSPECIFIED,
            });
          }
          const stream = load_file_content_into_string(file);
          const restore_list: RestoreItemManifest[] = JSON.parse(stream)['list'];

          const restore_list_processed: {restore_manifest: RestoreItemManifest, id: string}[] = [];

          restore_list.forEach(item => {
            let id: string | undefined;
            try {
              id = id_table_get_stvpk_id(item.steam_id);
            } catch (error) {
              if (error instanceof StvpkError && error.code === Errors.ADDON_NOT_USED)
                StvpkError.log(error);
              else
                throw error;
            }
            if (id === undefined)
              return;
            restore_list_processed.push({ restore_manifest: item, id });
          });

          const warning = new Gtk.AlertDialog({
            buttons: ['Cancel', 'Proceed'],
            cancel_button: 0,
            default_button: 0,
            message: 'Importing add-ons into your profile?',
            detail: 'These add-ons will rewrite your loading manifest.',
            modal: true,
          });

          const button: number = await new Promise((resolve, reject) => {
            // @ts-ignore
            warning.choose(this.parent_window, null, (_warning, result) => {
              try {
                resolve(warning.choose_finish(result));
              } catch (e) {
                reject(e);
              }
            });
          });

          if (button !== 1)
            return;
          const load_list: LoaderItemManifest[] = restore_list_processed.map(item => {
            const { restore_manifest, id } = item;
            const { enabled } = restore_manifest;
            return {
              id,
              enabled,
              in_randomizer: false,
            } as LoaderItemManifest;
          });

          await write_and_replace_file_async(
            get_loading_manifest_path(get_current_profile()),
            JSON.stringify({
              'addonlist': load_list,
            } as LoadingManifest));
          force_profile_self_reload();
        });
        fileDiag.show();
      },
    } as StatelessActionEntry;
  }

  #getProfileMuxAction(): Gio.SimpleAction {
    let current_action: Gio.SimpleAction | undefined;
    register_for_data_reload(() => {
      if (current_action === undefined) {
        log('Skipping setting active profile menu radio...');
        return;
      }
      const val = GLib.Variant.new_string(get_current_profile());
      current_action.set_state(val);
    });

    const actionEntry: StatefulActionEntry = {
      name: 'set-current',
      activate: (action, param: GLib.Variant) => {
        action.change_state(param);
      },
      parameterType: 's',
      state: '""',
      changeState: (action, param: GLib.Variant) => {
        current_action = <Gio.SimpleAction> action;
        const newval = param.unpack();
        if (typeof newval !== 'string') {
          log('Oh no!');
          throw new StvpkError({
            code: Errors.UNEXPECTED_TYPE,
            message: `Wrong GVariant value type received at profile.set-current. Expected string, but got ${typeof newval}`,
          });
        }
        update_current_profile(newval);
      },
    };
    current_action = makeAction(actionEntry);
    return current_action;
  }

  #getNewProfileAction() {
    return {
      name: 'new-profile',
      activate: async () => {
        // open a window to insert the name of this profile
        const res: NewProfileDialogResponse = await NewProfileDialog.get_content_async(this.parent_window);
        if (res.status === Gtk.ResponseType.CANCEL)
          return;
        if (res.content === null) {
          throw new StvpkError({
            code: Errors.UNEXPECTED_TYPE,
          });
        }
        const { profile_name, profile_id, use_all_available_addons } = res.content;
        create_new_profile(profile_name, profile_id, use_all_available_addons);
        update_current_profile(profile_id);
      },
    } as StatelessActionEntry;
  }

  bind_profile_list_model_to_menu() {
    this._model = new Gio.ListStore(Profile.$gtype);

    this._model.connect('items-changed',
      (model: Gio.ListStore, pos: number, removed: number, added: number) => {
        for (let i = removed - 1; i >= 0; i--)
          this._active_profile_menu.remove(pos + i);
        for (let i = 0; i < added; i++) {
          const profileItem: GObject.Object | null = model.get_item(pos + i);
          if (!(profileItem instanceof Profile))
            continue;
          if (profileItem === null)
            continue;
          const menuItem = new Gio.MenuItem();

          // TODO: This does not work: menuItem.bind_property('label', profileItem, 'name', GObject.BindingFlags.BIDIRECTIONAL | GObject.BindingFlags.SYNC_CREATE);
          menuItem.set_label(profileItem.name);
          // TODO: is it OK to have floating GVariant reference?
          menuItem.set_action_and_target_value(
            'profile.set-current',
            new GLib.Variant('s', profileItem.id));
          this._active_profile_menu.insert_item(pos + i, menuItem);
        }
      });
  }

  reload_menu_model(items: Profile[]) {
    if (this._model === undefined) {
      throw new StvpkError({
        code: Errors.DEPENDENCY_UNINITIALIZED,
        message: 'Model for profile list has not been initialized',
      });
    }
    this._model.remove_all();
    this._model.splice(0, 0, items);
  }
}
