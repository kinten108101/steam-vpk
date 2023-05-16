import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import Panel from 'gi://Panel';
import Gtk from 'gi://Gtk';

import { Profile } from './profile-model';
import { create_new_profile, delete_profile_data, force_profile_self_reload, get_current_profile, get_current_profile_name, register_for_profile_change, remove_profile_from_index, retrieve_profile_list, update_current_profile } from './profile-manager';
import { ActionEntry, StatefulActionEntry, StatelessActionEntry, make_compat_action_entries } from './actions';
import { set_accels_for_local_action } from './application';
import { MainWindow } from './main-window';
import { load_file_content_into_string, write_and_replace_file_async } from './utils';
import { RestoreItemManifest } from './restore-model';
import { register_for_data_reload } from './addon-manager';
import { LoaderItemManifest, LoadingManifest, RestoreManifest } from './addon-model';
import { NewProfileDialog, NewProfileDialogResponse } from './input-dialog';
import { get_loader_item_list } from './addon-manager';
import { id_table_get_steam_id, id_table_get_stvpk_id } from './id-table';
import { get_loading_manifest_path } from './const';
import { Errors, StvpkError } from './errors';

GObject.registerClass({
  GTypeName: 'OmnibarPopover',
  // @ts-ignore
  Template: 'resource:///com/github/kinten108101/SteamVpk/ui/omnibar-popover.ui',
}, class extends Gtk.Popover {});

export class Omnibar extends Panel.OmniBar {
  // @ts-ignore
  private _active_profile_menu!: Gio.Menu = this._active_profile_menu;
  // @ts-ignore
  private parent_window!: MainWindow = this.parent_window;
  // @ts-ignore
  private _bar_label!: Gtk.Label = this._bar_label;

  private _model: Gio.ListStore | undefined = undefined;
  private _last_profile: string | null = null;

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
      }
    }, this);
  }

  constructor(params={}) {
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
    // TODO: typescript linting doesn't work properly with StatelessActionEntry and StatefulActionEntry
    const actionList: ActionEntry[] = [
      this.#getProfileMuxAction(),
      this.#getNewProfileAction(),
      {
        name: 'manage',
        activate: () => {
          return;
        },
      } as StatelessActionEntry,
      {
        name: 'delete-profile',
        activate: async () => {
          //show a warning
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
          if (button !== 1) return;

          // remove from list
          const target = get_current_profile();
          remove_profile_from_index(target);

          // cache cleaning: delete files
          delete_profile_data(target);

          // trigger reload for profile menu
          update_current_profile(target);

          return;
        },
      } as StatelessActionEntry,
      this.#getImportProfileAction(),
      this.#getExportProfileAction(),
    ];

    const prefix = 'profile';
    const actionGroup = new Gio.SimpleActionGroup;
    const entries = make_compat_action_entries(actionList);
    actionGroup.add_action_entries(entries, null);
    this.insert_action_group(prefix, actionGroup);
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
          if (response != Gtk.ResponseType.ACCEPT) return;
          const file = file_diag_.get_file();
          if (!file) return;

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
              }
              else throw error;
            }
            const enabled: boolean = x.enabled;
            out_buffer.list.push({
              steam_id,
              enabled,
            } as RestoreItemManifest);
          });
          write_and_replace_file_async(out_path, JSON.stringify(out_buffer));
        });
        fileDiag.show();
        return;
      },
      change_state: () => { return; }
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
        fileDiag.connect('response', async (file_diag: Gtk.FileChooserNative, response: number)=> {
          if (response !== Gtk.ResponseType.ACCEPT) return;
          const file = file_diag.get_file();
          if (!file) throw new Error('File cannot be parsed by Gio, to be handled by dev later!');
          const stream = load_file_content_into_string(file);
          const restore_list: RestoreItemManifest[] = JSON.parse(stream)['list'];

          const restore_list_processed: {restore_manifest: RestoreItemManifest, id: string}[] = [];

          restore_list.forEach(item => {
            let id: string | undefined = undefined;
            try {
              id = id_table_get_stvpk_id(item.steam_id);
            } catch (error) {
              if (error instanceof StvpkError && error.code === Errors.ADDON_NOT_USED) {
                StvpkError.log(error);
                // download_missing_add_on(id);
              }
              else throw error;
            }
            if (id === undefined) return;
            restore_list_processed.push({restore_manifest: item, id: id});
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

          if (button !== 1) return;
          const load_list: LoaderItemManifest[] = restore_list_processed.map(item => {
            const {restore_manifest, id} = item;
            const {enabled} = restore_manifest;
            return {
              id: id,
              enabled: enabled,
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
      }
    } as StatelessActionEntry;
  }

  #getProfileMuxAction(): StatefulActionEntry {
    let current_action: Gio.SimpleAction | undefined = undefined;
    register_for_data_reload(() => {
      if (current_action === undefined) {
        log('Skipping setting active profile menu radio...');
        return;
      }
      const val = GLib.Variant.new_string(get_current_profile());
      current_action.set_state(val);
    });

    return {
      name: 'set-current',
      activate: (action, param) => {
        action.change_state(param);
      },
      parameter_type: 's',
      startup: () => {
        return '""';
      },
      change_state: (action, param) => {
        current_action = action;
        update_current_profile(param.unpack());
        return;
      },
    } as StatefulActionEntry;
  }

  #getNewProfileAction() {
    return {
      name: 'new-profile',
      activate: async () => {
        // open a window to insert the name of this profile
        const res: NewProfileDialogResponse = await NewProfileDialog.get_content_async(this.parent_window);
        if (res.status === Gtk.ResponseType.CANCEL) return;
        if (res.content === null) {
          throw new StvpkError({
            code: Errors.UNEXPECTED_TYPE,
          });
        }
        const {profile_name, profile_id, use_all_available_addons} = res.content;
        create_new_profile(profile_name, profile_id, use_all_available_addons);
        update_current_profile(profile_id);
        return;
      },
    } as StatelessActionEntry;
  }

  bind_profile_list_model_to_menu() {
    this._model = new Gio.ListStore(Profile.$gtype);

    this._model.connect('items-changed',
      (model: Gio.ListStore, pos: number, removed: number, added: number) => {
        for (let i = removed - 1; i >= 0; i--) {
          this._active_profile_menu.remove(pos + i);
        }
        for (let i = 0; i < added; i++) {
          const profileItem: GObject.Object | null = model.get_item(pos + i);
          if (!(profileItem instanceof Profile)) continue;
          if (profileItem === null) continue;
          const menuItem = new Gio.MenuItem;

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
        msg: 'Model for profile list has not been initialized',
      });
    }
    this._model.remove_all();
    this._model.splice(0,0,items);
  }
}
