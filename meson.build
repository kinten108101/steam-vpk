project(
	'steam-vpk',
	version: 'alpha',
	meson_version: '>= 0.63.0',
	license: ['GPL-3.0-or-later'],
)

gnome = import('gnome')
fs = import('fs')

app_id = 'com.github.kinten108101.SteamVPK'
pkgdatadir = get_option('datadir') / app_id
app_rdnn = '/com/github/kinten108101/SteamVPK'
app_fullname = 'Steam VPK'
app_shortname = 'steam-vpk'

server = find_program('com.github.kinten108101.SteamVPK.Server', required: true)
yarn = find_program('yarn', version: '>=1.22.19', required: true)
gjs = dependency('gjs-1.0', version: '>=1.76.0', required: true)
gjs_console = gjs.get_variable(pkgconfig: 'gjs_console')
gtk4 = dependency('gtk4', version: '>=4.10.3', required: true)
adw1 = dependency('libadwaita-1', version: '>=1.3.2', required: true)
soup3 = dependency('libsoup-3.0', version: '>=3.4.2', required: true)
blueprint_compiler = find_program('blueprint-compiler', version: '>=0.8.0', required: true)

datadir = get_option('datadir')
girdir = 'gir-1.0'
girdir_abs = get_option('prefix') / get_option('datadir') / girdir
typelibdir = 'girepository-1.0'
typelibdir_abs = get_option('prefix') / get_option('libdir') / typelibdir

yarn_args = []

offline_mirror = get_option('offline-mirror')
if offline_mirror != ''
  run_command(
    'yarn',
    'config',
    '--offline',
    'set',
    'yarn-offline-mirror',
    offline_mirror,
    env: { 'HOME': meson.project_build_root() },
    check: true
  )
  yarn_args += [
    '--offline',
    '--prod',
    '--frozen-lockfile',
    '--use-yarnrc', meson.project_build_root() / '.yarnrc'
  ]
endif

yarn_deps = custom_target(
  'yarn-deps',
  command: [ yarn, 'install', yarn_args ],
  output: [ 'yarn-deps-out' ],
)

subdir('data')
subdir('src')

gnome.post_install(
  glib_compile_schemas: true,
  gtk_update_icon_cache: true,
  update_desktop_database: true,
)
