script = [
  'backend/client.ts',
  'dialogs/file-dialog.ts',
  'dialogs/message-dialog.ts',
  'dialogs/window-promiser.ts',
  'model/addonlist.ts',
  'model/archivelist.ts',
  'model/repositorylist.ts',
  'model/status-manager.ts',
  'steam-vpk-utils/dbus-utils.ts',
  'steam-vpk-utils/portals.ts',
  'steam-vpk-utils/utils.ts',
  'steam-vpk-utils/weakrefmap.ts',
  'ui/addons-panel.ts',
  'ui/field-row.ts',
  'ui/headerbox.ts',
  'ui/inject-button-set.ts',
  'ui/profile-bar.ts',
  'ui/spinning-button.ts',
  'ui/themeselector.ts',
  'about.ts',
  'action-builder.ts',
  'addon-details-archive-list.ts',
  'addon-details-leaflet-page.ts',
  'addon-details-update.ts',
  'addon-storage-controls.ts',
  'addons-panel-actions.ts',
  'application.ts',
  'archive-controls.ts',
  'const.ts',
  'debug-window.ts',
  'download-page-present.ts',
  'download-page.ts',
  'gtk.ts',
  'inject-console-presenter.ts',
  'launchpad-present.ts',
  'launchpad.ts',
  'main.ts',
  'markup.ts',
  'preferences-window.ts',
  'shortcuts.ts',
  'stack-controller.ts',
  'status-broker.ts',
  'toast-builder.ts',
  'typed-builder.ts',
  'window.ts',
]
script_files = files(script)

tsc_out = join_paths(meson.project_build_root(), 'tsc-out-steam-vpk')

_build_root = meson.project_build_root() / '@0@'
typescript_steam_vpk = custom_target(
  'typescript-compile-steam-vpk',
  input: script_files,
  build_by_default: true,
  build_always_stale: true,
  command: [ yarn, yarn_args, 'run', 'tsc',
    '--outDir', tsc_out,
    '--project', meson.project_source_root() / 'tsconfig.json',
    ],
  depends: [ yarn_deps ],
  output: [ 'tsc-output' ],
)

SRC = ''
foreach x : script
  SRC = ''.join([SRC, '<file>'])
  SRC = ''.join([SRC, x.replace('.ts', '.js')])
  SRC = ''.join([SRC, '</file>'])
endforeach

src_manifest = configure_file(
  input:  'com.github.kinten108101.SteamVPK.src.xml.in',
  output: 'com.github.kinten108101.SteamVPK.src.xml',
  configuration: {
    'SRC': SRC,
  },
)

src_resource = gnome.compile_resources(
  'com.github.kinten108101.SteamVPK.src',
  src_manifest,
  dependencies: typescript_steam_vpk,
  source_dir: tsc_out,
  gresource_bundle: true,
  install: true,
  install_dir: get_option('datadir') / 'com.github.kinten108101.SteamVPK',
)

steam_vpk_launcher = configure_file(
  input: 'com.github.kinten108101.SteamVPK.js.in',
  output: 'com.github.kinten108101.SteamVPK.js',
  configuration: {
    'GJS': gjs_console,
    'APP_ID': 'com.github.kinten108101.SteamVPK',
    'VERSION': meson.project_version(),
    'PREFIX': get_option('prefix'),
    'LIBDIR': get_option('prefix') / get_option('libdir'),
  },
)

install_data(
  steam_vpk_launcher,
  rename: 'com.github.kinten108101.SteamVPK',
  install_dir: get_option('bindir'),
  install_mode: 'rwxrwxrwx',
)
