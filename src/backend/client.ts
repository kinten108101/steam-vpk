import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import { get_formatted_unique_name_str } from '../steam-vpk-utils/portals.js';
import { BackendPortal, BackendServices } from './api.js';

export const SERVER_NAME = 'com.github.kinten108101.SteamVPK.Server';
export const SERVER_PATH = '/com/github/kinten108101/SteamVPK/Server';

export default interface AddonBoxClient extends GObject.Object {
  connect(signal: 'notify::connected', callback: ($obj: this) => void): number;
  connect(signal: 'notify', callback: ($obj: this, spec: GObject.ParamSpec) => void): number;
  services: {
    injector: BackendServices;
    injections: (id: string) => BackendServices;
    addons: BackendServices;
    workshop: BackendServices;
    settings: BackendServices;
    disk: BackendServices;
  };
}
export default class AddonBoxClient extends GObject.Object {
  static {
    GObject.registerClass({
      Properties: {
        connected: GObject.ParamSpec.boolean(
          'connected', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          false),
      }
    }, this);
  }

  connected!: boolean;
  services = {
    injector: BackendPortal({
      interface_name: 'com.github.kinten108101.SteamVPK.Server.Injector',
      obj_path: '/com/github/kinten108101/SteamVPK/Server/injector',
    }),
    injections(id: string) {
      return BackendPortal({
        interface_name: 'com.github.kinten108101.SteamVPK.Server.Injection',
        obj_path: `/com/github/kinten108101/SteamVPK/Server/injections/${get_formatted_unique_name_str(id)}`,
      });
    },
    addons: BackendPortal({
      interface_name: 'com.github.kinten108101.SteamVPK.Server.Addons',
      obj_path: '/com/github/kinten108101/SteamVPK/Server/addons',
    }),
    workshop: BackendPortal({
      interface_name: 'com.github.kinten108101.SteamVPK.Server.Workshop',
      obj_path: '/com/github/kinten108101/SteamVPK/Server/workshop',
    }),
    settings: BackendPortal({
      interface_name: 'com.github.kinten108101.SteamVPK.Server.Settings',
      obj_path: '/com/github/kinten108101/SteamVPK/Server/settings',
    }),
    disk: BackendPortal({
      interface_name: 'com.github.kinten108101.SteamVPK.Server.Disk',
      obj_path: '/com/github/kinten108101/SteamVPK/Server/disk',
    }),
  }

  constructor(params = {}) {
    super(params);
    this._setup_monitor();
  }

  _setup_monitor() {
    this.connect('notify::connected', () => {
      if (this.connected) {
        console.debug('Connected!');
      } else {
        console.debug('Disconnected!');
      }
    });
    Gio.bus_watch_name(
      Gio.BusType.SESSION,
      SERVER_NAME,
      Gio.BusNameWatcherFlags.NONE,
      () => {
        this.connected = true;
      },
      () => {
        this.connected = false;
      });
  }

  async start() {
    if (await this.bus_exists()) {
      this.connected = true;
    } else {
      this.connected = false;
    }
  }

  async bus_exists(): Promise<boolean> {
    try {
    // @ts-ignore
      const reply = await Gio.DBus.session.call(
        SERVER_NAME,
        SERVER_PATH,
        'org.freedesktop.DBus.Peer',
        'Ping',
        null,
        null,
        Gio.DBusCallFlags.NONE,
        -1,
        null);
      if (reply !== undefined) return true;
      return false;
    } catch (error) {
      return false;
    }
  }
}
