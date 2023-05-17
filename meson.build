project(
	'SteamVpk',
	version: '0.0.1',
	license: ['GPL-3.0-or-later'],
	meson_version: '>= 0.59.0',
)

APPID = 'com.github.kinten108101.SteamVpk'
INSTALL_DIR = get_option('datadir') / APPID

gnome = import('gnome')

subdir('data')
subdir('steamvpk')

gnome.post_install(
  glib_compile_schemas: true
)
