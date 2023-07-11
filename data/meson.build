interface = []
interface_files = []
subdir('ui')

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
  UI = ''.join([UI, '<file>ui/'])
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

test('GSettings schema test', gschema_compiler, args: ['--strict', '--dry-run', meson.current_build_dir()])

configure_file(
  input: 'resource.gschema.xml.in',
  output: app_id + '.gschema.xml',
  configuration: {
    'APP_ID': app_id,
    'APP_RDNN': app_rdnn,
  },
  install_dir: get_option('datadir') / 'glib-2.0' / 'schemas',
)

icondir = 'icons' / 'hicolor' / 'scalable' / 'apps'
install_data(
  'resources' / 'logo' / 'addon-box.svg',
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
