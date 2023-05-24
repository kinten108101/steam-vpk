#local_schemas = configure_file(
#  input: 'steam-vpk.gschema.xml',
#  output: 'steam-vpk.gschema.xml',
#  copy: true,
#)

install_data(
  'steam-vpk.gschema.xml',
  install_dir: get_option('datadir') / 'glib-2.0' / 'schemas'
)

gschema_compiler = find_program('glib-compile-schemas', required: false)

compile_local_schemas = custom_target(
  'compile_local_schemas',
  input: 'steam-vpk.gschema.xml',
  output: 'gschemas.compiled',
  command: [gschema_compiler, meson.current_build_dir()]
)

if gschema_compiler.found()
  test('Validate schema file',
       gschema_compiler,
       args: ['--strict', '--dry-run', meson.current_source_dir()])
endif

subdir('ui')

ui_fillin = ''
foreach name : ui_templates
  ui_fillin = ''.join([ui_fillin, '<file>ui/'])
  ui_fillin = ''.join([ui_fillin, name.replace('.blp', '.ui')])
  ui_fillin = ''.join([ui_fillin, '</file>'])
endforeach

subdir('icons')

icons_fillin = ''
foreach name : icons
  icons_fillin = ''.join([icons_fillin, '<file alias="'])
  icons_fillin = ''.join([icons_fillin, name])
  icons_fillin = ''.join([icons_fillin, '">icons/'])
  icons_fillin = ''.join([icons_fillin, name])
  icons_fillin = ''.join([icons_fillin, '</file>'])
endforeach

data_manifest = configure_file(
  input: 'steam-vpk.data.gresource.xml.in',
  output: 'steam-vpk.data.gresource.xml',
  configuration: {
    'UI_FILES': ui_fillin,
    'ICON_FILES': icons_fillin,
  },
)

data_resource = gnome.compile_resources(
	APPID + '.data',
	data_manifest,
  dependencies: blueprints,
  source_dir: meson.project_build_root() / 'data',
	gresource_bundle: true,
	install: true,
	install_dir: pkgdatadir
)
