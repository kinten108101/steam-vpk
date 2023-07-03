project(
	'stvpk',
	version: '0.5.0',
	meson_version: '>= 0.63.0',
	license: ['GPL-3.0-or-later'],
)

yarn = find_program('yarn', version: '>=1.22.19', required: true)
gjs = dependency('gjs-1.0', version: '>=1.76.0', required: true)
gjs_console = gjs.get_variable(pkgconfig: 'gjs_console')
gtk4 = dependency('gtk4', version: '>=4.10.3', required: true)
adw1 = dependency('libadwaita-1', version: '>=1.3.3', required: true)
soup3 = dependency('libsoup-3.0', version: '>=3.4.2', required: true)
panel1 = dependency('libpanel-1', version: '>=1.1.0', required: true)
blueprint_compiler = find_program('blueprint-compiler', version: '>=0.8.0', required: true)
gschema_compiler = find_program('glib-compile-schemas', required: true)

gnome = import('gnome')
fs = import('fs')

app_id = 'com.github.kinten108101.SteamVpk'
app_rdnn = '/com/github/kinten108101/SteamVpk'
app_fullname = 'Add-on Box'
app_shortname = 'addon-box'
if get_option('buildtype') == 'debug'
	app_id = ''.join([app_id, '.Dev'])
	app_rdnn = ''.join([app_rdnn, '/Dev'])
endif

pkgdatadir = get_option('datadir') / app_id
girdir = 'gir-1.0'
girdir_abs = get_option('prefix') / get_option('datadir') / girdir
typelibdir = 'girepository-1.0'
typelibdir_abs = get_option('prefix') / get_option('libdir') / typelibdir

yarn_args = []
subdir('build-node-env')
subdir('data')
subdir('src')

gnome.post_install(
  glib_compile_schemas: true,
  gtk_update_icon_cache: true,
)
