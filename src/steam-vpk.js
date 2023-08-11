#!@GJS@ -m

import GLib from 'gi://GLib';

imports.package.init({
  name: '@APP_ID@',
  version: '@VERSION@',
  prefix: '@PREFIX@',
  libdir: '@PREFIX@/@LIBDIR@',
});

const getConst = new GLib.MainLoop(null, false);
import('resource:///com/github/kinten108101/SteamVPK/js/const.js')
  .then(mod => {
    GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
      const { default: Const } = mod;
      Const.init({
        version: '@VERSION@',
        build_type: '@BUILD_TYPE@',
      });
      getConst.quit();
      return GLib.SOURCE_REMOVE;
    });
  }).catch(logError);
getConst.run();

const getMain = new GLib.MainLoop(null, false);
import('resource:///com/github/kinten108101/SteamVPK/js/main.js')
  .then(mod => {
    GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
      getMain.quit();
      imports.package.run(mod);
      return GLib.SOURCE_REMOVE;
    });
  }).catch(logError);
getMain.run();
