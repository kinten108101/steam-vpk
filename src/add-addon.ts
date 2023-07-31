import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Soup from 'gi://Soup';

import * as Gio1 from './utils/gio1.js';
import * as Gtk1 from './utils/gtk1.js';
import * as Adw1 from './utils/adw1.js';
import * as GLib1 from './utils/glib1.js';
import * as Utils from './utils.js';
import { gobjectClass } from './utils/decorator.js';
import { Result, Results } from './utils/result.js';

import { Config } from './config.js';
import Window from './window.js';
import Downloader from './downloader.js';
import { generateAddonName, generateAuthor, generateName } from './id.js';
import { AddonManifest } from './addons.js';
import { AddonStorage, AddonStorageError, addon_storage_error_quark } from './addon-storage.js';
import { ActionOrder } from './addon-action.js';
import { Stvpk as Application } from './application.js';
import { AddAddonPreviewDownload, AddAddonWindow, AddAddonWizard } from './add-addon-window.js';
import { Archiver } from './archive.js';

/** @deprecated */
@gobjectClass({
  GTypeName: 'StvpkAddAddon',
})
export class AddAddon extends GObject.Object {
  application: Application;
  mainWindow: Window;
  downloader: Downloader;
  archiver: Archiver;

  constructor(param: {
    application: Application;
    window: Window;
    archiver: Archiver;
  }) {
    super({});
    this.application = param.application;
    this.mainWindow = param.window;
    this.downloader = param.application.downloader;
    this.archiver = param.archiver;
    this.setupActions();
  }

  setupActions() {
    const addName = Gio1.SimpleAction
      .builder({ name: 'add-addon.add-name' })
      .activate(this.onAddNameActivate)
      .build();
    this.mainWindow.add_action(addName);

    const addUrl = Gio1.SimpleAction
      .builder({ name: 'add-addon.add-url' })
      .activate(this.onAddUrlActivate)
      .build();
    this.mainWindow.add_action(addUrl);

    const addArchive = Gio1.SimpleAction
      .builder({ name: 'add-addon.add-archive' })
      .activate(async () => {
        const dialog = Gtk1.FileDialog.builder()
          .title('Select an Add-on Archive')
          .filter(Gtk1.FileFilter.builder().suffix('vpk').build())
          .wrap()
          .build()
        const openResult = await dialog.open_async(this.mainWindow, null);
        if (openResult.code !== Results.OK) {
          const error = openResult.data;
          if (error.matches(Gtk.dialog_error_quark(), Gtk.DialogError.DISMISSED))
            return;
          console.warn(String(error));
          return;
        }
      })
      .build();
    this.mainWindow.add_action(addArchive);
  }

  onAddNameActivate = async () => {
    const addAddonWindow = new AddAddonWindow({
      transient_for: this.mainWindow,
    });
    const wizard = new AddAddonWizard();

    wizard.addPage(async (): Promise<[Symbol]> => {
      const namePage = addAddonWindow.namePage;
      const namePresent = await namePage.present();
      if (namePresent.code !== Results.OK) {
        const error = namePresent.data;
        if (error.matches(Gtk.dialog_error_quark(), Gtk.DialogError.DISMISSED)) {
          return [wizard.navigation.QUIT];
        }
        console.warn(error);
        return [wizard.navigation.RETRY];
      }

      const [id] = namePresent.data;

      const requested_subdir = this.application.addonStorage.subdirFolder.get_child(id);
      var file_type = requested_subdir.query_file_type(Gio.FileQueryInfoFlags.NONE, null)
      if (file_type !== Gio.FileType.DIRECTORY) {
        console.debug('Not a subdirectory');
        namePage.showErrorMsg('Not a subdirectory');
        return [wizard.navigation.RETRY];
      }

      const info = requested_subdir.get_child(Config.config.addon_info);
      var file_type = info.query_file_type(Gio.FileQueryInfoFlags.NONE, null);
      if (file_type !== Gio.FileType.REGULAR) {
        console.debug('Not a subdirectory');
        namePage.showErrorMsg('Subdirectory has no manifest file');
        return [wizard.navigation.RETRY];
      }

      // TODO(kinten): Make this async so that we can do some post procedures (include in profile)
      this.application.addonStorage.indexer.add_entry(id);
      addAddonWindow.close();
      return [wizard.navigation.QUIT];
    })
    wizard.run();
  }

