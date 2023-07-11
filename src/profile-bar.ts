import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Panel from 'gi://Panel';
import Adw from 'gi://Adw';

import * as Adw1 from './utils/adw1.js';
import * as Gio1 from './utils/gio1.js';
import * as Gtk1 from './utils/gtk1.js';
import { Errors, FlatError } from './utils/errors.js';
import { gobjectClass } from './utils/decorator.js';
import { Results } from './utils/result.js';
import * as Utils from './utils.js';
import * as JSON1 from './utils/json1.js';

import { Config } from './config.js';
import { MainWindowContext } from './window.js';
import { CreateProfileDialog } from './create-profile.js';
import { LateBindee } from './mvc.js';
import { SessionData } from './session-data.js';

export class ProfileBarPopover extends Gtk.Popover implements LateBindee<MainWindowContext> {
  static {
    // TODO(kinten): What happens when second parameter of registerClass is empty?
    GObject.registerClass({
      GTypeName: 'StvpkProfileBarPopover',
      Template: `resource://${Config.config.app_rdnn}/ui/profile-bar-popover.ui`,
      Children: [
        'profileName',
        'profileId',
        'addonCount',
      ],
    }, this);
  }

  profileName!: Gtk.Label;

  profileId!: Gtk.Label;

  addonCount!: Gtk.Label;

  onBind(context: MainWindowContext) {
    context.main_window.session.connect('notify::current-profile', (session: SessionData) => {
      this.profileName.set_label(session.currentProfile.name);
      this.profileId.set_label(session.currentProfile.id);
      this.addonCount.set_label(String(session.currentProfile.whitelist?.size || 0));
    });
    // TODO(kinten): is binding strong ref or weak ref? Is it on the obj or on the pointer?
    /*
    context.addonManager.registerForDataReload(() => {
      const profile = context.profileManager.getCurrentProfile();
      const count = context.addonManager.getAddonFilterList().length;
      this.profileName.set_label(profile.name);
      this.profileId.set_label(profile.id);
      this.addonCount.set_label(count.toString());
    });
    */
  }
}

@gobjectClass()
class ProfileMuxItem extends GObject.Object {
  name: string;
  id: string;

  constructor(params: {
    name: string;
    id: string;
  }) {
    const { name, id, ..._params } = params;
    super(_params);
    this.name = name;
    this.id = id;
  }
}

export class ProfileMux implements LateBindee<MainWindowContext> {
  menu: Gio.Menu;
  model: Gio.ListStore<ProfileMuxItem>;

  constructor(params: {
    menu: Gio.Menu;
  }) {
    // represent the menu with a list model.
    // as to why a list model from the API, because
    // it has the convenient signal items-changed
    // which is used for every model-manipulation op.
    // only downside is that list model only accepts
    // one data type, so we must define an item class.
    // also, it must be a gobject.
    this.menu = params.menu;
    this.model = new Gio.ListStore({ item_type: ProfileMuxItem.$gtype })
    this.model.connect('items-changed',
      (_, pos: number, removed: number, added: number) => {
        for (let i = removed - 1; i >= 0; i--) {
          this.menu.remove(pos + i);
        }
        for (let i = 0; i < added; i++) {
          const profileItem = this.model.get_item(pos + i) as ProfileMuxItem | null;
          if (profileItem === null) {
            continue;
          }
          const menuItem = new Gio.MenuItem();
          menuItem.set_label(profileItem.name);
          // TODO: is it OK to have floating GVariant reference?
          menuItem.set_action_and_target_value(
            'profile.set-current',
            new GLib.Variant('s', profileItem.id));
          this.menu.insert_item(pos + i, menuItem);
        }
      });
  }

  onBind() {
    /*
    context.profileManager.registerForProfileChange((profileManager: ProfileManager) => {
      const items = profileManager.getProfileList();
      this.reload_menu_model(items);
    });
    */
  }

  reload_menu_model() {

  }
}

