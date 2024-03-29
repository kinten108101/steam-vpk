script = [
  'actions/debug/addonlist.js',
  'actions/debug/repository.js',
  'actions/add-addon.js',
  'actions/addon-details.js',
  'actions/addon-storage-controls.js',
  'actions/addons-panel-actions.js',
  'actions/archive-controls.js',
  'actions/headerbox.js',
  'actions/injection.js',
  'actions/navigate-to-store-page.js',
  'actions/settings.js',
  'actions/shortcuts.js',
  'actions/stack-controller.js',
  'actions/status-debug-actions.js',
  'backend/addons-proxy.ts',
  'backend/api.ts',
  'backend/client.ts',
  'backend/profile-proxy.ts',
  'dialogs/add-addon-name.js',
  'dialogs/add-addon-url.ts',
  'model/addon-details-select.ts',
  'model/addonlist.ts',
  'model/archive-select.ts',
  'model/archive-store.ts',
  'model/notification.ts',
  'model/repository.ts',
  'model/status-manager.ts',
  'presenters/settings/devel-style.js',
  'presenters/settings/inject-button-styles.js',
  'presenters/settings/text-markup.js',
  'presenters/addon-details-presenter.ts',
  'presenters/download-page-presenter.ts',
  'presenters/folder.js',
  'presenters/headerbox-interaction.js',
  'presenters/inject-button-set-presenter.ts',
  'presenters/inject-console-presenter.ts',
  'presenters/launchpad-page-presenter.ts',
  'presenters/notification.ts',
  'presenters/settings.js',
  'presenters/static-archive-store-presenter.ts',
  'presenters/status-broker.js',
  'presenters/store-details.js',
  'presenters/text-markup-presenter.ts',
  'presenters/usage-presenter.js',
  'steam-vpk-utils/dbus-utils.ts',
  'steam-vpk-utils/portals.ts',
  'steam-vpk-utils/utils.ts',
  'steam-vpk-utils/weakrefmap.ts',
  'ui/addon-details/archive-list.ts',
  'ui/headerbox/build.ts',
  'ui/headerbox/console.ts',
  'ui/store-page/install-button.js',
  'ui/activatable-row.ts',
  'ui/addon-details.ts',
  'ui/addons-panel-disk.ts',
  'ui/addons-panel.ts',
  'ui/download-page.ts',
  'ui/field-row.js',
  'ui/headerbox.ts',
  'ui/icon-with-badge.js',
  'ui/inject-button-set.ts',
  'ui/launchpad.ts',
  'ui/preferences-window.ts',
  'ui/profile-bar.js',
  'ui/sensitizable-widgets.js',
  'ui/shortcut-label.js',
  'ui/spinning-button.js',
  'ui/store-page.js',
  'ui/swipe-tracker.js',
  'ui/themeselector.js',
  'utils/async-signals.js',
  'utils/base64.js',
  'utils/const.js',
  'utils/files.js',
  'utils/gtk.js',
  'utils/markup.js',
  'utils/use-semaphore.ts',
  'windows/about.js',
  'windows/headerbox-detachable.js',
  'windows/main-window.ts',
  'application.js',
  'gtype.js',
  'main.js',
  'promisify.js',
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
  input: 'com.github.kinten108101.SteamVPK.js',
  output: 'com.github.kinten108101.SteamVPK.js',
  configuration: {
    'GJS': gjs_console,
    'VERSION': meson.project_version(),
    'PREFIX': get_option('prefix'),
    'LIBDIR': get_option('prefix') / get_option('libdir'),
    'BUILDTYPE': get_option('buildtype'),
    'FLATPAK': get_option('flatpak'),
  },
)

install_data(
  steam_vpk_launcher,
  rename: 'com.github.kinten108101.SteamVPK',
  install_dir: get_option('bindir'),
  install_mode: 'rwxrwxrwx',
)
