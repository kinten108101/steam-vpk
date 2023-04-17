blueprints = custom_target('blueprints',
  input: files(
    'ui/addonlist-list-box.blp',
    'ui/addonlist-page.blp',
    'ui/addonlist-row.blp',
    'ui/download-page.blp',
    'ui/main-window.blp',
    'ui/omnibar-popover.blp',
    'ui/omnibar.blp',
    'ui/preferences-window.blp'
  ),
  output: '.',
  command: [find_program('blueprint-compiler'), 'batch-compile', '@OUTPUT@', '@CURRENT_SOURCE_DIR@', '@INPUT@'],
)

gnome.compile_resources(
	APPID + '.data',
	APPID + '.data.gresource.xml',
	dependencies: blueprints,
	gresource_bundle: true,
	install: true,
	install_dir: INSTALL_DIR
)
