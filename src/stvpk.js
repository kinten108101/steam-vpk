#!@GJS@ -m

import GLib from 'gi://GLib';

imports.package.init({
  name: '@APP_ID@',
  version: '@VERSION@',
  prefix: '@PREFIX@',
  libdir: '@PREFIX@/@LIBDIR@',
});

const getConfig = new GLib.MainLoop(null, false);
import('resource://@APP_RDNN@/js/config.js')
  .then(mod => {
    GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
      const { Config } = mod;
      Config.init({
        app_id: '@APP_ID@',
        app_rdnn: '@APP_RDNN@',
        app_fullname: '@APP_FULLNAME@',
        app_shortname: '@APP_SHORTNAME@',
        version: '@VERSION@',
        prefix: '@PREFIX@',
        lib_dir: '@LIBDIR@',
        data_dir: '@DATADIR@',
        config_dir: GLib.get_user_config_dir(),
        usr_data_dir: GLib.get_user_data_dir(),
        pkg_data_dir: GLib.build_filenamev(['@PREFIX@', '@DATADIR@', '@APP_ID@']),
        pkg_user_data_dir: GLib.build_filenamev([GLib.get_user_data_dir(), '@APP_SHORTNAME@']),
        usr_state_dir: GLib.get_user_state_dir(),
        pkg_usr_state_dir: GLib.build_filenamev([GLib.get_user_state_dir(), `@APP_SHORTNAME@`]),
        build_type: '@BUILD_TYPE@',
        webapi: 'a495b2096303c5909ee32b808fa608b3',
        oauth: 'ac52a3a6c7496f8f71be2cf9f3fefdc7',
      });
      getConfig.quit();
      return GLib.SOURCE_REMOVE;
    });
  }).catch(logError);
getConfig.run();

const getMain = new GLib.MainLoop(null, false);
import('resource://@APP_RDNN@/js/main.js')
  .then(mod => {
    GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
      getMain.quit();
      imports.package.run(mod);
      return GLib.SOURCE_REMOVE;
    });
  }).catch(logError);
getMain.run();
