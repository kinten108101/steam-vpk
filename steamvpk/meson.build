configure_file(
	input: APPID + '.js',
	output: APPID,
	configuration: {
		'GJS': find_program('gjs').full_path(),
		'PACKAGE_NAME': APPID,
		'PACKAGE_VERSION': meson.project_version(),
		'PREFIX': get_option('prefix'),
		'LIBDIR': get_option('prefix') / get_option('libdir')
	},
	install_dir: get_option('bindir'),
	install_mode: 'rwxr-xr-x'
)

app_resource = gnome.compile_resources(
	APPID + '.src',
	APPID + '.src.gresource.xml',
	gresource_bundle: true,
	install: true,
	install_dir: INSTALL_DIR
)