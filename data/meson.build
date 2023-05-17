blueprints = custom_target('blueprints',
  input: files(
    'ui/add-addon.blp',
    'ui/add-addon-preview.blp',
    'ui/add-addon-url.blp',
    'ui/addonlist-page.blp',
    'ui/addonlist-row.blp',
    'ui/addonlist-section.blp',
    'ui/download-page.blp',
    'ui/main-window.blp',
    'ui/omnibar-popover.blp',
    'ui/omnibar.blp',
    'ui/preferences-window.blp',
    'ui/new-profile.blp'
  ),
  output: '.',
  command: [find_program('blueprint-compiler'), 'batch-compile', '@OUTPUT@', '@CURRENT_SOURCE_DIR@', '@INPUT@'],
)

install_data(
  APPID + '.gschema.xml',
  install_dir: get_option('datadir') / 'glib-2.0' / 'schemas'
)

gnome.compile_resources(
	APPID + '.data',
	APPID + '.data.gresource.xml',
	dependencies: blueprints,
	gresource_bundle: true,
	install: true,
	install_dir: INSTALL_DIR
)
