#!@GJS@ -m

// @ts-expect-error
import { setConsoleLogDomain } from "console";
import GLib from 'gi://GLib';

/**
 * @type {{
 *   name: string,
 *   version: string,
 *   prefix: string,
 *   libdir: string,
 *   buildtype:  'plain' | 'debug' | 'debugoptimized' | 'release' | 'minsize' | 'custom',
 *   flatpak: string,
 *   toString(): string,
 * } & { [key:string]: any }}
 */
globalThis.config = {
  name: '@APP_ID@',
  version: '@VERSION@',
  prefix: '@PREFIX@',
  libdir: '@LIBDIR@',
  // @ts-expect-error
  buildtype: '@BUILDTYPE@',
  // @ts-expect-error
  flatpak: '@FLATPAK@' === 'True',
  toString() {
    let str = '';
    let first = true;
    for (const key in this) {
      const val = this[key];
      if (typeof val === 'function') continue;
      if (!first) {
        str += `\n${key} = ${val}`;
      } else {
        str += `${key} = ${val}`;
        first = false;
      }
    }
    return str;
  },
};

imports.package.init({
  name: '@APP_ID@',
  version: '@VERSION@',
  prefix: '@PREFIX@',
  libdir: '@LIBDIR@',
});

setConsoleLogDomain('steam-vpk');

const getMain = new GLib.MainLoop(null, false);
// @ts-expect-error
import('resource:///com/github/kinten108101/SteamVPK/js/main.js')
  .then(mod => {
    GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
      getMain.quit();
      imports.package.run(mod);
      return GLib.SOURCE_REMOVE;
    });
  }).catch(logError);
getMain.run();