  onAddUrlActivate = async () => {
    const addAddonWindow = new AddAddonWindow({
      transient_for: this.mainWindow,
    });
    const wizard = new AddAddonWizard();

    let sharedFileDetails: any | undefined;
    let sharedCreatorDetails: any | undefined;
    let sharedFieldCache: AddAddonPreviewDownload.CacheInfo | undefined;

    // @ts-ignore
    wizard.addPage(async (): Promise<[Symbol]> => {
      const urlPage = addAddonWindow.url;
      const urlPresent = await urlPage.present();

      const showErrorMsg = (msg: string) => {
        urlPage.errorSource.url.errorMsg = msg;
        urlPage.inputSource.url.setValid(false);
      };

      if (urlPresent.code !== Results.OK) {
        const error = urlPresent.data;
        if (error.matches(Gtk.dialog_error_quark(), Gtk.DialogError.DISMISSED)) {
          return [wizard.navigation.QUIT];
        }
        console.error(String(error));
        return [wizard.navigation.RETRY];
      }

      const [url] = urlPresent.data;
      const idxParam = url.indexOf('?id=', 0);
      if (idxParam === undefined) {
        console.debug('Could not find ID parameter in URL');
        showErrorMsg('Incorrect Workshop Item URL');
        return [wizard.navigation.RETRY];
      }
      // FIXME(kinten):
      // Apparently some id can be length 9 instead of 10.
      // Need more robust extraction method
      const fileId = url.substring(idxParam + 4, idxParam + 14);
      if (!Utils.isNumberString(fileId)) {
        console.debug('Supposed ID part is not all numbers');
        showErrorMsg('Incorrect Workshop Item URL');
        return [wizard.navigation.RETRY];
      }
      console.debug(fileId);

      const parseUri = GLib1.Uri.parse('https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/', GLib.UriFlags.NONE);
      if (parseUri.code !== Results.OK) {
        console.debug('API method no longer valid');
        showErrorMsg('Internal Error');
        return [wizard.navigation.RETRY];
      }

      const uri = parseUri.data;
      const getDetails = new Soup.Message({
        method: 'POST',
        uri,
      });
      const requestBody = new GLib.Bytes(Utils.Encoder.encode(`itemcount=1&publishedfileids%5B0%5D=${fileId}`));
      getDetails.set_request_body_from_bytes(
        'application/x-www-form-urlencoded',
        requestBody,
      );

      const readGbytes = await this.downloader.session.send_and_read_async(getDetails, GLib.PRIORITY_DEFAULT, null);
      if (readGbytes.code !== Results.OK) {
        const error = readGbytes.data;
        if (error.matches(Gio.resolver_error_quark(), Gio.ResolverError.TEMPORARY_FAILURE)) {
          console.debug('Couldn\'t resolve IP');
          showErrorMsg('Incorrect Workshop Item URL');
          return [wizard.navigation.RETRY];
        }
        console.error(error);
        return [wizard.navigation.RETRY];
      }

      const bytes = readGbytes.data.get_data();
      if (getDetails.status_code !== Soup.Status.OK || bytes == null) {
        console.debug('Not OK response');
        showErrorMsg('Incorrect Workshop Item URL');
        return [wizard.navigation.RETRY];
      }

      const readjson = Utils.readJSONBytesResult(bytes);
      if (readjson.code !== Results.OK) {
        const error = readjson.data;
        console.debug(error);
        showErrorMsg('Incorrect Workshop Item URL');
        return [wizard.navigation.RETRY];
      }

      const response = readjson.data;
      const fileDetails = response['response']?.['publishedfiledetails']?.[0];
      if (typeof fileDetails === undefined) {
        console.debug('Wrong object structure');
        showErrorMsg('Incorrect Workshop Item URL');
        return [wizard.navigation.RETRY];
      }

      sharedFileDetails = fileDetails;

      const appid = fileDetails['consumer_app_id'];
      if (appid !== 550) {
        console.debug('Only L4D2 add-ons are allowed');
        showErrorMsg('Only L4D2 add-ons are allowed');
        return [wizard.navigation.RETRY];
      }

      const addonName = generateAddonName(fileDetails['title']) || '';
      const creator = fileDetails['creator'];

      let playerDetails: any;
      {
        const webapi = Config.config.oauth;
        const uriParse = GLib1.Uri.parse(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?access_token=${webapi}&steamids=${creator}&key=`, GLib.UriFlags.NONE);
        if (uriParse.code !== Results.OK) {
          console.debug('Bad URL');
          showErrorMsg('Programming Error');
          return [wizard.navigation.RETRY];
        }

        const uri = uriParse.data;
        const getDetails = new Soup.Message({
          method: 'GET',
          uri,
        });

        const creatorRequestResult = await this.downloader.session.send_and_read_async(getDetails, GLib.PRIORITY_DEFAULT, null);
        if (creatorRequestResult.code !== Results.OK) {
          console.debug('Request error')
          showErrorMsg('Bad Connection');
          return [wizard.navigation.RETRY];
        }

        const bytes = creatorRequestResult.data.get_data();
        if (getDetails.status_code !== Soup.Status.OK || bytes == null) {
          console.debug('Not OK response');
          showErrorMsg('Incorrect Workshop Item URL');
          return [wizard.navigation.RETRY];
        }

        const readjson = Utils.readJSONBytesResult(bytes);
        if (readjson.code !== Results.OK) {
          const error = readjson.data;
          console.debug(error);
          showErrorMsg('Incorrect Workshop Item URL');
          return [wizard.navigation.RETRY];
        }

        const response = readjson.data;
        playerDetails = response['response']?.['players']?.[0];
        if (typeof playerDetails === undefined) {
          console.debug('Wrong object structure');
          showErrorMsg('Incorrect Workshop Item URL');
          return [wizard.navigation.RETRY];
        }

        sharedCreatorDetails = playerDetails;
      }

      const getCreatorPart = ((): Result<string, [symbol]> => {
        const personaname = playerDetails['personaname'];
        if (!(typeof personaname !== 'string' || personaname === ''))
          return Result.compose.OK(generateAuthor(personaname));

        const profileurl = playerDetails['profileurl'];
        const idIdx = profileurl.indexOf('/id/');
        const vanityId = profileurl.substring(idIdx + 4, profileurl.length - 1);
        if (!(idIdx === -1 || Utils.isNumberString(vanityId))) // not vanityid found
          return Result.compose.OK(generateAuthor(vanityId));

        const realname = playerDetails['realname'];
        if (!(typeof realname !== 'string' || realname === ''))
          return Result.compose.OK(generateAuthor(realname));

        return Result.compose.NotOK([wizard.navigation.RETRY] as [symbol]);
      })();

      if (getCreatorPart.code !== Results.OK) {
        const decision = getCreatorPart.data;
        return decision;
      }

      const creatorPart = getCreatorPart.data;
      console.debug(`Creator part: ${creatorPart}`);
      const addonId = `${generateName(addonName)}@${creatorPart}`;

      sharedFieldCache = {
        addonName,
        addonId,
      };
      return [wizard.navigation.NEXT];
    });
    wizard.addPage(async (): Promise<[Symbol]> => {
      if (sharedFieldCache === undefined || sharedCreatorDetails === undefined || sharedFileDetails === undefined) {
        console.error('Info was not filled!');
        return [wizard.navigation.BACK];
      }
      const infoPresent = await addAddonWindow.previewDownload.present(sharedFieldCache);
      if (infoPresent.code !== Results.OK) {
        const error = infoPresent.data;
        if (error.matches(Gtk.dialog_error_quark(), Gtk.DialogError.DISMISSED))
          return [wizard.navigation.QUIT];
        else if (error.matches(Gtk1.dialog_error_ext_quark(), Gtk1.DialogErrorExt.BACK))
          return [wizard.navigation.BACK];
        console.error(String(error));
        return [wizard.navigation.QUIT];
      }

      const [addonName, addonId, includeInProfile] = infoPresent.data;

      const manifest = AddonManifest.new_from_published_file_details({
        ...sharedFileDetails,
        title: addonName,
      }, addonId);

      const order = ActionOrder.compose.Create(manifest);
      const createAddon = await order.process(this.application.addonSynthesizer);
      if (createAddon.code !== Results.OK) {
        const error = createAddon.data;
        if (error.matches(addon_storage_error_quark(), AddonStorageError.ADDON_EXISTS)) {
          console.debug('Add-on already exists');
          Adw1.Toast.builder()
            .title('Add-on already exists')
            .wrap().build().present(addAddonWindow);
          return [wizard.navigation.RETRY];
        }
        console.error(error);
        return [wizard.navigation.RETRY];
      }

      if (includeInProfile) {
        const result = (() => {
          this.application.addonStorage.loadorder_push(addonId)
          return null;
        })();
        if (typeof result === 'symbol') return [result];
      }

      addAddonWindow.close();
      // Request a download
      const addon = this.application.addonStorage.idmap.get(addonId);
      if (addon === undefined) {
        console.warn('Could not find addon after creation.');
        return [wizard.navigation.QUIT];
      }
      this.archiver.retrieve_steam_archive(addon);
      return [wizard.navigation.QUIT];
    });
    wizard.run();
  }
}

export default function AddAddonActions({
  action_map,
  addon_storage,
}:
{
  action_map: Gio.ActionMap;
  addon_storage: AddonStorage;
}) {
  // TODO(kinten): Use maybe type
  const separator = new Gio.SimpleAction({ name: 'add-addon.separator', parameter_type: GLib.VariantType.new('i') });
  separator.connect('activate', (_action, parameter) => {
    let gui = false;
    const position = Utils.g_variant_unpack<number>(parameter, 'number');
    if (position < 0) gui = true;

    if (gui) {
      addon_storage;
    }

    addon_storage

  });
  action_map.add_action(separator);
}
