script = [
  'actions/add-addon.ts',
  'actions/addon-details.ts',
  'actions/addon-storage-controls.ts',
  'actions/addons-panel-actions.ts',
  'actions/archive-controls.ts',
  'actions/headerbox.ts',
  'actions/injection.ts',
  'actions/settings.ts',
  'actions/shortcuts.ts',
  'actions/stack-controller.ts',
  'actions/status-debug-actions.ts',
  'backend/client.ts',
  'dialogs/add-addon-name.ts',
  'dialogs/add-addon-url.ts',
  'dialogs/file-dialog.ts',
  'dialogs/message-dialog.ts',
  'model/addonlist.ts',
  'model/archivelist.ts',
  'model/repositorylist.ts',
  'model/status-manager.ts',
  'presenters/settings/inject-button-styles.ts',
  'presenters/addon-details-update.ts',
  'presenters/download-page-present.ts',
  'presenters/inject-button-set-restore.ts',
  'presenters/inject-console-presenter.ts',
  'presenters/launchpad-present.ts',
  'presenters/settings.ts',
  'presenters/status-broker.ts',
  'presenters/usage-presenter.ts',
  'steam-vpk-utils/dbus-utils.ts',
  'steam-vpk-utils/files.ts',
  'steam-vpk-utils/portals.ts',
  'steam-vpk-utils/utils.ts',
  'steam-vpk-utils/weakrefmap.ts',
  'ui/addon-details-archive-list.ts',
  'ui/addon-details-leaflet-page.ts',
  'ui/addons-panel.ts',
  'ui/download-page.ts',
  'ui/field-row.ts',
  'ui/headerbox.ts',
  'ui/inject-button-set.ts',
  'ui/launchpad-rows.ts',
  'ui/launchpad.ts',
  'ui/preferences-window.ts',
  'ui/profile-bar.ts',
  'ui/spinning-button.ts',
  'ui/themeselector.ts',
  'utils/action-builder.ts',
  'utils/async-signals.ts',
  'utils/const.ts',
  'utils/gtk.ts',
  'utils/markup.ts',
  'utils/toast-builder.ts',
  'utils/typed-builder.ts',
  'utils/window-promiser.ts',
  'windows/about.ts',
  'windows/debug-window.ts',
  'windows/headerbox-detachable.ts',
  'windows/main-window.ts',
  'application.ts',
  'main.ts',
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
