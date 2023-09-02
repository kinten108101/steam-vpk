interface = [
  'gtk/menus.blp',
  'gtk/help-overlay.blp',
  'ui/add-addon-name.blp',
  'ui/add-addon-url-input-url.blp',
  'ui/add-addon-url-preview-download.blp',
  'ui/add-addon-url.blp',
  'ui/addon-details-archive-list-row.blp',
  'ui/addon-details-context-label.blp',
  'ui/addon-details-lozenge.blp',
  'ui/addon-details-peek-file.blp',
  'ui/addon-details.blp',
  'ui/addons-panel-disk.blp',
  'ui/addons-panel.blp',
  'ui/create-profile.blp',
  'ui/debug-window.blp',
  'ui/debug-window-action-row.blp',
  'ui/download-page-row.blp',
  'ui/download-page.blp',
  'ui/download-window-row.blp',
  'ui/download-window.blp',
  'ui/field-row.blp',
  'ui/headerbox-build.blp',
  'ui/headerbox-console.blp',
  'ui/headerbox-detachable.blp',
  'ui/headerbox.blp',
  'ui/inject-button-set.blp',
  'ui/launchpad-page.blp',
  'ui/launchpad-row.blp',
  'ui/launchpad-section.blp',
  'ui/preferences-window.blp',
  'ui/profile-bar.blp',
  'ui/spinning-button.blp',
  'ui/themeselector.blp',
  'ui/window.blp',
]

interface_files = files(interface)

blueprints = custom_target('blueprints',
  input: interface_files,
  output: '.',
  build_by_default: true,
  build_always_stale: true,
  command: [blueprint_compiler,
    'batch-compile',
    '@OUTPUT@', '@CURRENT_SOURCE_DIR@', '@INPUT@'],
)

UI = ''
foreach x : interface
  UI = ''.join([UI, '<file>'])
  UI = ''.join([UI, x.replace('.blp', '.ui')])
  UI = ''.join([UI, '</file>'])
endforeach

icons = []
subdir('icons')

ICONS = ''
foreach x : icons
  ICONS = ''.join([ICONS, '<file alias="'])
  ICONS = ''.join([ICONS, x])
  ICONS = ''.join([ICONS, '">icons/'])
  ICONS = ''.join([ICONS, x])
  ICONS = ''.join([ICONS, '</file>'])
endforeach

data_manifest = configure_file(
  input:  'com.github.kinten108101.SteamVPK.data.xml.in',
  output: 'com.github.kinten108101.SteamVPK.data.xml',
  configuration: {
    'UI': UI,
    'ICONS': ICONS,
  },
)

data_resource = gnome.compile_resources(
  'com.github.kinten108101.SteamVPK.data',
  data_manifest,
  dependencies: blueprints,
  gresource_bundle: true,
  install: true,
  install_dir: get_option('datadir') / 'com.github.kinten108101.SteamVPK',
)

install_data(
  meson.project_source_root() / 'data' / 'resources' / 'logo' / 'com.github.kinten108101.SteamVPK.svg',
  install_dir: get_option('datadir') / 'icons' / 'hicolor' / 'scalable' / 'apps'
)

install_data(
  meson.project_source_root() / 'data' / 'com.github.kinten108101.SteamVPK.desktop',
  install_dir: get_option('datadir') / 'applications'
)

configure_file(
  input: 'resource.gschema.xml',
  output: 'com.github.kinten108101.SteamVPK.gschema.xml',
  copy: true,
  install_dir: get_option('datadir') / 'glib-2.0' / 'schemas',
)
