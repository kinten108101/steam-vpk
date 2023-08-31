interface = []
interface_files = []

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
  'ui/addons-panel-disk-allocate.blp',
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
  'ui/headerbox.blp',
  'ui/inject-button-set.blp',
  'ui/launchpad-page.blp',
  'ui/launchpad-row.blp',
  'ui/launchpad-section.blp',
  'ui/navigate-row.blp',
  'ui/preferences-window.blp',
  'ui/profile-bar.blp',
  'ui/profile-window.blp',
  'ui/repository-page.blp',
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
    'batch-compile', # action
    '--typelib-path', typelibdir_abs, # config
    '@OUTPUT@', '@CURRENT_SOURCE_DIR@', '@INPUT@'], # targets
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
  input:  'resource.data.gresource.xml.in',
  output: 'resource.data.gresource.xml',
  configuration: {
    'APP_RDNN': app_rdnn,
    'UI': UI,
    'ICONS': ICONS,
  },
)

data_resource = gnome.compile_resources(
  app_id + '.data',
  data_manifest,
  dependencies: blueprints,
  gresource_bundle: true,
  install: true,
  install_dir: pkgdatadir
)

icondir = 'icons' / 'hicolor' / 'scalable' / 'apps'
install_data(
  meson.project_source_root() / 'data' / 'resources' / 'logo' / 'addon-box.svg',
  install_dir: datadir / icondir
)

desktop_conf = configuration_data()
desktop_conf.set('APP_ID', app_id)
desktop_conf.set('APP_FULLNAME', app_fullname)
desktop_file = configure_file(
  input: 'addonbox.desktop.in',
  output: '@0@.desktop'.format(app_id),
  configuration: desktop_conf,
  install: true,
  install_dir: datadir / 'applications',
)

configure_file(
  input: 'resource.gschema.xml',
  output: 'com.github.kinten108101.SteamVPK.gschema.xml',
  copy: true,
  install_dir: datadir / 'glib-2.0' / 'schemas',
)
