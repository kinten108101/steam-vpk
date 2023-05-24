project(
	'steam-vpk',
	version: '0.4.0',
	meson_version: '>= 0.63.0',
	license: ['GPL-3.0-or-later'],
)

gnome = import('gnome')

APPID = 'com.github.kinten108101.SteamVpk'
if get_option('build-type') == 'dev'
	APPID = ''.join([APPID,'.Dev'])
endif

pkgdatadir = get_option('datadir') / APPID

gjs_lib = dependency('gjs-1.0', version: '>= 1.76.0', required: true)
gjs_console = gjs_lib.get_variable(pkgconfig: 'gjs_console')
yarn = find_program('yarn', required: true)

yarn_args = []

subdir('build-node-env')
subdir('data')
subdir('src')

gnome.post_install(
  glib_compile_schemas: true,
  gtk_update_icon_cache: true,
)