@gobjectClass({
  GTypeName: 'StvpkProfileBar',
  Template: `resource://${Config.config.app_rdnn}/ui/profile-bar.ui`,
  Children: [
    'label',
    'profilePopover',
  ],
  Implements: [
    Gio.ActionMap,
  ],
})
export class ProfileBar extends Panel.OmniBar
implements LateBindee<MainWindowContext> {
  mux: ProfileMux;
  label!: Gtk.Label;
  activeProfileMenu!: Gio.Menu;
  profilePopover!: ProfileBarPopover;

  actionGroup: Gio.SimpleActionGroup;

  context!: MainWindowContext;

  constructor(param = {}) {
    super(param);
    this.actionGroup = new Gio.SimpleActionGroup();
    this.mux = new ProfileMux({
      menu: this.activeProfileMenu,
    });
  }

  onBind = (context: MainWindowContext) => {
    this.context = context;
    context.main_window.insert_action_group('profile', this.actionGroup);
    this.setupProfileActions();
    this.bindLabel();
  }

  bindLabel() {
    this.context.main_window.session.connect('notify::current-profile', (session: SessionData) => {
      this.label.set_label(session.currentProfile.name);
    })
  }

  setupProfileActions = () => {
    const deleteProfile = Gio1.SimpleAction
      .builder({ name: 'delete-profile' })
      .activate(this.onDeleteProfileActivate)
      .build();
    this.actionGroup.add_action(deleteProfile);

    const importAddonlist = Gio1.SimpleAction
      .builder({ name: 'import' })
      .activate(this.onImportAddonlistActivate)
      .build();
    this.actionGroup.add_action(importAddonlist);

    const exportAddonlist = Gio1.SimpleAction
      .builder({ name: 'export' })
      .activate(this.onExportAddonlistActivate)
      .build();
    this.actionGroup.add_action(exportAddonlist);

    const newProfile = Gio1.SimpleAction
      .builder({ name: 'new-profile' })
      .activate(this.onNewProfileActivate)
      .build();
    this.actionGroup.add_action(newProfile);

    this.setupProfileMux();
  }

  setupProfileMux = () => {
    const store = this.context.main_window.session;
    let lastval: GLib.Variant = new GLib.Variant('s', '');
    const profileMux = Gio1.SimpleAction
      .builder({
        name: 'profile.set-current',
        parameterType: new GLib.VariantType('s'),
        state: lastval,
      })
      .activate((_, newval) => {
        if (newval == null)
          throw new FlatError({
            code: Errors.UNEXPECTED_TYPE,
            message: `Wrong param type received at ${profileMux.name}.
              Expected GVariant, but got null`,
          });
        if (newval !== lastval)
          profileMux.change_state(newval);
      })
      .changeState((_, param: GLib.Variant | null) => {
        if (param == null)
          throw new FlatError({
            code: Errors.UNEXPECTED_TYPE,
            message: `Wrong param type received at ${profileMux.name}.
              Expected GVariant, but got null`,
          });
        const newval = param.unpack();
        if (typeof newval !== 'string')
          throw new FlatError({
            code: Errors.UNEXPECTED_TYPE,
            message: `Wrong GVariant type received at ${profileMux.name}.
              Expected string, but got ${typeof newval}`,
          });
        store.manualUpdateCurrentProfileWithId(newval);
      })
      .build();
    store.connect('notify::current-profile', () => {
      const newval: string = store.currentProfile.id;
      profileMux.set_state(GLib.Variant.new_string(newval));
    });
    this.actionGroup.add_action(profileMux);
  }

  onImportAddonlistActivate = async () => {
    const main_window = this.context.main_window;
    const fileDialog = Gtk1.FileDialog.builder()
      .title('Select add-on list file')
      .filter(
        Gtk1.FileFilter.builder()
          .mimeType('application/json')
          .build()
      )
      .filter(
        Gtk1.FileFilter.builder()
          .mimeType('application/xml')
          .build()
      )
      .filter(
        Gtk1.FileFilter.builder()
          .mimeType('application/x-yaml')
          .build()
      )
      .acceptLabel('Select')
      .wrap()
      .build();

    const openResult = await fileDialog.open_async(
      main_window, null);
    if (openResult.code !== Results.OK) {
      const error = openResult.data;
      if (error.matches(Gtk.dialog_error_quark(), Gtk.DialogError.DISMISSED))
        return;
      console.debug(error.toString());
      return;
    }
    const file = openResult.data;

    const info = await file.query_info_async(
      'standard::*',
      Gio.FileQueryInfoFlags.NONE,
      GLib.PRIORITY_DEFAULT, null);
    if (info === null)
      throw new FlatError({
        code: Errors.API,
      });

    const content_type = info.get_content_type();
    if (content_type === null) {
      Adw1.Toast.builder()
        .title('Other file formats are work-in-progress')
        .wrap()
        .build()
        .present(main_window);
      return;
    }
    if (content_type !== 'application/json') {
      Adw1.Toast.builder()
        .title('Other file formats are work-in-progress')
        .wrap()
        .build()
        .present(main_window)
      return;
    }

    const loadAttempt = Utils.loadContentsR(file, null);
    if (loadAttempt.code !== Results.OK) {
      Adw1.Toast.builder()
        .title('File does not exists')
        .wrap().build()
        .present(main_window);
      return;
    }

    const [, bytes ] = loadAttempt.data;
    const decodeResult = Utils.Decoder.decode(bytes);
    if (decodeResult.code !== Results.OK) {
      Adw1.Toast.builder()
        .title('Expected UTF-8, got unknown encoding')
        .wrap()
        .build()
        .present(main_window);
      return;
    }

    const str = decodeResult.data;
    const parseResult = JSON1.parse(str);
    if (parseResult.code !== Results.OK) {
      Adw1.Toast.builder()
        .title('Incorrect JSON syntax')
        .wrap()
        .build()
        .present(main_window);
      return;
    }

    const manifest = parseResult.data;
    console.debug(String(manifest));

    /*
    const _rawList: unknown = Utils.parseJsonFile(file);
    const { code, data: rawList } = RecoveryList.validate(_rawList);
    if (code !== Results.OK || rawList === undefined) {
      throw new FlatError({
        code: Errors.FILE_MALFORMED,
        message: 'Imported file is corrupted!',
      });
    }

    const recoveryList: RecoveryManifest[] = RecoveryList
      .getManifestCollection(rawList);

    const recoveryListUsable: RecoveryManifest[] = [];
    const stvpkIdList: string[] = [];

    recoveryList.forEach(item => {
      let id: string | undefined;
      try {
        id = IdTable.getStvpkId(item.steamId);
      } catch (error) {
        if (error instanceof FlatError &&
        error.code === Errors.ADDON_NOT_USED) {
          FlatError.log(error);
        } else {
          throw error;
        }
      }
      if (id === undefined) {
        return;
      }
      recoveryListUsable.push(item);
      stvpkIdList.push(id);
    });
    */

    const warning = Adw1.MessageDialog.builder()
      .heading('Import these add-ons?')
      .body('These add-ons will permanently rewrite your profile.')
      .response({ id: 'import::cancel', label: 'Cancel' })
      .response({ id: 'import::proceed', label: 'Proceed' })
      .closeResponse('import::cancel')
      .defaultResponse('import::cancel')
      .transientFor(main_window)
      .wrap()
      .build();
    warning.unwrap().set_response_appearance('import::proceed', Adw.ResponseAppearance.SUGGESTED);
    const chooseResult = await warning.choose_async(null);
    if (chooseResult.code !== Results.OK) {
      console.error('Unhandled MessageDialog error!');
      return;
    }
    const button = chooseResult.data;

    if (button !== 'import::proceed') {
      console.debug('Did not click yes!');
      return;
    }

    /*

    const filterManifestList: FilterManifest[] = recoveryListUsable.map(
      (x, i) => {
        const id = stvpkIdList[i];
        if (id === undefined) {
          throw new FlatError({
            code: Errors.UNEXPECTED_TYPE,
            message: 'Length of two arrays do not match',
          });
        }
        return recoveryManifest2FilterManifest(x, id);
      },
    );

    const filterList: FilterList = FilterList.build(filterManifestList);
    // TODO: context's store to store these list files
    {
      const currentProfile = this.context.profileManager
        .getCurrentProfileId();
      const file = this.context.store.profileDir
        .get_child(currentProfile).get_child(Config.FILTER_LIST_FILE);
      const stringBuffer = Utils.Encoder.encode(
        JSON.stringify(filterList));
      Utils.writeAndReplaceFile(
        file,
        stringBuffer,
      );
    }
    this.forceCompleteReload();
    */
  }

  onExportAddonlistActivate = async () => {
    const parentWindow = this.context.main_window;

    const fileDiag = Gtk1.FileDialog
      .builder()
      .title('Export add-on list file')
      .acceptLabel('Save')
      .filter(
        Gtk1.FileFilter.builder()
          .pattern('*').build()
      )
      .wrap()
      .build();

    const saveResult = await fileDiag.save_async(parentWindow, null);
    if (saveResult.code !== Results.OK) {
      const error = saveResult.data;
      if (error.matches(Gtk.dialog_error_quark(), Gtk.DialogError.DISMISSED))
        return;
      console.debug(error.toString());
      return;
    }
    const exportFile = saveResult.data;

    if (exportFile === null) {
      throw new FlatError({
        code: Errors.FILE_NOT_EXIST,
      });
    }

    /*

    const exportBuffer: RecoveryManifest[] = [];

    const filterList = this.context.addonManager.getAddonFilterList();
    filterList.forEach(x => {
      const { id, enabled } = x;
      let steamId: string;
      // TODO: not-downloaded addons should not be exceptions!!
      try {
        steamId = IdTable.getSteamId(id);
      } catch (error) {
        if (error instanceof FlatError && error.code === Errors.ADDON_NOT_DOWNLOADED) {
          FlatError.log(error);
          return;
        } else {
          // @ts-ignore
          logError(error);
          throw error;
        }
      }
      exportBuffer.push({
        steamId,
        enabled,
      } as RecoveryManifest);
    });

    const exportList = RecoveryList.build(exportBuffer);
    const exportContents = Utils.Encoder.encode(JSON.stringify(exportList));
    // replace this. We can reuse Gio.File bro
    try {
      Utils.writeAndReplaceFile(exportFile, exportContents);
    } catch (error) {
      // @ts-ignore
      logError(error);
    }
    */
  }

  onDeleteProfileActivate = async () => {
    const warning = Adw1.MessageDialog.builder()
      .heading('Delete this profile?')
      .body('All profile data will be permanently deleted.')
      .response({ id: 'delete::cancel', label: 'Cancel' })
      .response({ id: 'delete::proceed', label: 'Proceed' })
      .defaultResponse('delete::cancel')
      .closeResponse('delete::cancel')
      .transientFor(this.context.main_window)
      .wrap()
      .build();
    warning.unwrap().set_response_appearance('delete::proceed', Adw.ResponseAppearance.DESTRUCTIVE);
    const chooseResult = await warning.choose_async(null);
    if (chooseResult.code !== Results.OK) {
      const error = chooseResult.data;
      if (error.matches(Gtk.dialog_error_quark(), Gtk.DialogError.DISMISSED)) {
        return;
      }
      console.warn(error.toString());
      return;
    }
    const button = chooseResult.data;
    if (button !== 'delete::proceed') {
      return;
    }

    /*
    const target: string = this.context.profileManager.getCurrentProfileId();
    this.removeProfileFromIndex(target);
    this.deleteProfileData(target);
    this.updateCurrentProfile(target);
    */
  }

  onNewProfileActivate = async () => {
    const dialog = new CreateProfileDialog();
    const fillResult = await dialog.fill(this.context.main_window);
    if (fillResult.code !== Results.OK) {
      const error = fillResult.data;
      if (error.matches(Gtk.dialog_error_quark(), Gtk.DialogError.DISMISSED))
        return;
      console.warn(error.toString());
      return;
    }
    /*
    const [profileId, profileName, useAll] = fillResult.data;

    const profileSubdir: Gio.File = this.context.store.profileDir.get_child(id);
    Utils.createDirectory(profileSubdir);
    const profileManifest: ProfileManifest = {
      name,
      id,
    };
    const profileManifestFile = profileSubdir.get_child(Config.PROFILE_MANIFEST);
    Utils.createFile(
      profileManifestFile,
      Utils.Encoder.encode(JSON.stringify(profileManifest)),
    );
    let filterlist = FilterList.build(null);
    console.info(String(useAllAvailableAddons));
    const filterlistFile: Gio.File = profileSubdir.get_child(Config.FILTER_LIST_FILE);
    const profileAddonListStrBuffer = JSON.stringify(filterlist);
    console.info(`final filter list: ${profileAddonListStrBuffer}`)
    Utils.createFile(
      filterlistFile,
      Utils.Encoder.encode(profileAddonListStrBuffer),
    );
    this.context.profileManager.appendToProfileManager(new Profile({
      ...profileManifest,
    }));
    this.saveProfileManagerToIndexFile();
    this.updateCurrentProfile(profileId);
    */
  }
}
